import { useParams } from "react-router"
import { allEventDetails, broadcasts, demoReference } from "@/data/mockContent"
import { getEventPresentation } from "@/lib/eventPresentation"
import { VideoPlayer } from "@/components/player/VideoPlayer"
import { ContentUnavailable } from "@/components/shared/ContentUnavailable"
import { EventSummary } from "@/components/events/EventSummary"
import { ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"

export function EventWatchPage() {
  const { id } = useParams()
  const event = id ? allEventDetails[id] : undefined
  if (!event)
    return (
      <ContentUnavailable
        kind="Broadcast"
        backTo="/events"
        backLabel="Browse events"
      />
    )
  const presentation = getEventPresentation(
    event,
    broadcasts[event.broadcastId ?? ""],
  )
  const broadcast = presentation.broadcast
  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <div className="mx-auto max-w-5xl px-6 py-8 md:px-12">
        <ButtonLink to={`/events/${event.id}`} variant="ghost" className="mb-6">
          Back to event
        </ButtonLink>
        <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
          {presentation.label} · Fixed demonstration
        </Text>
        <Text as="h1" className="mb-6 font-display text-4xl md:text-6xl">
          {event.title}
        </Text>
        {presentation.playable && broadcast ? (
          <VideoPlayer
            key={broadcast.id}
            mediaId={broadcast.id}
            title={event.title}
            thumbnail={event.image}
            media={{
              id: broadcast.id,
              live: presentation.live,
              duration: broadcast.durationSeconds,
            }}
          />
        ) : (
          <div className="rounded-xl border border-gold/20 bg-bg-surface p-8">
            <Text as="h2" className="mb-4 font-display text-3xl">
              {presentation.label === "Stream unavailable"
                ? "Stream unavailable"
                : "Playback not available"}
            </Text>
            <Text
              role="status"
              className="text-sm leading-relaxed text-text-secondary"
            >
              {presentation.message}
            </Text>
            <Text className="mt-4 text-xs text-text-secondary">
              Nothing has started. No alternative stream has been substituted.
            </Text>
          </div>
        )}
        <div className="mt-8">
          <EventSummary eventId={event.id} />
        </div>
        <Text className="mt-6 text-xs text-text-secondary">
          Reference schedule: {demoReference}. Starting a video preview pauses
          audio. Audio resumes only when you press Play.
        </Text>
      </div>
    </main>
  )
}
