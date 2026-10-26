import { Link } from "react-router";
import { useEvents, eventTime, type ApiEvent } from "@/context/EventsContext";
import type { ContentItem } from "@/data/mockContent";
import EventArtwork from "@/components/events/EventArtwork";
export function ApiEventCard({
  item,
  fluid = false,
  event,
}: {
  item: ContentItem;
  fluid?: boolean;
  event?: ApiEvent;
}) {
  const events = useEvents(),
    e = event ?? events.items.find((x) => x.id === item.id);
  if (!e) return null;
  const date = new Date(e.startsAt),
    month = new Intl.DateTimeFormat("en-JM", {
      month: "short",
      timeZone: e.timezone,
    }).format(date),
    day = new Intl.DateTimeFormat("en-JM", {
      day: "2-digit",
      timeZone: e.timezone,
    }).format(date);
  const status =
    e.lifecycle === "completed"
      ? e.replayAvailable
        ? "Replay available"
        : "Event ended"
      : e.lifecycle === "scheduled"
        ? "Coming up"
        : e.lifecycle === "postponed"
          ? "Postponed"
          : e.lifecycle === "cancelled"
            ? "Cancelled"
            : e.lifecycle;
  return (
    <article
      className={
        "event-campaign-card group min-w-0 shrink-0 " +
        (fluid ? "w-full" : "w-72 md:w-80")
      }
      data-content-type="event"
    >
      <Link
        to={"/events/" + e.id}
        aria-label={"Open " + e.title}
        className="relative block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        <EventArtwork src={e.artwork.landscapeUrl} title={e.title} />
        <span className="absolute bottom-3 left-3 rounded bg-black/85 px-3 py-1.5 text-xs font-semibold text-gold">
          {status}
        </span>
      </Link>
      <div className="event-campaign-card__body">
        <div className="flex min-w-0 items-start gap-3">
          <div aria-hidden="true" className="event-date-stamp">
            <span>{month}</span>
            <strong>{day}</strong>
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
              {e.format === "online"
                ? "Online"
                : e.format === "hybrid"
                  ? "In person + online"
                  : "In person"}
            </p>
            <h3 className="event-campaign-card__title">
              <Link to={"/events/" + e.id} className="hover:text-gold">
                {e.title}
              </Link>
            </h3>
          </div>
        </div>
        <p className="event-campaign-card__time">
          {eventTime(e)} · {e.timezone}
        </p>
        <p className="event-campaign-card__venue">
          {e.format === "online" ? "Join from wherever you are" : e.venue}
        </p>
        <div className="event-campaign-card__footer">
          <span className="text-xs text-text-secondary">
            {e.classification}
            {e.replayAvailable
              ? " · " +
                (e.accessTier === "premium" ? "MGTV+ replay" : "Free replay")
              : ""}
          </span>
          <Link
            to={"/events/" + e.id}
            className="inline-flex min-h-11 items-center text-xs font-semibold text-gold"
          >
            {e.lifecycle === "cancelled"
              ? "View update"
              : e.lifecycle === "postponed"
                ? "See the latest"
                : e.replayAvailable
                  ? "Explore replay"
                  : "Explore event"}{" "}
            ›
          </Link>
        </div>
      </div>
    </article>
  );
}
