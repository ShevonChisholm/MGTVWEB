type Job = {
  work: () => Promise<unknown>;
  resolve: (v: any) => void;
  reject: (e: unknown) => void;
  signal?: AbortSignal;
  abort?: () => void;
};
export function createCatalogReadQueue(limit = 2) {
  if (!Number.isInteger(limit) || limit < 1)
    throw new RangeError("Invalid read concurrency");
  let running = 0;
  const pending: Job[] = [];
  const pump = () => {
    while (running < limit && pending.length) {
      const job = pending.shift()!;
      if (job.abort) job.signal?.removeEventListener("abort", job.abort);
      if (job.signal?.aborted) {
        job.reject(new DOMException("Cancelled", "AbortError"));
        continue;
      }
      running++;
      void Promise.resolve()
        .then(job.work)
        .then(job.resolve, job.reject)
        .finally(() => {
          running--;
          pump();
        });
    }
  };
  return <T>(work: () => Promise<T>, signal?: AbortSignal) =>
    new Promise<T>((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException("Cancelled", "AbortError"));
        return;
      }
      const job: Job = { work, resolve, reject, signal };
      job.abort = () => {
        const index = pending.indexOf(job);
        if (index >= 0) {
          pending.splice(index, 1);
          reject(new DOMException("Cancelled", "AbortError"));
        }
      };
      signal?.addEventListener("abort", job.abort, { once: true });
      pending.push(job);
      pump();
    });
}
export const scheduleCatalogRead = createCatalogReadQueue(2);
