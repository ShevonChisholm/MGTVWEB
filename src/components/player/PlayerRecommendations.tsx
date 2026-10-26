import { Link } from "react-router";
import type { ContentItem } from "@/data/mockContent";
function destination(item: ContentItem) {
  if (item.type === "episode" && item.source === "api")
    return "/watch/episodes/" + item.id;
  const prefixes: Record<string, string> = {
    show: "/shows/",
    movie: "/movies/",
    musicVideo: "/music/video/",
    track: "/music/track/",
    sports: "/sports/",
    event: "/events/",
  };
  return (prefixes[item.type ?? ""] ?? "/shows/") + item.id;
}
export function PlayerRecommendations({
  items,
  title = "Keep the stories coming",
}: {
  items: ContentItem[];
  title?: string;
}) {
  if (!items.length) return null;
  return (
    <section aria-label={title} className="min-w-0 lg:sticky lg:top-24">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl">{title}</h2>
        <span className="shrink-0 text-xs text-text-secondary">
          {items.length} titles
        </span>
      </div>
      <div
        tabIndex={0}
        role="region"
        aria-label={`${title} recommendations`}
        className="mgtv-recommendations max-h-[min(68vh,44rem)] space-y-2 overflow-y-auto overscroll-contain pr-2"
      >
        {items.map((item) => (
          <Link
            key={item.id}
            to={destination(item)}
            className="group flex min-w-0 gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-gold/20 hover:bg-bg-surface"
          >
            <div className="relative aspect-video w-28 shrink-0 self-start overflow-hidden rounded-md bg-bg-elevated">
              <img
                src={item.landscapeThumbnail ?? item.thumbnail}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[9px] text-white">
                {item.duration}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-gold">
                {item.title}
              </h3>
              <p className="mt-1 truncate text-[11px] text-text-secondary">
                {item.artist ?? item.genre}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-gold">
                {item.badge === "premium"
                  ? "MGTV+"
                  : (item.classification ?? "Explore")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
