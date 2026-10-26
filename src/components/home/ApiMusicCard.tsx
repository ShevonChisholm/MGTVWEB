import { ConnectedPlaylistMenu } from "@/components/music/ConnectedPlaylistMenu";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { useMusic } from "@/context/MusicContext";
import { type ContentItem } from "@/data/mockContent";
// Preserve square track artwork and landscape video cards with server-owned state.
export function ApiMusicCard({
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
  const library = useMusic(),
    release = { id: item.id, preference: item.moviePreference };
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const horizontal = !railFormat || railFormat === "music";
  const saved = library.preference(release).saved;
  return (
    <article
      data-content-id={item.id}
      data-content-type={item.type}
      className={`mgtv-music-card group flex shrink-0 min-w-0 ${horizontal ? "h-48 flex-row items-stretch gap-4 rounded-xl border border-white/10 bg-bg-surface p-3" : "flex-1 flex-col"} ${fluid ? "w-full" : "w-80 md:w-[380px]"}`}
    >
      <Link
        to={
          item.type === "track"
            ? `/music/track/${item.id}`
            : `/music/video/${item.id}`
        }
        aria-label={`Open ${item.title}`}
        className={`rail-artwork relative block shrink-0 overflow-hidden bg-bg-elevated rounded-lg ${horizontal ? "h-28 w-28 self-center sm:h-32 sm:w-32" : "aspect-video w-full"}`}
      >
        <img
          src={continuing ? item.landscapeThumbnail : item.thumbnail}
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
      <div
        className={`min-w-0 flex flex-1 flex-col gap-1.5 ${horizontal ? "py-1" : "pt-3"}`}
      >
        <Link
          to={
            item.type === "track"
              ? `/music/track/${item.id}`
              : `/music/video/${item.id}`
          }
          className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary hover:text-gold"
        >
          {item.title}
        </Link>
        <div className="space-y-1 text-xs text-text-secondary">
          <Text className="truncate">{item.artist}</Text>
          <Text className="flex flex-wrap gap-x-2">
            <span>{item.genre}</span>
            <span>{item.year}</span>
            <span>{item.duration}</span>
          </Text>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          {!horizontal && (
            <Link
              to={
                continuing
                  ? item.type === "track"
                    ? `/music/track/${item.id}`
                    : `/music/video/${item.id}`
                  : item.type === "track"
                    ? `/music/track/${item.id}`
                    : `/music/video/${item.id}`
              }
              className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-gold hover:text-gold-light"
            >
              {continuing ? "Resume" : "View release"}{" "}
              <span aria-hidden="true">›</span>
            </Link>
          )}
          {library.session && release ? (
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
                void library
                  .save(release, { saved: !saved })
                  .catch((e) => setError(e.message))
                  .finally(() => setBusy(false));
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 3h12v18l-6-4-6 4z" />
              </svg>
            </Button>
          ) : (
            <Link
              to={library.session ? "/profiles" : "/auth/sign-in"}
              className="inline-flex min-h-11 items-center px-2 text-xs text-text-secondary"
              aria-label={`Sign in to save ${item.title}`}
            >
              <span aria-hidden="true">＋</span>
            </Link>
          )}
          <ConnectedPlaylistMenu
            musicId={item.id}
            format={item.type === "track" ? "audio" : "video"}
            compact
          />
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
