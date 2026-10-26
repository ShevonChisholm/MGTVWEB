import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import ts from "typescript"
import { moduleUrl, loadModule } from "./load-module.mjs"
const { createCustomerSessionStore } = await loadModule(
  "src/lib/customerSessionStore.ts",
)
const deferred = () => {
  let resolve, reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
const guestError = Object.assign(new Error("Sign in required"), { status: 401 })
let passed = 0
async function test(name, run) {
  await run()
  passed++
  console.log(`PASS ${name}`)
}
function setup() {
  let time = 0,
    calls = 0
  const requests = []
  const store = createCustomerSessionStore({
    read: () => {
      calls++
      const request = deferred()
      requests.push(request)
      return request.promise
    },
    isGuest: (error) => error?.status === 401,
    now: () => time,
  })
  return {
    store,
    requests,
    calls: () => calls,
    advance: (ms) => {
      time += ms
    },
  }
}
await test("twelve consumers share one initial request and guest snapshot", async () => {
  const t = setup()
  let updates = 0
  const unsubscribers = Array.from({ length: 12 }, () =>
    t.store.subscribe(() => updates++),
  )
  const requests = Array.from({ length: 12 }, () => t.store.refresh())
  assert(requests.every((request) => request === requests[0]))
  await Promise.resolve()
  assert.equal(t.calls(), 1)
  t.requests[0].reject(guestError)
  await Promise.all(requests)
  assert.deepEqual(t.store.getSnapshot(), {
    session: null,
    loading: false,
    error: "",
  })
  assert.equal(updates, 12)
  unsubscribers.forEach((stop) => stop())
  await t.store.refresh()
  assert.equal(t.calls(), 1)
})
await test("signed-in consumers and route remounts share identity", async () => {
  const t = setup()
  const promise = t.store.refresh()
  await Promise.resolve()
  const identity = {
    customerId: "customer",
    activeProfileId: "adult",
    csrfToken: "test-only",
  }
  t.requests[0].resolve(identity)
  await promise
  const snapshot = t.store.getSnapshot()
  await Promise.all(Array.from({ length: 12 }, () => t.store.refresh()))
  assert.equal(t.calls(), 1)
  assert.equal(t.store.getSnapshot(), snapshot)
  assert.equal(snapshot.session, identity)
})
await test("freshness expiration revalidates once without polling", async () => {
  const t = setup()
  let promise = t.store.refresh()
  await Promise.resolve()
  t.requests[0].reject(guestError)
  await promise
  t.advance(29_999)
  await t.store.refresh()
  assert.equal(t.calls(), 1)
  t.advance(1)
  promise = t.store.refresh()
  const duplicate = t.store.refresh()
  assert.equal(promise, duplicate)
  await Promise.resolve()
  assert.equal(t.calls(), 2)
  t.requests[1].resolve({ activeProfileId: "adult" })
  await promise
  assert.equal(t.store.getSnapshot().session.activeProfileId, "adult")
})
await test("sign-in invalidation ignores an older guest response", async () => {
  const t = setup()
  const old = t.store.refresh()
  await Promise.resolve()
  t.store.invalidate()
  const current = t.store.refresh()
  await Promise.resolve()
  t.requests[1].resolve({ activeProfileId: "new-profile" })
  await current
  t.requests[0].reject(guestError)
  await old
  assert.equal(t.store.getSnapshot().session.activeProfileId, "new-profile")
})
await test("sign-out invalidation cannot resurrect an older signed-in response", async () => {
  const t = setup()
  const old = t.store.refresh()
  await Promise.resolve()
  t.store.invalidate()
  const current = t.store.refresh()
  await Promise.resolve()
  t.requests[1].reject(guestError)
  await current
  t.requests[0].resolve({ activeProfileId: "old-profile" })
  await old
  assert.equal(t.store.getSnapshot().session, null)
})
await test("profile changes replace shared identity immediately", async () => {
  const t = setup()
  let promise = t.store.refresh()
  await Promise.resolve()
  t.requests[0].resolve({ activeProfileId: "adult" })
  await promise
  t.store.invalidate()
  assert.equal(t.store.getSnapshot().session, null)
  assert.equal(t.store.getSnapshot().loading, true)
  promise = t.store.refresh()
  await Promise.resolve()
  t.requests[1].resolve({ activeProfileId: "child" })
  await promise
  assert.equal(t.store.getSnapshot().session.activeProfileId, "child")
})
await test("protected session rejection clears identity and supersedes pending reads", async () => {
  const t = setup()
  const promise = t.store.refresh()
  await Promise.resolve()
  t.store.guest()
  t.requests[0].resolve({ activeProfileId: "revoked" })
  await promise
  assert.deepEqual(t.store.getSnapshot(), {
    session: null,
    loading: false,
    error: "",
  })
  await t.store.refresh()
  assert.equal(t.calls(), 1)
})
await test("network errors remain errors and do not trigger a retry storm", async () => {
  const t = setup()
  const promise = t.store.refresh()
  await Promise.resolve()
  t.requests[0].reject(new Error("Unable to reach MGTV"))
  await promise
  assert.equal(t.store.getSnapshot().error, "Unable to reach MGTV")
  assert.equal(t.store.getSnapshot().session, null)
  await Promise.all(Array.from({ length: 12 }, () => t.store.refresh()))
  assert.equal(t.calls(), 1)
  t.advance(30_000)
  const retry = t.store.refresh()
  await Promise.resolve()
  t.requests[1].resolve({ activeProfileId: "recovered" })
  await retry
  assert.equal(t.store.getSnapshot().error, "")
})
await test("disabled prototype mode makes no requests", async () => {
  let calls = 0
  const store = createCustomerSessionStore({
    enabled: false,
    read: async () => {
      calls++
    },
    isGuest: () => false,
  })
  await store.refresh()
  assert.equal(calls, 0)
  assert.equal(store.getSnapshot().loading, false)
})
await test("actual auth adapter shares hook reads, refreshes identity, preserves CSRF and clears expired sessions", async () => {
  const old = {
    window: globalThis.window,
    document: globalThis.document,
    localStorage: globalThis.localStorage,
    fetch: globalThis.fetch,
  }
  const windowTarget = new EventTarget(),
    documentTarget = new EventTarget()
  documentTarget.visibilityState = "visible"
  globalThis.window = windowTarget
  globalThis.document = documentTarget
  globalThis.localStorage = { setItem() {} }
  const calls = []
  let identity = null,
    delayed = null
  globalThis.fetch = async (path, options) => {
    calls.push({ path, options })
    if (path.endsWith("/delayed")) return delayed.promise
    if (path.endsWith("/protected"))
      return Response.json({ code: "SESSION_EXPIRED", message: "Expired" }, {
        status: 401,
      })
    if (path.endsWith("/session"))
      return identity
        ? Response.json(identity)
        : Response.json({ code: "SESSION_REQUIRED" }, { status: 401 })
    return Response.json({ ok: true })
  }
  const dataUrl = (source) =>
    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
  let source = await readFile("src/lib/customerAuth.ts", "utf8")
  source = source
    .replace(
      '"react"',
      JSON.stringify(
        dataUrl(
          "export const useEffect = f => f(); export const useSyncExternalStore = (s,g) => g();",
        ),
      ),
    )
    .replace(
      '"react-router"',
      JSON.stringify(
        dataUrl('export const useLocation = () => ({pathname:"/"});'),
      ),
    )
    .replace(
      '"./customerSessionStore"',
      JSON.stringify(await moduleUrl("src/lib/customerSessionStore.ts")),
    )
    .replace("import.meta.env.VITE_API_MODE", '"connected"')
  const js = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText
  try {
    const auth = await import(dataUrl(js))
    Array.from({ length: 12 }, () => auth.useCustomerSession())
    assert.equal(await auth.getCustomerSession(), null)
    assert.equal(calls.filter((c) => c.path.endsWith("/session")).length, 1)
    identity = {
      customerId: "test-customer",
      activeProfileId: null,
      csrfToken: "login-csrf",
    }
    auth.authChanged()
    await auth.getCustomerSession()
    assert.equal(auth.useCustomerSession().session.customerId, "test-customer")
    assert.equal(calls.filter((c) => c.path.endsWith("/session")).length, 2)
    identity = {
      ...identity,
      activeProfileId: "main-profile",
      csrfToken: "profile-csrf",
    }
    auth.authChanged()
    await auth.getCustomerSession()
    assert.equal(
      auth.useCustomerSession().session.activeProfileId,
      "main-profile",
    )
    delayed = deferred()
    const older = auth.customerApi("/delayed")
    identity = { ...identity, csrfToken: "latest-csrf" }
    auth.authChanged()
    await auth.getCustomerSession()
    delayed.resolve(Response.json({ csrfToken: "stale-csrf" }))
    await older
    await auth.customerApi("/mutation", "POST", {})
    assert.equal(calls.at(-1).options.headers["X-CSRF-Token"], "latest-csrf")
    await assert.rejects(auth.customerApi("/protected"), /Expired/)
    assert.equal(auth.useCustomerSession().session, null)
    assert.equal(await auth.getCustomerSession(), null)
    identity = null
    auth.authChanged()
    await auth.getCustomerSession()
    assert.deepEqual(auth.useCustomerSession(), {
      session: null,
      loading: false,
      error: "",
    })
    await auth.customerApi("/mutation", "POST", {})
    assert.equal(calls.at(-1).options.headers["X-CSRF-Token"], "")
  } finally {
    Object.assign(globalThis, old)
  }
})
console.log(`${passed} total customer session checks passed`)
