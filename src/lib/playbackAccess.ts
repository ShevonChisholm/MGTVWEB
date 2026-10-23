import type { AppState } from "./appState"
import { activeProfile } from "./appState"
import { playbackReason } from "./accessPolicy"
import type { PlaybackState, Action } from "./playback"

export function reconcilePlayback(
  value: PlaybackState,
  account: AppState,
): PlaybackState {
  const queue = value.queue.filter(
    (entry) => !playbackReason(account, entry.media.id),
  )
  const key = value.queue[value.index]?.key
  let next =
    queue.length !== value.queue.length
      ? {
          ...value,
          queue,
          index: queue.findIndex((entry) => entry.key === key),
        }
      : value
  for (const owner of ["audio", "video"] as const) {
    const session = next[owner]
    const reason = session
      ? playbackReason(account, session.media.id)
      : undefined
    if (
      session &&
      reason &&
      (session.reason !== reason || session.status !== "unavailable")
    )
      next = {
        ...next,
        owner: next.owner === owner ? null : next.owner,
        [owner]:
          owner === "audio"
            ? null
            : {
                ...session,
                status: "unavailable",
                reason,
                retryable: false,
                completed: false,
                policyBlocked: true,
              },
        serial: next.serial + 1,
      }
    else if (session?.policyBlocked && !reason)
      next = {
        ...next,
        owner: next.owner === owner ? null : next.owner,
        [owner]: {
          ...session,
          status: "paused",
          reason: undefined,
          policyBlocked: false,
        },
        serial: next.serial + 1,
      }
  }
  return {
    ...next,
    autoplay: activeProfile(account)?.preferences.autoplay ?? true,
  }
}
export function actionReason(
  value: PlaybackState,
  action: Action,
  account: AppState,
) {
  let ids =
    action.type === "audioContext"
      ? action.media.map((m) => m.id)
      : action.type === "enqueue" || action.type === "prepareVideo"
        ? [action.media.id]
        : []
  if ("owner" in action && ["play", "buffer", "ready"].includes(action.type)) {
    const id = value[action.owner]?.media.id
    if (id) ids.push(id)
  }
  if (
    action.type === "select" ||
    action.type === "replay" ||
    action.type === "next"
  ) {
    const index =
      action.type === "select"
        ? action.index
        : action.type === "replay"
          ? 0
          : value.index + 1
    const id = value.queue[index]?.media.id
    if (id) ids.push(id)
  }
  return ids.map((id) => playbackReason(account, id)).find(Boolean)
}
