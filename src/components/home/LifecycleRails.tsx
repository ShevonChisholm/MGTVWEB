import { useEffect, useRef, useState, useId } from "react";
import { Link } from "react-router";
import {
  useCustomerSession,
  customerApi,
  connectedAuth,
} from "@/lib/customerAuth";
import { homepageItem } from "@/lib/homepage";
import { MediaCard } from "./MediaCard";
import {
  LoadingSkeleton,
  ErrorState,
} from "@/components/shared/LoadingSkeleton";
export function useLifecycle(path: string) {
  const auth = useCustomerSession(),
    scope =
      path +
      ":" +
      (auth.session?.activeProfileId ??
        (auth.session ? "profile-required" : "guest"));
  const [state, setState] = useState<{
      scope: string;
      data: any;
      error: string;
      loading: boolean;
    }>({ scope: "", data: null, error: "", loading: true }),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!connectedAuth || auth.loading) return;
    let active = true;
    const abort = new AbortController();
    if (auth.error || (auth.session && !auth.session.activeProfileId)) {
      setState({ scope, data: null, error: auth.error ?? "", loading: false });
      return;
    }
    const load = async () => {
      try {
        const data = auth.session
          ? await customerApi("/lifecycle/" + path)
          : await fetch("/api/v1/catalog/lifecycle/" + path, {
              credentials: "include",
              cache: "no-store",
              signal: abort.signal,
            }).then(async (r) => {
              const b = await r.json();
              if (!r.ok)
                throw Error(b.message ?? "The lineup could not be loaded.");
              return b;
            });
        if (active) setState({ scope, data, error: "", loading: false });
      } catch (e) {
        if (active && !(e instanceof Error && e.name === "AbortError"))
          setState({
            scope,
            data: null,
            error:
              e instanceof Error
                ? e.message
                : "The lineup could not be loaded.",
            loading: false,
          });
      }
    };
    setState({ scope, data: null, error: "", loading: true });
    void load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 60000);
    return () => {
      active = false;
      abort.abort();
      clearInterval(timer);
    };
  }, [scope, auth.loading, auth.error, revision]);
  return {
    ...(state.scope === scope
      ? state
      : { data: null, error: "", loading: true }),
    profileRequired: !!auth.session && !auth.session.activeProfileId,
    retry: () => setRevision((v) => v + 1),
  };
}
const labels: Record<string, [string, string]> = {
  "new-releases": ["New Releases", "Fresh stories. New favourites."],
  "coming-soon": ["Coming Soon", "Your next MGTV moment is on the way."],
  "watch-again": ["Watch Again", "Some stories deserve another round."],
  "leaving-soon": ["Leaving Soon", "Make time for one more watch."],
};
const day = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
function LifecycleRail({ section }: { section: any }) {
  const rail = useRef<HTMLDivElement>(null),
    heading = useId(),
    [title, description] = labels[section.kind];
  return (
    <section
      className="mx-auto max-w-[1760px] px-6 py-6 md:px-8"
      aria-labelledby={heading}
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-sm text-text-secondary">{description}</p>
          <h2 id={heading} className="font-display text-2xl md:text-3xl">
            {title}
          </h2>
        </div>
        <div className="flex shrink-0 gap-2">
          {[-1, 1].map((direction) => (
            <button
              key={direction}
              type="button"
              className="min-h-11 min-w-11 text-gold"
              aria-label={`Scroll ${title} ${direction < 0 ? "left" : "right"}`}
              onClick={() =>
                rail.current?.scrollBy({
                  left: direction * rail.current.clientWidth * 0.8,
                  behavior: matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "auto"
                    : "smooth",
                })
              }
            >
              {direction < 0 ? "‹" : "›"}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={rail}
        role="region"
        aria-label={title}
        tabIndex={0}
        className="flex items-start gap-5 overflow-x-auto pb-4"
      >
        {section.items.map((entry: any) => (
          <div
            key={entry.kind + entry.id}
            className="flex shrink-0 flex-col gap-2"
          >
            {entry.content.teaser ? (
              <Link
                to={entry.destination}
                className="group w-44 overflow-hidden rounded-xl border border-white/5 bg-bg-surface md:w-52"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    className="h-full w-full object-cover"
                    src={entry.content.artwork.portraitUrl}
                    alt=""
                    loading="lazy"
                  />
                  <span className="absolute left-2 top-2 rounded bg-black/80 px-2 py-1 text-xs text-gold">
                    Coming Soon
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-xl group-hover:text-gold">
                    {entry.content.title}
                  </h3>
                  <p className="mt-2 text-xs text-text-secondary">
                    Arrives {day(entry.content.releaseAt)}
                  </p>
                  <p className="mt-3 text-sm text-gold">Take a first look ›</p>
                </div>
              </Link>
            ) : (
              <MediaCard item={homepageItem(entry)} />
            )}
            {entry.lifecycle.seasonFinale && (
              <span className="text-xs font-semibold text-gold">
                Season finale
              </span>
            )}
            {section.kind === "leaving-soon" && entry.lifecycle.leavesAt && (
              <span className="text-xs text-gold">
                Leaves {day(entry.lifecycle.leavesAt)}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
export default function LifecycleRails({
  surface = "home",
}: {
  surface?: string;
}) {
  const state = useLifecycle("rails?surface=" + surface);
  if (!connectedAuth || state.profileRequired) return null;
  if (state.loading)
    return (
      <div className="mx-auto max-w-[1760px] px-6 py-6 md:px-8">
        <LoadingSkeleton
          label="Finding what’s new and what’s next…"
          count={4}
        />
      </div>
    );
  if (state.error)
    return (
      <div className="mx-auto max-w-[1760px] px-6 py-6 md:px-8">
        <ErrorState message={state.error} onRetry={state.retry} />
      </div>
    );
  return (
    <>
      {(state.data?.sections ?? []).map((s: any) => (
        <LifecycleRail key={s.kind} section={s} />
      ))}
    </>
  );
}
