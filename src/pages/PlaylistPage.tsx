import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router"
import { catalogById } from "@/data/mockContent"
import { usePlaylists } from "@/context/PlaylistContext"
import { useToast } from "@/context/ToastContext"
import { TrackRow } from "@/components/music/TrackCard"
import { PlaylistCard, PlaylistPlay } from "@/components/music/PlaylistCard"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { ContentUnavailable } from "@/components/shared/ContentUnavailable"
import { SessionDialog } from "@/components/shared/SessionDialog"

export function PlaylistPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { playlists, removeTrack, deletePlaylist, moveItem } = usePlaylists()
  const { addToast } = useToast()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const playlist = playlists.find((item) => item.id === id)
  if (!playlist)
    return (
      <ContentUnavailable
        kind="Playlist"
        backTo="/music?view=playlists"
        backLabel="Browse playlists"
      />
    )
  const items = playlist.itemIds.map((itemId) => catalogById[itemId])
  const total = items.reduce(
    (sum, item) => sum + (item.durationSeconds ?? 0),
    0,
  )
  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-16">
        <ButtonLink to="/music?view=playlists" variant="ghost" className="mb-8">
          Back to playlists
        </ButtonLink>
        <section className="grid items-center gap-8 md:grid-cols-[1fr_2fr]">
          {playlist.coverImage ? (
            <img
              src={playlist.coverImage}
              alt=""
              className={`${
                playlist.kind === "audio" ? "aspect-square" : "aspect-video"
              } w-full rounded-xl object-cover`}
            />
          ) : (
            <div className="aspect-square rounded-xl bg-bg-surface" />
          )}
          <div>
            <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
              {playlist.kind === "audio" ? "Track playlist" : "Video playlist"}{" "}
              · {playlist.isOwn ? "Yours" : "Editorial · Read only"}
            </Text>
            <Text as="h1" className="font-display text-5xl md:text-7xl">
              {playlist.name}
            </Text>
            <Text className="my-4 text-sm text-text-secondary">
              {playlist.description}
            </Text>
            <Text className="mb-6 text-xs text-text-secondary">
              {items.length} {playlist.kind === "audio" ? "tracks" : "videos"} ·{" "}
              {Math.floor(total / 60)} min {total % 60} sec ·{" "}
              {playlist.createdAt}
            </Text>
            <div className="flex gap-3">
              <PlaylistPlay playlist={playlist} />
              {playlist.isOwn && (
                <Button variant="ghost" onClick={() => setConfirmDelete(true)}>
                  Delete playlist
                </Button>
              )}
            </div>
            {!items.length && (
              <Text className="mt-3 text-xs text-text-secondary">
                Playback is disabled until you add an item.
              </Text>
            )}
          </div>
        </section>
        <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <section className="min-w-0">
            <Text as="h2" className="mb-3 font-display text-3xl">
              In this playlist
            </Text>
            <Text className="mb-5 text-xs leading-relaxed text-text-secondary">
              {playlist.isOwn
                ? "Use Up / Down to change the order. Changes apply the next time you play this playlist; the active queue keeps its snapshot."
                : "This editorial selection is read-only. Add individual items to your own compatible playlist."}{" "}
              All playback is simulated.
            </Text>
            {!items.length && (
              <div className="space-y-4 py-12">
                <Text className="text-text-secondary">
                  Your playlist is empty.
                </Text>
                <ButtonLink
                  variant="outline"
                  to={`/music?view=${
                    playlist.kind === "audio" ? "tracks" : "videos"
                  }`}
                >
                  Browse {playlist.kind === "audio" ? "tracks" : "videos"}
                </ButtonLink>
              </div>
            )}
            {items.map((item, index) => (
              <div key={item.id} className="mb-3">
                {playlist.kind === "audio" ? (
                  <TrackRow
                    track={item}
                    ids={playlist.itemIds}
                    origin={playlist.name}
                  />
                ) : (
                  <div className="flex flex-wrap items-center gap-3 border-b border-text-muted/20 py-3">
                    <Link
                      to={`/music/video/${item.id}?playlist=${playlist.id}`}
                      className="shrink-0"
                    >
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="aspect-video w-24 rounded-md object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/music/video/${item.id}?playlist=${playlist.id}`}
                        className="text-sm font-semibold hover:text-gold"
                      >
                        {index + 1}. {item.title}
                      </Link>
                      <Text className="mt-1 text-xs text-text-secondary">
                        {item.artist} · Video · {item.duration}
                      </Text>
                    </div>
                    <PlaylistPlay playlist={playlist} index={index} />
                  </div>
                )}
                {playlist.isOwn && (
                  <div className="flex flex-wrap gap-1 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-11"
                      disabled={index === 0}
                      onClick={() => moveItem(playlist.id, item.id, -1)}
                      aria-label={`Move ${item.title} up in playlist`}
                    >
                      Up
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-11"
                      disabled={index === items.length - 1}
                      onClick={() => moveItem(playlist.id, item.id, 1)}
                      aria-label={`Move ${item.title} down in playlist`}
                    >
                      Down
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-11"
                      onClick={() => removeTrack(playlist.id, item.id)}
                      aria-label={`Remove ${item.title} from playlist`}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </section>
          <aside className="min-w-0">
            <Text as="h2" className="mb-5 font-display text-2xl">
              More {playlist.kind === "audio" ? "track" : "video"} playlists
            </Text>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
              {playlists
                .filter((item) => item.id !== id && item.kind === playlist.kind)
                .slice(0, 2)
                .map((item) => (
                  <PlaylistCard key={item.id} playlist={item} />
                ))}
            </div>
          </aside>
        </div>
      </div>
      {confirmDelete && (
        <SessionDialog
          title="Delete this playlist?"
          onClose={() => setConfirmDelete(false)}
        >
          <Text className="mb-6 text-sm text-text-secondary">
            Delete “{playlist.name}” from this session? This cannot be undone.
            An active playback queue will keep its snapshot.
          </Text>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                deletePlaylist(playlist.id)
                addToast("Playlist deleted", "info")
                navigate("/music?view=playlists")
              }}
            >
              Delete playlist
            </Button>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Keep playlist
            </Button>
          </div>
        </SessionDialog>
      )}
    </main>
  )
}
