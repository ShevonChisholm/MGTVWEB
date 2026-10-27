type PaintEntry = PerformanceEntry & {
  element?: Element;
  url?: string;
  size?: number;
  renderTime?: number;
  loadTime?: number;
};
const ms = (value: number) => Math.round(value * 10) / 10;
/** Explicit local-console review only: no IDs, URLs, tokens, customer data or telemetry requests. */
export function startPerformanceReview() {
  if (
    typeof PerformanceObserver === "undefined" || !PerformanceObserver.supportedEntryTypes?.includes(
      "largest-contentful-paint",
    )
  )
    return;
  performance.setResourceTimingBufferSize(1500);
  let latest: PaintEntry | undefined;
  function report() {
    if (!latest) return;
    const nav = performance.getEntriesByType("navigation")[0] as
      PerformanceNavigationTiming | undefined;
    const resources = performance.getEntriesByType(
      "resource",
    ) as PerformanceResourceTiming[];
    const image =
      latest.element instanceof HTMLImageElement ? latest.element : null;
    const resource = [...resources]
      .reverse()
      .find((entry) => entry.name === (image?.currentSrc || latest?.url));
    const api = resources
      .filter((entry) => entry.name.includes("/api/v1/"))
      .map((entry) => {
        const path = new URL(entry.name).pathname;
        const match = /^\/api\/v1\/(customer|catalog)\/([^/]+)/.exec(path);
        return {
          family: path.endsWith("/session")
            ? "session"
            : path.endsWith("/featured")
              ? "featured"
              : (match?.[2] ?? "other"),
          start: ms(entry.startTime),
          end: ms(entry.responseEnd),
          duration: ms(entry.duration),
        };
      });
    const ttfb = nav?.responseStart ?? 0;
    console.info(
      "MGTV_PERF " +
        JSON.stringify({
          lcpMs: ms(latest.startTime),
          element: latest.element?.tagName ?? "unknown",
          size: latest.size,
          viewport: innerWidth,
          ttfbMs: ms(ttfb),
          image: resource
            ? {
                start: ms(resource.startTime),
                end: ms(resource.responseEnd),
                duration: ms(resource.duration),
                transferBytes: resource.transferSize,
                encodedBytes: resource.encodedBodySize,
                loadDelayMs: ms(Math.max(0, resource.startTime - ttfb)),
                renderDelayMs: ms(
                  Math.max(0, latest.startTime - resource.responseEnd),
                ),
                width: image?.naturalWidth,
                height: image?.naturalHeight,
              }
            : null,
          scripts: resources
            .filter(
              (e) =>
                e.initiatorType === "script" || /\.js(?:\?|$)/.test(e.name),
            )
            .map((e) => ({
              start: ms(e.startTime),
              end: ms(e.responseEnd),
              bytes: e.transferSize,
            })),
          api,
        }),
    );
  }
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) latest = entry as PaintEntry;
    report();
  });
  observer.observe({ type: "largest-contentful-paint", buffered: true });
  setTimeout(report, 10000); // One diagnostic follow-up includes completed background request start times.
  window.addEventListener("pagehide", report);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") report();
  });
}
