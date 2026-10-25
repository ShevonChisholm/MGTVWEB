import { ApiMusicCard } from "@/components/home/ApiMusicCard";
import { Link } from "react-router";
import { catalogById, contentPath, type CatalogItem } from "@/data/mockContent";
import { usePlayback } from "@/context/MediaPlaybackContext";
import { useSaved } from "@/context/SavedContext";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { isRunning, statusLabel } from "@/lib/playback";
import { AddToPlaylistMenu } from "./AddToPlaylistMenu";
import { useAppState } from "@/context/AppStateContext";

export function TrackActions({ track }: { track: CatalogItem }) {
  if (track.source === "api")
    return (
      <Link className="text-gold text-sm" to={contentPath(track)}>
        View track
      </Link>
    );
  return <PrototypeTrackActions track={track} />;
}
function PrototypeTrackActions({ track }: { track: CatalogItem }) {
  const { enqueue } = usePlayback();
  const { isSaved, toggle } = useSaved();
  return (
    <details className="relative shrink-0 text-xs">
      <summary
        className="flex min-h-11 cursor-pointer items-center px-3 text-gold"
        aria-label={`More actions for ${track.title}`}
      >
        More
      </summary>
      <div className="absolute right-0 top-full z-20 grid w-52 gap-1 rounded-lg border border-text-muted/30 bg-bg-surface p-2">
        <Button
          variant="ghost"
          size="sm"
          className="min-h-11 justify-start"
          onClick={() => enqueue(track.id, true)}
        >
          Play next
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="min-h-11 justify-start"
          onClick={() => enqueue(track.id)}
        >
          Add to queue
        </Button>
        <AddToPlaylistMenu trackId={track.id} />
        <Button
          variant="ghost"
          size="sm"
          className="min-h-11"
          aria-pressed={isSaved(track.id)}
          aria-label={`${
            isSaved(track.id) ? "Remove" : "Save"
          } ${track.title} ${isSaved(track.id) ? "from" : "to"} My List`}
          onClick={() => toggle(track.id)}
        >
          {isSaved(track.id) ? "Saved" : "Save"}
        </Button>
      </div>
    </details>
  );
}
export function TrackPlay({
  track,
  ids = [track.id],
  origin,
}: {
  track: CatalogItem;
  ids?: string[];
  origin?: string;
}) {
  if (track.source === "api")
    return (
      <Link
        className="inline-flex min-h-11 items-center rounded-lg bg-gold px-4 text-black"
        to={contentPath(track)}
      >
        Play track
      </Link>
    );
  return <PrototypeTrackPlay track={track} ids={ids} origin={origin} />;
}
function PrototypeTrackPlay({
  track,
  ids,
  origin,
}: {
  track: CatalogItem;
  ids: string[];
  origin?: string;
}) {
  const { state, toggleTrack } = usePlayback();
  const selected = state.audio?.media.id === track.id;
  const running = selected && isRunning(state.audio);
  const action = running
    ? "Pause track"
    : selected && state.audio?.status === "paused" && state.audio.elapsed > 0
      ? "Resume track"
      : "Play track";
  return (
    <Button
      size="sm"
      className="min-h-11 shrink-0 px-3"
      onClick={() => toggleTrack(track.id, ids, origin)}
      aria-label={`${action}: ${track.title} (simulated preview)`}
    >
      {action}
    </Button>
  );
}
export function TrackRow({
  track,
  ids,
  origin,
}: {
  track: CatalogItem;
  ids?: string[];
  origin?: string;
}) {
  const { state } = usePlayback();
  const app = useAppState();
  if (track.source !== "api" && !app.allowed(track)) return null;
  const current = state.audio?.media.id === track.id;
  return (
    <article
      data-content-id={track.id}
      data-content-type="track"
      className={`flex flex-wrap items-center gap-3 border-b border-text-muted/20 py-3 ${
        current ? "bg-gold-dim/40" : ""
      }`}
    >
      <Link to={contentPath(track)} className="shrink-0">
        <img
          src={track.thumbnail}
          alt={`${track.title} artwork`}
          className="h-12 w-12 rounded-md object-cover"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          to={contentPath(track)}
          className="block break-words text-sm font-semibold text-text-primary hover:text-gold"
        >
          {track.title}
        </Link>
        <Link
          to={
            track.source === "api"
              ? "/music?view=tracks"
              : `/music/artist/${track.artistId}`
          }
          className="block truncate text-xs text-text-secondary hover:text-gold"
        >
          {track.artist}
        </Link>
        {current && (
          <Text className="mt-1 text-xs text-gold">
            {statusLabel(state.audio)}
          </Text>
        )}
      </div>
      <Text className="text-xs tabular-nums text-text-secondary">
        {track.duration}
      </Text>
      <TrackPlay track={track} ids={ids} origin={origin} />
      <TrackActions track={track} />
    </article>
  );
}
export function TrackCard({
  track: supplied,
  fluid = false,
  ids,
  origin,
}: {
  track: CatalogItem;
  fluid?: boolean;
  ids?: string[];
  origin?: string;
}) {
  if (supplied.source === "api")
    return <ApiMusicCard item={supplied} fluid={fluid} />;
  return (
    <PrototypeTrackCard
      track={supplied}
      fluid={fluid}
      ids={ids}
      origin={origin}
    />
  );
}
function PrototypeTrackCard({
  track: supplied,
  fluid,
  ids,
  origin,
}: {
  track: CatalogItem;
  fluid?: boolean;
  ids?: string[];
  origin?: string;
}) {
  const track = catalogById[supplied.id];
  const { state } = usePlayback();
  const app = useAppState();
  if (!track || !app.allowed(track)) return null;
  const current = state.audio?.media.id === track.id;
  return (
    <article
      data-content-id={track.id}
      data-content-type="track"
      className={`group min-w-0 shrink-0 ${fluid ? "w-full" : "w-48 md:w-56"}`}
    >
      <Link
        to={contentPath(track)}
        className="block aspect-square overflow-hidden rounded-xl bg-bg-elevated"
      >
        <img
          src={track.thumbnail}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform motion-safe:group-hover:scale-105"
        />
      </Link>
      <Text className="mt-3 text-xs font-semibold uppercase tracking-widest text-gold">
        Audio track · {track.duration}
      </Text>
      <Link
        to={contentPath(track)}
        className="mt-2 block break-words text-sm font-semibold text-text-primary hover:text-gold"
      >
        {track.title}
      </Link>
      <Link
        to={
          track.source === "api"
            ? "/music?view=tracks"
            : `/music/artist/${track.artistId}`
        }
        className="mt-1 block truncate text-xs text-text-secondary hover:text-gold"
      >
        {track.artist}
      </Link>
      <Text className="mt-2 text-xs text-text-secondary">
        {current ? statusLabel(state.audio) : "Simulated preview · No sound"}
      </Text>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <TrackPlay track={track} ids={ids} origin={origin} />
        <TrackActions track={track} />
      </div>
    </article>
  );
}
