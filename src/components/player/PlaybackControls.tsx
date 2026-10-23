import { usePlayback } from "@/context/MediaPlaybackContext"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Text } from "@/components/ui/Text"
import { formatTime, isRunning, statusLabel, type Owner } from "@/lib/playback"

export function PlaybackControls({
  owner,
  title,
  compact = false,
}: {
  owner: Owner
  title: string
  compact?: boolean
}) {
  const { state, dispatch } = usePlayback()
  const session = state[owner]
  if (!session) return null
  const format = owner === "audio" ? "track" : "video"
  const action = isRunning(session)
    ? `Pause ${format}`
    : session.status === "unavailable" && session.retryable
      ? `Retry ${format}`
      : session.status === "ended"
        ? `Play ${format} again`
        : session.status === "paused" && session.elapsed > 0
          ? `Resume ${format}`
          : session.media.live
            ? "Watch live"
            : owner === "audio"
              ? "Play track"
              : "Watch video"
  return (
    <div className="min-w-0 space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size={compact ? "sm" : "md"}
          disabled={session.status === "unavailable" && !session.retryable}
          onClick={() =>
            dispatch({ type: isRunning(session) ? "pause" : "play", owner })
          }
          aria-label={`${action}: ${title} (simulated ${
            session.media.live ? "live demo" : "preview"
          })`}
        >
          {action}
        </Button>
        <Text as="span" role="status" className="text-xs text-text-secondary">
          {owner === "audio" && state.audioPausedForVideo
            ? "Audio paused for video"
            : session.status === "ended" && owner === "audio"
              ? "Queue finished"
              : statusLabel(session)}
        </Text>
      </div>
      {session.reason && (
        <Text role="status" className="text-xs text-gold">
          {session.reason}
        </Text>
      )}
      {!session.media.live && (
        <div className="flex items-center gap-3">
          <Input
            type="range"
            min={0}
            max={session.media.duration ?? 0}
            step={1}
            value={Math.floor(session.elapsed)}
            disabled={session.status === "unavailable"}
            aria-label={`Seek ${title}`}
            aria-valuetext={`${formatTime(session.elapsed)} of ${formatTime(session.media.duration ?? 0)}`}
            onChange={(event) =>
              dispatch({
                type: "seek",
                owner,
                elapsed: Number(event.target.value),
              })
            }
            className="h-11 min-w-0 flex-1 cursor-pointer rounded-none border-0 bg-transparent px-0 py-0 accent-gold"
          />
          <Text className="shrink-0 text-xs tabular-nums text-text-secondary">
            {formatTime(session.elapsed)} /{" "}
            {formatTime(session.media.duration ?? 0)}
          </Text>
        </div>
      )}
      {session.media.live && (
        <Text className="text-xs text-gold">
          Simulated live preview · No seeking or finite runtime
        </Text>
      )}
    </div>
  )
}

export function PreviewStates({ owner }: { owner: Owner }) {
  const { state, dispatch } = usePlayback()
  const current = state[owner]
  if (!current || current.media.unavailable) return null
  return (
    <details className="mt-4 border-t border-text-muted/20 pt-3 text-xs text-text-secondary">
      <summary className="cursor-pointer py-2">
        Preview states · Prototype only
      </summary>
      <Text className="my-2">
        These controls simulate playback conditions, not real network activity.
      </Text>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: "buffer", owner })}
        >
          Simulate buffering
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: "fail", owner })}
        >
          Simulate failure
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={
            !!current.media.live ||
            current.status === "unavailable" ||
            state.owner !== owner
          }
          onClick={() => dispatch({ type: "finish", owner })}
        >
          Finish preview
        </Button>
      </div>
    </details>
  )
}
