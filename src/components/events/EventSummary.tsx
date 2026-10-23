import { allEventDetails, broadcasts } from "@/data/mockContent"
import { eventSchedule, getEventPresentation } from "@/lib/eventPresentation"
import { useInteraction } from "@/context/InteractionContext"
import { useToast } from "@/context/ToastContext"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { useAppState } from "@/context/AppStateContext"

export function EventSummary({
  eventId,
  compact = false,
}: {
  eventId: string
  compact?: boolean
}) {
  const event = allEventDetails[eventId]
  if (!event) return null
  const presentation = getEventPresentation(
    event,
    broadcasts[event.broadcastId ?? ""],
  )
  return (
    <div className="space-y-2">
      <Text className="text-xs font-semibold text-gold">
        {presentation.label === "Live"
          ? "Live demo"
          : `${presentation.label} · Demo`}
      </Text>
      {!compact && (
        <>
          <Text className="text-sm leading-relaxed text-text-secondary">
            Sample schedule · {eventSchedule(event)}
          </Text>
          <Text className="text-sm text-text-primary">
            {event.locationKind === "online"
              ? "Online event"
              : event.locationKind === "hybrid"
                ? "Hybrid event"
                : "In-person event"}{" "}
            · {event.location}
          </Text>
        </>
      )}
      {!compact && (
        <Text className="text-sm leading-relaxed text-text-secondary">
          {presentation.message}
        </Text>
      )}
    </div>
  )
}

export function EventActions({
  eventId,
  details = false,
}: {
  eventId: string
  details?: boolean
}) {
  const app = useAppState()
  const event = allEventDetails[eventId]
  const { toggleReminder, hasReminder } = useInteraction()
  const { addToast } = useToast()
  if (!event) return null
  const presentation = getEventPresentation(
    event,
    broadcasts[event.broadcastId ?? ""],
  )
  const marked = hasReminder(eventId)
  return (
    <div className="flex flex-wrap items-center gap-3">
      {!details && (
        <ButtonLink variant="outline" to={`/events/${eventId}`}>
          View event
        </ButtonLink>
      )}
      {presentation.watchLabel && (
        <ButtonLink
          to={`/events/${eventId}/watch`}
          aria-label={`${presentation.watchLabel}: ${event.title} (demo)`}
        >
          {presentation.watchLabel}
        </ButtonLink>
      )}
      {(presentation.canRemind || marked) && (
        <Button
          variant="ghost"
          aria-pressed={marked}
          onClick={() => {
            if (!app.requirePersonal(eventId)) return
            toggleReminder(eventId)
            addToast(
              marked
                ? "Prototype reminder removed."
                : "Prototype reminder saved for this session; no notification will be sent.",
              marked ? "info" : "success",
            )
          }}
        >
          {marked ? "Remove reminder" : "Remind me"}
        </Button>
      )}
      {marked && app.profile?.preferences.notifications.Events === false && (
        <Text className="text-xs text-text-secondary">
          Saved · In-app event alerts off
        </Text>
      )}
    </div>
  )
}
