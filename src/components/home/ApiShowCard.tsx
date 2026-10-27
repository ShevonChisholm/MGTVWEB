import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ShowArtwork } from "@/components/shows/ShowArtwork";
import { useShows } from "@/context/ShowsContext";
import type { ContentItem } from "@/data/mockContent";
export function ApiShowCard({
  item,
  fluid = false,
  continuing = false,
  railFormat,
}: {
  item: ContentItem;
  fluid?: boolean;
  continuing?: boolean;
  railFormat?: string;
}) {
  const shows = useShows(),
    node = {
      id: item.id,
      preference: item.moviePreference,
      kind: item.type as "show" | "episode",
    },
    episode = item.type === "episode",
    saved = shows.preference(node).saved;
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const href = episode ? `/watch/episodes/${item.id}` : `/shows/${item.id}`,
    landscape = continuing || episode || railFormat === "landscape",
    src = landscape
      ? (item.landscapeThumbnail ?? item.thumbnail)
      : item.thumbnail;
  return (
    <article
      data-content-id={item.id}
      data-content-type={item.type}
      className={`group show-card ${
        episode && !railFormat ? "show-card--episode" : "show-card--series"
      } ${continuing ? "show-card--continuing" : ""} ${railFormat ? "show-card--rail" : ""} ${
        fluid ? "w-full" : continuing ? "w-64 md:w-72" : "w-44 md:w-52"
      }`}
    >
      <Link
        to={href}
        aria-label={`Open ${item.title}`}
        className={`show-card__art relative block overflow-hidden bg-bg-elevated ${
          landscape ? "aspect-video" : "aspect-[2/3]"
        }`}
      >
        <ShowArtwork key={src} src={src} landscape={landscape} />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base/60 via-transparent to-transparent" />
        {item.badge && (
          <Badge variant={item.badge} className="absolute left-2 top-2" />
        )}
        {episode && (
          <>
            <span className="show-card__play" aria-hidden="true">
              ▷
            </span>
            <span className="show-card__duration">
              {item.classification} · {item.duration}
            </span>
          </>
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
      <div className="show-card__body">
        <span className="show-card__format">
          {episode
            ? `Season ${item.seasonNumber} · Episode ${item.episodeNumber}`
            : "Series"}
        </span>
        <Link to={href} className="show-card__title">
          {item.title}
        </Link>
        <p className="show-card__meta">
          {item.year}
          {episode ? "" : " · Series"}
        </p>
        <p className="show-card__meta">
          {item.classification} · {item.genre}
        </p>
        {episode && !railFormat && item.description && (
          <p className="show-card__synopsis">{item.description}</p>
        )}
        <div className="show-card__actions">
          <Link
            to={href}
            className="inline-flex min-h-11 items-center text-xs font-semibold text-gold hover:text-gold-light"
          >
            {continuing ? "Resume" : episode ? "Watch episode" : "View series"}{" "}
            <span aria-hidden="true">›</span>
          </Link>
          {episode && item.previewAvailable && (
            <Link
              to={`/watch/episodes/${item.id}?preview=1`}
              className="inline-flex min-h-11 items-center text-xs text-text-secondary hover:text-gold"
            >
              Free preview
            </Link>
          )}
          {!episode &&
            (shows.session ? (
              <Button
                variant="ghost"
                size="sm"
                className="min-h-11 px-2"
                disabled={busy}
                aria-pressed={saved}
                aria-label={`${saved ? "Remove" : "Save"} ${item.title} ${
                  saved ? "from" : "to"
                } My List`}
                onClick={() => {
                  setBusy(true);
                  setError("");
                  void shows
                    .save(node, { saved: !saved })
                    .catch((e) => setError(e.message))
                    .finally(() => setBusy(false));
                }}
              >
                {saved ? "✓ Saved" : "+ Save"}
              </Button>
            ) : (
              <Link
                to="/auth/sign-in"
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
