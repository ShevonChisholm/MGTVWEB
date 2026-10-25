import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { useShows } from "@/context/ShowsContext";
import type { ContentItem } from "@/data/mockContent";
// Same portrait-card presentation as the prototype, with server-owned state.
export function ApiShowCard({
  item,
  fluid = false,
  continuing = false,
}: {
  item: ContentItem;
  fluid?: boolean;
  continuing?: boolean;
}) {
  const movies = useShows(),
    movie = {
      id: item.id,
      preference: item.moviePreference,
      kind: item.type as "show" | "episode",
    };
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const saved = movie ? movies.preference(movie).saved : false;
  return (
    <article
      data-content-id={item.id}
      data-content-type={item.type}
      className={`group flex flex-1 shrink-0 flex-col min-w-0 ${fluid ? "w-full" : continuing ? "w-64 md:w-72" : "w-44 md:w-52"}`}
    >
      <Link
        to={
          item.type === "episode"
            ? `/watch/episodes/${item.id}`
            : `/shows/${item.id}`
        }
        aria-label={`Open ${item.title}`}
        className={`relative block overflow-hidden bg-bg-elevated rounded-xl ${continuing || item.type === "episode" ? "aspect-video" : "aspect-[2/3]"}`}
      >
        <img
          src={
            continuing || item.type === "episode"
              ? item.landscapeThumbnail
              : item.thumbnail
          }
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base/70 via-transparent to-transparent" />
        {item.badge && (
          <Badge variant={item.badge} className="absolute left-2 top-2" />
        )}
      </Link>
      {continuing && (
        <progress
          className="media-progress mt-2"
          max={100}
          value={item.progress ?? 0}
          aria-label={`${item.title}: ${Math.round(item.progress ?? 0)}% watched`}
        />
      )}
      <div className="flex flex-1 flex-col gap-2 pt-3">
        <Link
          to={
            item.type === "episode"
              ? `/watch/episodes/${item.id}`
              : `/shows/${item.id}`
          }
          className="text-sm font-semibold leading-snug text-text-primary hover:text-gold"
        >
          {item.title}
        </Link>
        <div className="space-y-1 text-xs text-text-secondary">
          <Text>
            {item.type === "episode"
              ? `S${item.seasonNumber} · E${item.episodeNumber} · `
              : ""}
            {item.year} · {item.duration}
          </Text>
          <Text>
            {item.classification} · {item.genre}
          </Text>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <Link
            to={
              continuing
                ? `/watch/episodes/${item.id}`
                : item.type === "episode"
                  ? `/watch/episodes/${item.id}`
                  : `/shows/${item.id}`
            }
            className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-gold hover:text-gold-light"
          >
            {continuing
              ? "Resume"
              : item.type === "episode"
                ? "Watch episode"
                : "View series"}{" "}
            <span aria-hidden="true">›</span>
          </Link>
          {item.type === "show" &&
            (movies.session && movie ? (
              <Button
                variant="ghost"
                size="sm"
                className="min-h-11 px-2"
                disabled={busy}
                aria-pressed={saved}
                aria-label={`${saved ? "Remove" : "Save"} ${item.title} ${saved ? "from" : "to"} My List`}
                onClick={() => {
                  setBusy(true);
                  setError("");
                  void movies
                    .save(movie, { saved: !saved })
                    .catch((e) => setError(e.message))
                    .finally(() => setBusy(false));
                }}
              >
                {saved ? "✓ Saved" : "+ Save"}
              </Button>
            ) : (
              <Link
                to={movies.session ? "/profiles" : "/auth/sign-in"}
                className="inline-flex min-h-11 items-center px-2 text-xs text-text-secondary"
                aria-label={`Sign in to save ${item.title}`}
              >
                + Save
              </Link>
            ))}
        </div>
        {error && (
          <p role="alert" className="text-xs text-rose-300">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}
