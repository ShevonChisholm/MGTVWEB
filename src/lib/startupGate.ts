/** A scheduling gate only; never authorizes customer content or changes access policy. */
export function createStartupGate(
  schedule: (
    f: () => void,
    ms: number,
  ) => ReturnType<typeof setTimeout> = setTimeout,
  cancel: (id: ReturnType<typeof setTimeout>) => void = clearTimeout,
) {
  let ready = false,
    timer: ReturnType<typeof setTimeout> | undefined;
  const listeners = new Set<() => void>();
  function release() {
    if (ready) return;
    ready = true;
    if (timer !== undefined) cancel(timer);
    timer = undefined;
    listeners.forEach((f) => f());
  }
  function ensure() {
    if (!ready && timer === undefined) timer = schedule(release, 5000);
  }
  function wait(signal?: AbortSignal): Promise<boolean> {
    if (signal?.aborted) return Promise.resolve(false);
    if (ready) return Promise.resolve(true);
    ensure();
    return new Promise((resolve) => {
      const done = (value: boolean) => {
        listeners.delete(onReady);
        signal?.removeEventListener("abort", onAbort);
        resolve(value);
      };
      const onReady = () => done(true),
        onAbort = () => done(false);
      listeners.add(onReady);
      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }
  return {
    getSnapshot: () => ready,
    release,
    ensure,
    wait,
    subscribe(f: () => void) {
      listeners.add(f);
      return () => {
        listeners.delete(f);
      };
    },
  };
}
