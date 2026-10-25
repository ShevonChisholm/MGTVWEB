import { Link } from "react-router";

import { Badge } from "@/components/ui/Badge";

import { useEvents, eventTime, type ApiEvent } from "@/context/EventsContext";

import type { ContentItem } from "@/data/mockContent";

export function ApiEventCard({
  item,
  fluid = false,
  event,
}: {
  item: ContentItem;
  fluid?: boolean;
  event?: ApiEvent;
}) {
  const events=useEvents();
  const e = event ?? events.items.find((x) => x.id === item.id);
  if (!e) return null;

  return (
    <article
      className={`group min-w-0 shrink-0 ${fluid ? "w-full" : "w-72 md:w-80"}`}
      data-content-type="event"
    >
      <Link
        to={"/events/" + e.id}
        aria-label={"Open " + e.title}
        className="relative block aspect-video overflow-hidden rounded-xl bg-bg-elevated"
      >
        <img
          src={e.artwork.landscapeUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <Badge
          variant={e.accessTier === "premium" ? "premium" : "free"}
          className="absolute left-3 top-3"
        />
        <span className="absolute bottom-3 left-3 rounded bg-bg-base/90 px-2 py-1 text-xs capitalize text-gold">
          {e.lifecycle === "completed" && e.replayAvailable
            ? "Replay available"
            : e.lifecycle}
        </span>
      </Link>
      <div className="space-y-2 pt-3">
        <p className="text-xs text-gold">
          {eventTime(e)} · {e.timezone}
        </p>
        <Link to={"/events/" + e.id} className="font-semibold hover:text-gold">
          {e.title}
        </Link>
        <p className="text-xs text-text-secondary">
          {e.format === "online" ? "Online" : e.venue} · {e.classification}
        </p>
        <Link
          to={"/events/" + e.id}
          className="inline-flex min-h-11 items-center text-xs font-semibold text-gold"
        >
          Step inside the event ›
        </Link>
      </div>
    </article>
  );
}
