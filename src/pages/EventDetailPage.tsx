import { useParams } from "react-router"
import {
  allEventDetails,
  upcomingEvents,
  demoReference,
} from "@/data/mockContent"
import { ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { ContentRail } from "@/components/home/ContentRail"
import { ShareBar } from "@/components/shared/ShareBar"
import { LikeButton } from "@/components/shared/LikeButton"
import { RatingWidget } from "@/components/shared/RatingWidget"
import { ContentUnavailable } from "@/components/shared/ContentUnavailable"
import { EventSummary, EventActions } from "@/components/events/EventSummary"

export function EventDetailPage() {
  const { id } = useParams()
  const event = id ? allEventDetails[id] : undefined
  if (!event)
    return (
      <ContentUnavailable
        kind="Event"
        backTo="/events"
        backLabel="Browse events"
      />
    )
  return (
    <main className="min-h-screen bg-bg-base pt-16">
      <section className="relative isolate overflow-hidden">
        <img
          src={event.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/70 to-bg-base/20" />
        <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-16 md:py-20">
          <ButtonLink to="/events" variant="ghost" className="mb-6">
            Back to events
          </ButtonLink>
          <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
            {event.genre} · Sample event
          </Text>
          <Text
            as="h1"
            className="mb-6 max-w-3xl font-display text-5xl leading-none md:text-7xl"
          >
            {event.title}
          </Text>
          <div className="max-w-2xl">
            <EventSummary eventId={event.id} />
          </div>
          <div className="mt-7">
            <EventActions eventId={event.id} details />
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-16">
        <Text className="mb-8 text-xs text-text-secondary">
          Fixed sample schedule as of {demoReference}. States do not follow the
          current clock.
        </Text>
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <section>
            <Text as="h2" className="mb-4 font-display text-3xl">
              About this event
            </Text>
            <Text className="mb-6 text-sm leading-relaxed text-text-secondary">
              {event.description}
            </Text>
            <Text role="note" className="mb-6 text-sm text-text-secondary">
              Sample editorial copy · Dates, venue, participants and broadcast
              rights await owner confirmation.
            </Text>
            {event.performers.length > 0 && (
              <>
                <Text as="h3" className="mb-3 font-display text-2xl">
                  Featuring
                </Text>
                <Text className="mb-6 text-sm leading-relaxed text-text-secondary">
                  {event.performers.join(" · ")}
                </Text>
              </>
            )}
            <div className="flex flex-wrap gap-4">
              <ShareBar title={event.title} compact />
              <LikeButton id={event.id} label="Interested" />
            </div>
            <div className="mt-8">
              <RatingWidget id={event.id} label="Rate this event" />
            </div>
          </section>
          <aside className="space-y-6">
            <div className="rounded-xl bg-bg-surface p-6">
              <Text as="h2" className="mb-4 font-display text-2xl">
                Event information
              </Text>
              <Text className="mb-3 text-xs font-semibold uppercase tracking-wide text-gold">
                Physical / online event status:{" "}
                {
                  {
                    scheduled: "Scheduled",
                    startingSoon: "Starting soon",
                    inProgress: "In progress",
                    ended: "Ended",
                    postponed: "Postponed",
                    cancelled: "Cancelled",
                  }[event.eventStatus]
                }
              </Text>
              <Text className="text-xs text-text-secondary">
                Ticketing and registration are not connected. No purchase is
                available in this prototype.
              </Text>
            </div>
          </aside>
        </div>
      </div>
      <ContentRail
        title="More Events"
        items={upcomingEvents.filter((item) => item.id !== event.id)}
        seeAllHref="/events"
        seeAllLabel="All events"
      />
    </main>
  )
}
