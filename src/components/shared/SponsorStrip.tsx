import { useEffect, useId, useState, useRef } from "react";
import { Link, useLocation } from "react-router";
type Sponsor = {
  id: string;
  name: string;
  description: string;
  website: string;
  logoUrl: string;
  logoBackground?: "light" | "dark";
};
function SponsorLogo({
  s,
  compact = false,
}: {
  s: Sponsor;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [s.logoUrl]);
  return (
    <div
      className={`${compact ? "h-10 w-16" : "h-28 w-full sm:h-32 sm:w-44"} flex shrink-0 items-center justify-center overflow-hidden rounded-lg border ${s.logoBackground === "light" ? "border-black/10 bg-[#f3efe5] text-[#29251c]" : "border-white/10 bg-[#181b1c] text-gold"}`}
    >
      {failed ? (
        <span
          className="font-display text-2xl"
          aria-label={s.name + " logo unavailable"}
        >
          {s.name
            .split(/\s+/)
            .slice(0, 2)
            .map((x) => x[0])
            .join("")}
        </span>
      ) : (
        <img
          src={s.logoUrl}
          alt={compact ? "" : s.name + " logo"}
          loading="lazy"
          decoding="async"
          width={compact ? 64 : 176}
          height={compact ? 40 : 128}
          onError={() => setFailed(true)}
          className={`h-full w-full object-contain ${compact ? "p-1.5" : "p-4"}`}
        />
      )}
    </div>
  );
}
export function SponsorStrip({
  kind,
  id,
  compact = false,
  context,
  detailHref,
}: {
  kind: "shows" | "events";
  id: string;
  compact?: boolean;
  context?: string;
  detailHref?: string;
}) {
  const section = useRef<HTMLElement>(null),
    location = useLocation();
  const scope = kind + ":" + id,
    heading = useId();
  const [state, setState] = useState<{
      scope: string;
      items: Sponsor[];
      error: boolean;
      loading: boolean;
    }>({ scope: "", items: [], error: false, loading: true }),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState({ scope, items: [], error: false, loading: true });
    const load = async () => {
      try {
        const r = await fetch("/api/v1/catalog/sponsors/" + kind + "/" + id, {
          signal: controller.signal,
          cache: "no-store",
          credentials: "omit",
        });
        if (!r.ok) throw Error();
        const body = await r.json();
        if (active)
          setState({ scope, items: body.items, error: false, loading: false });
      } catch {
        if (active && !controller.signal.aborted)
          setState({ scope, items: [], error: true, loading: false });
      }
    };
    void load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 60000);
    return () => {
      active = false;
      controller.abort();
      clearInterval(timer);
    };
  }, [scope, revision]);
  const current =
    state.scope === scope ? state : { items: [], error: false, loading: true };
  useEffect(() => {
    if (!compact && location.hash === "#supported-by" && current.items.length) {
      section.current?.scrollIntoView({ block: "start", behavior: "auto" });
      section.current?.focus({ preventScroll: true });
    }
  }, [compact, location.key, location.hash, scope, current.items.length]);
  if (current.loading)
    return (
      <div
        role="status"
        aria-label="Loading sponsor credits"
        className={
          compact
            ? "mt-5 min-h-14"
            : "my-8 min-h-40 rounded-xl border border-white/5 p-5"
        }
      >
        <div
          aria-hidden="true"
          className={`rounded-lg bg-white/5 motion-safe:animate-pulse ${compact ? "h-10 w-44" : "h-28 w-full"}`}
        />
        <span className="sr-only">Loading sponsor credits…</span>
      </div>
    );
  if (current.error)
    return (
      <div role="status" className="my-5 text-xs text-text-secondary">
        Sponsor credits could not be loaded.{" "}
        <button
          className="inline-flex min-h-11 items-center text-gold underline underline-offset-4"
          onClick={() => setRevision((n) => n + 1)}
        >
          Retry sponsor credits
        </button>
      </div>
    );
  if (!current.items.length) return null;
  if (compact)
    return (
      <aside
        aria-label={context ? context + " · Supported by" : "Supported by"}
        className="mt-5 max-w-2xl"
      >
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
          {context ?? "This " + (kind === "shows" ? "series" : "event")} ·
          Supported by
        </p>
        <div className="flex flex-wrap gap-2">
          {current.items.slice(0, 2).map((s) => (
            <Link
              key={s.id}
              to={detailHref ?? "/" + kind + "/" + id + "#supported-by"}
              className="group inline-flex min-h-12 max-w-full items-center gap-3 rounded-lg border border-white/15 bg-black/35 py-1 pl-1 pr-4 text-sm text-text-primary transition-colors hover:border-gold/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <SponsorLogo s={s} compact />
              <span className="min-w-0 break-words">{s.name}</span>
              <span aria-hidden="true" className="text-gold">
                →
              </span>
              <span className="sr-only">
                {" "}
                — see this {kind === "shows" ? "series" : "event"}’s sponsor
                credits
              </span>
            </Link>
          ))}
          {current.items.length > 2 && (
            <Link
              to={detailHref ?? "/" + kind + "/" + id + "#supported-by"}
              className="inline-flex min-h-12 items-center rounded-lg border border-gold/30 px-4 text-sm text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              +{current.items.length - 2} more · All sponsor credits
            </Link>
          )}
        </div>
      </aside>
    );
  return (
    <section
      id="supported-by"
      ref={section}
      tabIndex={-1}
      aria-labelledby={heading}
      className="my-8 scroll-mt-24 min-w-0"
    >
      <div className="mb-5 flex items-center gap-4">
        <span aria-hidden="true" className="h-8 w-1 shrink-0 bg-gold" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
            Behind this {kind === "shows" ? "series" : "moment"}
          </p>
          <h2 id={heading} className="font-display text-3xl text-text-primary">
            Supported by
          </h2>
        </div>
      </div>
      <div className="space-y-4">
        {current.items.map((s) => (
          <article
            key={s.id}
            className="relative grid min-w-0 gap-5 overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-[#191a16] to-bg-surface p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-6"
          >
            <SponsorLogo s={s} />
            <div className="min-w-0">
              <h3 className="break-words font-display text-2xl text-text-primary">
                {s.name}
              </h3>
              <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-text-secondary">
                {s.description}
              </p>
              {s.website && (
                <a
                  href={s.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 max-w-full items-center gap-3 rounded-lg border border-gold/30 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                >
                  <span className="min-w-0 break-words">Visit {s.name}</span>
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only">
                    {" "}
                    — external website, opens in a new tab
                  </span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
