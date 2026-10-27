import { useEffect, useSyncExternalStore } from "react"
import { createCustomerSessionStore } from "./customerSessionStore"
import { useLocation } from "react-router"
export const connectedAuth = import.meta.env.VITE_API_MODE === "connected"
let csrf = ""
let authGeneration = 0
export class CustomerAuthError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message)
  }
}
export async function customerApi(
  path: string,
  method = "GET",
  body?: unknown,
  extraHeaders: Record<string, string> = {},
): Promise<any> {
  const requestGeneration = authGeneration
  const headers: Record<string, string> = { ...extraHeaders }
  // Keep application version checks out of the proxy's HTTP cache preconditions.
  for (const name of Object.keys(headers)) {
    if (name.toLowerCase() === "if-match") {
      if (Object.keys(headers).some((key) => key.toLowerCase() === "x-mgtv-if-match"))
        throw new CustomerAuthError(400, "Supply one version precondition.")
      headers["X-MGTV-If-Match"] = headers[name]
      delete headers[name]
    }
  }
  if (body !== undefined) headers["Content-Type"] = "application/json"
  if (method !== "GET") headers["X-CSRF-Token"] = csrf
  const response = await fetch("/api/v1/customer" + path, {
    method,
    headers,
    credentials: "include",
    body: body === undefined ? undefined : JSON.stringify(body),
  }).catch(() => {
    throw new CustomerAuthError(
      0,
      "Unable to reach MGTV. Check your connection and try again.",
    )
  })
  let unreadable = false
  const result =
    response.status === 204 ? null : await response.json().catch(() => {
          unreadable = true
          return {
            message: "MGTV returned an unreadable response. Please try again.",
          }
        })
  if (!response.ok) {
    if (
      response.status === 401 &&
      ["SESSION_REQUIRED", "SESSION_EXPIRED"].includes(result?.code)
    ) {
      if (requestGeneration === authGeneration) {
        csrf = ""
        if (path !== "/session") {
          authGeneration++
          sessionStore.guest()
        }
      }
    }
    throw new CustomerAuthError(
      response.status,
      result?.message ?? "The request failed.",
      result?.code,
    )
  }
  if (unreadable) throw new CustomerAuthError(502, result.message)
  if (result?.csrfToken && requestGeneration === authGeneration)
    csrf = result.csrfToken
  return result
}
const sessionStore = createCustomerSessionStore<any>({
  read: () => customerApi("/session"),
  sameSession: (current, next) => JSON.stringify(current) === JSON.stringify(next),
  isGuest: (error) =>
    error instanceof CustomerAuthError && error.status === 401,
  enabled: connectedAuth,
})
function refreshIdentity() {
  authGeneration++
  csrf = ""
  sessionStore.invalidate()
  void sessionStore.refresh()
}
if (connectedAuth && typeof window !== "undefined") {
  window.addEventListener("mgtv-customer-auth", refreshIdentity)
  window.addEventListener("focus", () => {
    void sessionStore.refresh()
  })
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void sessionStore.refresh()
  })
  // Share only an invalidation signal across tabs, never identity or CSRF data.
  window.addEventListener("storage", (event) => {
    if (event.key === "mgtv-customer-auth-change") refreshIdentity()
  })
}
export function authChanged() {
  window.dispatchEvent(new Event("mgtv-customer-auth"))
  try {
    localStorage.setItem("mgtv-customer-auth-change", crypto.randomUUID())
  } catch {
    /* Authentication also works when browser storage is unavailable. */
  }
}
export async function getCustomerSession() {
  let generation: number
  do {
    generation = authGeneration
    await sessionStore.refresh()
  } while (generation !== authGeneration)
  const snapshot = sessionStore.getSnapshot()
  if (snapshot.error) throw new CustomerAuthError(503, snapshot.error)
  return snapshot.session
}
export function useCustomerSession() {
  const snapshot = useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getSnapshot,
    sessionStore.getSnapshot,
  )
  const location = useLocation()
  useEffect(() => {
    void sessionStore.refresh()
  }, [location.pathname])
  return snapshot
}
