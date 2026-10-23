import { Link, useNavigate } from "react-router"
import type { Playlist } from "@/data/mockContent"
import { mediaFor, usePlayback } from "@/context/MediaPlaybackContext"
import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"

export function PlaylistPlay({
  playlist,
  index = 0,
}: {
  playlist: Playlist
  index?: number
}) {
  const { playTracks, dispatch, setVideoSequence } = usePlayback()
  const navigate = useNavigate()
  return (
    <Button
      size="sm"
      className="min-h-11"
      disabled={!playlist.itemIds.length}
      onClick={() => {
        if (playlist.kind === "audio")
          playTracks(playlist.itemIds, index, playlist.name)
        else {
          setVideoSequence({
            playlistId: playlist.id,
            ids: [...playlist.itemIds],
          })
          dispatch({
            type: "prepareVideo",
            media: mediaFor(playlist.itemIds[index]),
          })
          dispatch({ type: "play", owner: "video" })
          navigate(
            `/music/video/${playlist.itemIds[index]}?playlist=${playlist.id}`,
          )
        }
      }}
    >
      {playlist.kind === "audio" ? "Play tracks" : "Watch videos"}
      {index === 0 ? "" : " from here"}
    </Button>
  )
}
export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <article className="min-w-0">
      <Link
        to={`/music/playlist/${playlist.id}`}
        className="group block overflow-hidden rounded-xl"
      >
        {playlist.coverImage ? (
          <img
            src={playlist.coverImage}
            alt=""
            className={`${
              playlist.kind === "audio" ? "aspect-square" : "aspect-video"
            } w-full object-cover transition-transform motion-safe:group-hover:scale-105`}
          />
        ) : (
          <div className="aspect-square bg-bg-surface" />
        )}
      </Link>
      <Text className="mt-3 text-xs uppercase tracking-wide text-gold">
        {playlist.kind === "audio" ? "Track playlist" : "Video playlist"} ·{" "}
        {playlist.isOwn ? "Yours" : "Editorial"}
      </Text>
      <Link
        to={`/music/playlist/${playlist.id}`}
        className="mt-2 block text-sm font-semibold hover:text-gold"
      >
        {playlist.name}
      </Link>
      <Text className="my-3 text-xs text-text-secondary">
        {playlist.itemIds.length}{" "}
        {playlist.kind === "audio" ? "tracks" : "videos"} · In order
      </Text>
      <div className="flex flex-wrap items-center gap-4">
        <PlaylistPlay playlist={playlist} />
        <Link
          to={`/music/playlist/${playlist.id}`}
          className="text-xs text-gold"
        >
          View playlist
        </Link>
      </div>
    </article>
  )
}
