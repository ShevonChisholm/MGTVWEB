import { useEffect, useRef, useState } from "react"
import { Link, Outlet } from "react-router"
import { catalogById, contentPath } from "@/data/mockContent"
import { usePlayback } from "@/context/MediaPlaybackContext"
import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { PlaybackControls, PreviewStates } from "./PlaybackControls"
import { SessionDialog } from "@/components/shared/SessionDialog"
import { DemoControls } from "@/components/shared/DemoControls"

export function PlaybackLayout() {
  return (
    <div className="playback-shell">
      <DemoControls />
      <Outlet />
      <AudioMiniPlayer />
    </div>
  )
}
function AudioMiniPlayer() {
  const { state, dispatch } = usePlayback()
  const [queueOpen, setQueueOpen] = useState(false)
  const bar = useRef<HTMLDivElement>(null)
  const audio = state.audio
  useEffect(() => {
    const element = bar.current
    const update = () =>
      document.documentElement.style.setProperty(
        "--player-height",
        `${element?.getBoundingClientRect().height ?? 0}px`,
      )
    update()
    const observer = new ResizeObserver(update)
    if (element) observer.observe(element)
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty("--player-height")
    }
  }, [!!audio])
  if (!audio) return null
  const track = catalogById[audio.media.id]
  if (!track) return null
  return (
    <>
      <div
        ref={bar}
        role="region"
        aria-label="Audio mini-player"
        className="audio-mini-player fixed inset-x-0 bottom-0 z-40 border-t border-gold/40 bg-bg-surface"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 md:grid-cols-[1fr_2fr_auto] md:gap-6 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link to={contentPath(track)}>
              <img
                src={track.thumbnail}
                alt=""
                className="h-12 w-12 rounded-md object-cover"
              />
            </Link>
            <div className="min-w-0">
              <Link
                to={contentPath(track)}
                className="block truncate text-sm font-semibold hover:text-gold"
              >
                {track.title}
              </Link>
              <Link
                to={`/music/artist/${track.artistId}`}
                className="block truncate text-xs text-text-secondary hover:text-gold"
              >
                {track.artist}
              </Link>
              <Text className="mt-1 text-xs text-text-secondary">
                Simulated audio · No sound
              </Text>
            </div>
          </div>
          <div className="col-span-2 row-start-2 md:col-span-1 md:row-start-1 md:col-start-2">
            <PlaybackControls owner="audio" title={track.title} compact />
          </div>
          <div className="col-start-2 row-start-1 flex items-center gap-1 md:col-start-3">
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11"
              disabled={state.index + 1 >= state.queue.length}
              onClick={() => dispatch({ type: "next" })}
              aria-label="Next track in queue"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-h-11"
              onClick={() => setQueueOpen(true)}
              aria-haspopup="dialog"
            >
              Queue ({state.queue.length - state.index - 1})
            </Button>
          </div>
        </div>
      </div>
      {queueOpen && (
        <SessionDialog title="Audio queue" onClose={() => setQueueOpen(false)}>
          <Text className="mb-2 text-xs uppercase tracking-widest text-gold">
            {state.origin} · Ordered snapshot
          </Text>
          <Text className="mb-5 text-xs text-text-secondary">
            Queue changes do not change your playlist. Navigation preserves this
            session; refresh resets it.
          </Text>
          <Text as="h3" className="mb-2 font-display text-xl">
            Now selected
          </Text>
          <div className="rounded-lg bg-gold-dim/40 p-4">
            <Link
              to={contentPath(track)}
              onClick={() => setQueueOpen(false)}
              className="font-semibold text-gold"
            >
              {track.title} · {track.artist}
            </Link>
            <div className="mt-3">
              <PlaybackControls owner="audio" title={track.title} />
            </div>
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => {
                dispatch({ type: "remove", key: state.queue[state.index].key })
                if (state.index + 1 >= state.queue.length) setQueueOpen(false)
              }}
            >
              Remove current track
            </Button>
          </div>
          <Text as="h3" className="mb-2 mt-6 font-display text-xl">
            Up next
          </Text>
          {state.index + 1 >= state.queue.length && (
            <Text className="py-4 text-sm text-text-secondary">
              Nothing up next. This queue stops at the end.
            </Text>
          )}
          <div className="space-y-3">
            {state.queue.slice(state.index + 1).map((entry, pendingIndex) => {
              const item = catalogById[entry.media.id]
              const index = state.index + 1 + pendingIndex
              return (
                <div
                  key={entry.key}
                  className="border-b border-text-muted/20 pb-3"
                >
                  <Link
                    to={contentPath(item)}
                    onClick={() => setQueueOpen(false)}
                    className="text-sm font-semibold hover:text-gold"
                  >
                    {item.title} · {item.artist}
                  </Link>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-11"
                      onClick={() => dispatch({ type: "select", index })}
                      aria-label={`Play queued ${item.title}`}
                    >
                      Play
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-11"
                      disabled={pendingIndex === 0}
                      onClick={() =>
                        dispatch({
                          type: "move",
                          key: entry.key,
                          direction: -1,
                        })
                      }
                      aria-label={`Move ${item.title} up in queue`}
                    >
                      Up
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-11"
                      disabled={index === state.queue.length - 1}
                      onClick={() =>
                        dispatch({ type: "move", key: entry.key, direction: 1 })
                      }
                      aria-label={`Move ${item.title} down in queue`}
                    >
                      Down
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-11"
                      onClick={() =>
                        dispatch({ type: "remove", key: entry.key })
                      }
                      aria-label={`Remove ${item.title} from queue`}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => dispatch({ type: "replay" })}
            >
              Replay queue from start
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                dispatch({ type: "clear" })
                setQueueOpen(false)
              }}
            >
              Clear queue & stop audio
            </Button>
          </div>
          <PreviewStates owner="audio" />
        </SessionDialog>
      )}
    </>
  )
}
