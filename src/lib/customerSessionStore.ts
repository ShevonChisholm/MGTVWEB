export type SessionSnapshot<T,> = {
  session: T | null
  loading: boolean
  error: string
}
// One snapshot and one pending request per browser document, never persisted.
export function createCustomerSessionStore<T>(options: {
  read: () => Promise<T>
  isGuest: (error: unknown) => boolean
  now?: () => number
  maxAge?: number
  enabled?: boolean
}) {
  const now = options.now ?? Date.now
  const maxAge = options.maxAge ?? 30_000
  let snapshot: SessionSnapshot<T> = {
    session: null,
    loading: options.enabled !== false,
    error: "",
  }
  let checkedAt: number | null = null
  let generation = 0
  let pending: Promise<void> | null = null
  const listeners = new Set<() => void>()
  function publish(value: SessionSnapshot<T>) {
    snapshot = value
    listeners.forEach((listener) => listener())
  }
  function invalidate() {
    generation++
    pending = null
    checkedAt = null
    publish({ session: null, loading: options.enabled !== false, error: "" })
  }
  function guest() {
    generation++
    pending = null
    checkedAt = now()
    publish({ session: null, loading: false, error: "" })
  }
  function refresh(): Promise<void> {
    if (options.enabled === false) return Promise.resolve()
    if (pending) return pending
    if (checkedAt !== null && now() - checkedAt < maxAge)
      return Promise.resolve()
    const requestGeneration = generation
    // Defer the reader so synchronous subscribers also share the same request.
    pending = Promise.resolve()
      .then(options.read)
      .then(
        (session) => {
          if (generation !== requestGeneration) return
          checkedAt = now()
          publish({ session, loading: false, error: "" })
        },
        (error: unknown) => {
          if (generation !== requestGeneration) return
          checkedAt = now()
          publish({
            session: null,
            loading: false,
            error: options.isGuest(error)
              ? ""
              : error instanceof Error
                ? error.message
                : "Your session could not be checked.",
          })
        },
      )
      .finally(() => {
        if (generation === requestGeneration) pending = null
      })
    return pending
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    refresh,
    invalidate,
    guest,
  }
}
