import { ConnectedEventsPage } from "./ConnectedEvents";
import { allEventDetails, demoReference } from "@/data/mockContent"
import { Text } from "@/components/ui/Text"
import { EventSummary, EventActions } from "@/components/events/EventSummary"
import { DiscoveryResults } from "@/components/shared/DiscoveryResults"
import { useCatalog } from "@/hooks/useCatalog"
import { EmptyFeature } from "@/components/shared/EmptyFeature"
export function EventsPage() { return import.meta.env.VITE_API_MODE === "connected" ? <ConnectedEventsPage/> : <PrototypeEventsPage/>; }
function PrototypeEventsPage() {
  const { upcomingEvents } = useCatalog()
  const featured =
    allEventDetails[
      (upcomingEvents.find((e) => e.id === "e3") ?? upcomingEvents[0])?.id
    ]
  return (
    <main className="min-h-screen bg-bg-base">
      {featured ? (
        <section className="relative isolate overflow-hidden">
          <img
            src={featured.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/70 to-bg-base/30" />
          <div className="relative mx-auto max-w-[1760px] px-6 py-16 md:px-8 md:py-24">
            <Text className="mb-5 text-xs font-semibold uppercase tracking-widest text-gold">
              MGTV Events / Featured demonstration
            </Text>
            <Text
              as="h1"
              className="mb-6 max-w-2xl font-display text-5xl leading-none md:text-7xl"
            >
              {featured.title}
            </Text>
            <div className="mb-7 max-w-xl">
              <EventSummary eventId={featured.id} />
            </div>
            <EventActions eventId={featured.id} />
          </div>
        </section>
      ) : (
        <EmptyFeature />
      )}
      <Text className="mx-auto max-w-[1760px] px-6 pt-6 text-xs leading-relaxed text-text-secondary md:px-8">
        Fixed sample schedule: {demoReference}. Date filters use September 10 in
        UTC. Event and broadcast states are independent. No ticketing or
        real-time livestreams.
      </Text>
      <DiscoveryResults
        items={upcomingEvents}
        scope="events"
        title="Explore events"
      />
    </main>
  )
}
