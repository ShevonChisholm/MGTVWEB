import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { mediaFor, usePlayback } from "@/context/MediaPlaybackContext"
import { PlaybackControls, PreviewStates } from "./PlaybackControls"
import type { Media } from "@/lib/playback"

interface VideoPlayerProps {
  mediaId: string
  title: string
  thumbnail?: string
  media?: Media
  onEnded?: () => void
}
export function VideoPlayer({
  mediaId,
  title,
  thumbnail,
  media,
  onEnded,
}: VideoPlayerProps) {
  const { state, dispatch } = usePlayback()
  const container = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState("")
  const ended = useRef(true)
  const mountGeneration = useRef(0)
  const callback = useRef(onEnded)
  callback.current = onEnded
  useEffect(() => {
    const generation = ++mountGeneration.current
    dispatch({ type: "prepareVideo", media: media ?? mediaFor(mediaId) })
    return () => {
      // Strict Mode remounts effects; only a real release should pause playback.
      queueMicrotask(() => {
        if (mountGeneration.current === generation)
          dispatch({ type: "release", owner: "video", id: mediaId })
      })
    }
  }, [mediaId, dispatch])
  const session = state.video?.media.id === mediaId ? state.video : null
  useEffect(() => {
    if (session?.status === "ended" && session.completed && !ended.current) {
      ended.current = true
      callback.current?.()
    } else if (session && session.status !== "ended") ended.current = false
  }, [session?.status, session?.completed])
  return (
    <div ref={container} className="overflow-hidden rounded-xl bg-bg-surface">
      <div className="relative aspect-video bg-bg-base">
        {thumbnail && (
          <img
            src={thumbnail}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
          <Text className="rounded bg-bg-base/90 px-3 py-2 text-xs text-text-primary">
            {media?.live
              ? "Simulated live preview — no broadcast connected"
              : "Simulated preview — no audio/video source connected"}
          </Text>
          {session && (
            <Text role="status" className="text-sm font-semibold text-gold">
              {
                {
                  paused: "Ready when you are",
                  loading: "Loading preview…",
                  playing: "Preview running — still artwork only",
                  buffering: "Simulated buffering…",
                  ended: "Preview ended",
                  unavailable: "Preview unavailable",
                }[session.status]
              }
            </Text>
          )}
        </div>
      </div>
      <div className="p-4">
        {session && <PlaybackControls owner="video" title={title} />}
        <Button
          variant="ghost"
          size="sm"
          className="mt-3"
          onClick={async () => {
            try {
              if (document.fullscreenElement) await document.exitFullscreen()
              else await container.current?.requestFullscreen()
            } catch {
              setMessage("Fullscreen is unavailable in this preview browser.")
            }
          }}
        >
          Toggle fullscreen
        </Button>
        {message && (
          <Text role="status" className="text-xs text-text-secondary">
            {message}
          </Text>
        )}
        <PreviewStates owner="video" />
      </div>
    </div>
  )
}
