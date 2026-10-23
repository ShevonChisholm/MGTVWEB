import type { EventDetail, EventSchedule, Broadcast } from "@/data/mockContent"

type Event = EventDetail & EventSchedule
export function getEventPresentation(event: Event, broadcast?: Broadcast) {
  const blocked =
    event.eventStatus === "cancelled" || event.eventStatus === "postponed"
  const related =
    broadcast?.eventId === event.id && broadcast.id === event.broadcastId
      ? broadcast
      : undefined
  const unavailable = related?.preview.mode === "unavailable"
  const label = blocked
    ? event.eventStatus === "cancelled"
      ? "Cancelled"
      : "Postponed"
    : related?.status === "replayAvailable"
      ? "Replay available"
      : related?.status === "live"
        ? unavailable
          ? "Stream unavailable"
          : "Live"
        : {
            scheduled: "Scheduled",
            startingSoon: "Starting soon",
            inProgress: "In progress",
            ended: "Ended",
            postponed: "Postponed",
            cancelled: "Cancelled",
          }[event.eventStatus]
  const watchLabel =
    !blocked && related
      ? unavailable
        ? "View stream status"
        : related.status === "live"
          ? "Watch live"
          : related.status === "replayAvailable"
            ? "Watch replay"
            : undefined
      : undefined
  const message = blocked
    ? event.eventStatus === "postponed"
      ? "New date TBA. Original schedule shown below."
      : "This event has been cancelled. Original schedule shown below."
    : !related
      ? "No livestream planned."
      : unavailable
        ? related.preview.mode === "unavailable"
          ? related.preview.reason
          : ""
        : related.status === "ended"
          ? "Event ended. Replay not available."
          : related.status === "scheduled"
            ? "Broadcast scheduled. Playback is not available yet."
            : related.status === "startingSoon"
              ? "Broadcast starting soon. Waiting for the fixed demo start."
              : related.status === "live"
                ? "Simulated live example — no broadcast connected."
                : "Simulated concert replay — no video source connected."
  return {
    label,
    message,
    watchLabel,
    canRemind: ["scheduled", "startingSoon"].includes(event.eventStatus),
    playable: !!watchLabel && !unavailable,
    live: related?.status === "live",
    broadcast: related,
  }
}

export function eventSchedule(event: Event) {
  const format = (value: string) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: event.timeZone,
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "shortOffset",
    }).format(new Date(value))
  return `${format(event.startsAt)}${
    event.endsAt ? ` – ${format(event.endsAt)}` : ""
  } · ${event.timeZone}`
}
