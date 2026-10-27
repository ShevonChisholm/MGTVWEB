import { useEffect, useRef, useState, type ReactNode } from "react";
import { customerApi, useCustomerSession } from "@/lib/customerAuth";
import { scheduleCatalogRead } from "@/lib/catalogReadQueue";
import { ErrorState } from "@/components/shared/LoadingSkeleton";
export function DeferredEditorial({
  surface,
  section,
  renderSection,
}: {
  surface: string;
  section: any;
  renderSection: (s: any) => ReactNode;
}) {
  const auth = useCustomerSession(),
    host = useRef<HTMLDivElement>(null),
    [near, setNear] = useState(false),
    [attempt, setAttempt] = useState(0);
  const audience =
      auth.session?.activeProfileId ??
      (auth.session ? "choose-profile" : "guest"),
    scope = surface + ":" + section.id + ":" + audience;
  const [state, setState] = useState<{
    scope: string;
    section: any;
    loading: boolean;
    error: string;
  }>({ scope: "", section: null, loading: true, error: "" });
  useEffect(() => {
    if (!host.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!near || auth.loading) return;
    let active = true;
    const controller = new AbortController();
    setState({ scope, section: null, loading: true, error: "" });
    if (auth.error || audience === "choose-profile") {
      setState({
        scope,
        section: null,
        loading: false,
        error: auth.error ?? "Choose your profile first.",
      });
      return;
    }
    const path =
      "/homepage/" +
      encodeURIComponent(surface) +
      "/sections/" +
      encodeURIComponent(section.id);
    void scheduleCatalogRead(async () => {
      if (controller.signal.aborted)
        throw new DOMException("Cancelled", "AbortError");
      if (auth.session)
        return customerApi(path, "GET", undefined, {
          "X-Profile-Context": auth.session.activeProfileId!,
        });
      const response = await fetch("/api/v1/catalog" + path, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        }),
        data = await response.json();
      if (!response.ok)
        throw Error(data.message ?? "This collection could not load.");
      return data;
    }, controller.signal)
      .then((data) => {
        if (active)
          setState({ scope, section: data.section, loading: false, error: "" });
      })
      .catch((error) => {
        if (active && error.name !== "AbortError")
          setState({
            scope,
            section: null,
            loading: false,
            error: error.message,
          });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [near, scope, auth.loading, auth.error, attempt]);
  const current =
    state.scope === scope ? state : { section: null, loading: true, error: "" };
  return (
    <div ref={host} className="min-w-0">
      {current.error ? (
        <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-8">
          <ErrorState
            message={current.error}
            onRetry={() => setAttempt((n) => n + 1)}
          />
        </div>
      ) : current.loading ? (
        <section
          className="mgtv-rail mx-auto max-w-[1760px] px-6 py-6 md:px-8"
          data-rail-format={section.format ?? "landscape"}
          role="status"
          aria-label="Loading collection"
        >
          <div className="h-8 w-56 mgtv-skeleton mb-7" />
          <div className="flex gap-6 overflow-hidden" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="mgtv-rail-item shrink-0">
                <div
                  className="mgtv-skeleton"
                  style={{
                    aspectRatio:
                      section.format === "poster"
                        ? "2 / 3"
                        : section.format === "artist"
                          ? "1"
                          : "16 / 9",
                    minHeight: section.format === "music" ? 168 : undefined,
                  }}
                />
                <div className="h-5 mt-4 mgtv-skeleton" />
                <div className="h-4 w-2/3 mt-3 mgtv-skeleton" />
              </div>
            ))}
          </div>
        </section>
      ) : current.section ? (
        renderSection(current.section)
      ) : null}
    </div>
  );
}
