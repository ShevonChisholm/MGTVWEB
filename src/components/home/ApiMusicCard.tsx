import { MusicArtwork } from "@/components/music/MusicArtwork";
import { musicDuration } from "@/lib/musicPresentation";
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
  const track = item.type === "track";
  const horizontal = track || (railFormat === "music" && !continuing);
  const saved = library.preference(release).saved;
  return (
    <article
      data-content-id={item.id}
      data-content-type={item.type}
      data-music-layout={horizontal ? "row" : "video"}
      className={`mgtv-music-card ${track ? "mgtv-track-card" : "mgtv-video-card"} music-release-card group ${fluid ? "w-full" : "w-80 md:w-[380px]"}`}
    >
      <Link
        to={
          item.type === "track"
            ? `/music/track/${item.id}`
            : `/music/video/${item.id}`
        }
        aria-label={`Open ${item.title}`}
        className="rail-artwork music-card__art"
      >
        <MusicArtwork
          key={continuing ? item.landscapeThumbnail : item.thumbnail}
          src={continuing ? item.landscapeThumbnail : item.thumbnail}
        />
        {!track && (
          <span className="music-card__play" aria-hidden="true">
            ▷
          </span>
        )}
        <span className="music-card__clock">
          {musicDuration(item.durationSeconds, item.duration)}
        </span>
        {item.badge && (
          <Badge variant={item.badge} className="absolute left-2 top-2" />
        )}
      </Link>
      {continuing && (
        <progress
          className="media-progress music-card__progress"
          max={100}
          value={item.progress ?? 0}
          aria-label={`${item.title}: ${Math.round(item.progress ?? 0)}% watched`}
        />
      )}
      <div className="music-card__body">
        <span className="music-card__format">
          {track ? "Audio track" : "Music video"}
        </span>
        <Link
          to={
            item.type === "track"
              ? `/music/track/${item.id}`
              : `/music/video/${item.id}`
          }
          className="music-card__title"
        >
          {item.title}
        </Link>
        <Text className="music-card__artist">{item.artist}</Text>
        <Text className="music-card__meta">
          {[item.genre, item.year].filter(Boolean).join(" · ")}
        </Text>
        <div className="music-card__actions">
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
              {continuing ? "Resume" : track ? "Open track" : "View video"}{" "}
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
