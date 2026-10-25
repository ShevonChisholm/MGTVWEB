import EventTickets from "@/components/events/EventTickets";
import LifecycleRails from "@/components/home/LifecycleRails";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useHomepage } from "@/lib/homepage";
import { FeaturedStatus } from "@/components/home/FeaturedStatus";
import { ReportContent } from "@/components/moderation/ReportContent";
import { SponsoredCards } from "@/components/shared/SponsoredCards";
import { AdaptiveVideo } from "@/components/player/AdaptiveVideo";
import { SponsorStrip } from "@/components/shared/SponsorStrip";
import { HeroBackdrop } from "@/components/shared/HeroBackdrop";
import { useMusicAudio } from "@/context/MusicAudioContext";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import {
  useEvents,
  eventTime,
  eventItem,
  type ApiEvent,
} from "@/context/EventsContext";
import { customerApi } from "@/lib/customerAuth";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ContentRail } from "@/components/home/ContentRail";
import { ApiEventCard } from "@/components/home/ApiEventCard";
import { ShareBar } from "@/components/shared/ShareBar";

function Summary({ event: e }: { event: ApiEvent }) {
  return (
    <div className="space-y-2 text-sm text-text-secondary">
      <p className="capitalize text-gold">
        {e.lifecycle} · {e.format.replace(/_/g, " ")}
      </p>
      <p>
        {eventTime(e)} · {e.timezone}
      </p>
      <p>
        Ends{" "}
        {new Intl.DateTimeFormat("en-JM", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: e.timezone,
        }).format(new Date(e.endsAt))}
      </p>
      {e.venue && <p>{e.venue}</p>}
      {e.previousStart && (
        <p>
          Previously{" "}
          {new Intl.DateTimeFormat("en-JM", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: e.timezone,
          }).format(new Date(e.previousStart))}
          .
        </p>
      )}
      {e.statusReason && <p>{e.statusReason}</p>}
    </div>
  );
}
function Actions({ event: e }: { event: ApiEvent }) {
  return (
    <div className="flex flex-wrap gap-3">
      {e.replayAvailable && (
        <ButtonLink to={"/events/" + e.id + "/watch"}>
          Watch the replay
        </ButtonLink>
      )}
      {e.previewAvailable && (
        <ButtonLink
          variant="outline"
          to={"/events/" + e.id + "/watch?preview=1"}
        >
          Catch a preview
        </ButtonLink>
      )}
      {e.registrationUrl && e.lifecycle === "scheduled" && (
        <a
          href={e.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-lg border border-gold/40 px-5 text-sm text-gold"
        >
          Tickets & registration ↗
        </a>
      )}
    </div>
  );
}
function State() {
  const c = useEvents();
  return c.busy ? (
    <LoadingSkeleton label={<>Loading events…</>} variant="cards" />
  ) : c.error ? (
    <div role="alert">
      {c.error} <Button onClick={c.refresh}>Try again</Button>
    </div>
  ) : c.profileRequired ? (
    <ButtonLink to="/profiles">Choose your profile</ButtonLink>
  ) : null;
}
export function ConnectedEventsPage() {
  const c = useEvents(),
    [query, setQuery] = useState(""),
    [lifecycle, setLifecycle] = useState(""),
    [format, setFormat] = useState("");
  const featuredPage = useHomepage("events"),
    featured = featuredPage.hero[0]?.content as ApiEvent | undefined;
  const items = c.items
    .filter(
      (e) =>
        e.title.toLowerCase().includes(query.toLowerCase()) &&
        (!lifecycle || e.lifecycle === lifecycle) &&
        (!format || e.format === format),
    )
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  return (
    <main className="min-h-screen bg-bg-base pt-16">
      <FeaturedStatus page={featuredPage} />
      {!featured && (
        <h1 className="px-6 py-8 font-display text-5xl md:px-8">Events</h1>
      )}
      {featured && (
        <section className="relative isolate overflow-hidden">
          <HeroBackdrop
            poster={featured.artwork.landscapeUrl}
            featureUrl={featured.featureUrl}
          />
          <div className="relative mx-auto max-w-[1760px] px-6 py-16 md:px-8 md:py-24">
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-gold">
              MGTV Events / Make a moment of it
            </p>
            <h1 className="mb-6 max-w-3xl font-display text-5xl leading-none md:text-7xl">
              {featured.title}
            </h1>
            <div className="mb-7 max-w-xl">
              <Summary event={featured} />
            </div>
            <Actions event={featured} />
            <SponsorStrip key={featured.id} kind="events" id={featured.id} compact context={featured.title}/>
          </div>
        </section>
      )}
      <LifecycleRails surface="events" />
      <section className="mx-auto max-w-[1760px] px-6 py-10 md:px-8">
        <h2 className="mb-6 font-display text-3xl">Find your next moment</h2>
        <State />
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <label className="text-sm">
            Search events
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-2 block min-h-11 w-full rounded-lg border border-white/15 bg-bg-surface px-3"
            />
          </label>
          <label className="text-sm">
            Event status
            <select
              value={lifecycle}
              onChange={(e) => setLifecycle(e.target.value)}
              className="mt-2 block min-h-11 w-full rounded-lg border border-white/15 bg-bg-surface px-3"
            >
              <option value="">All events</option>
              {["scheduled", "postponed", "cancelled", "completed"].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Where it happens
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="mt-2 block min-h-11 w-full rounded-lg border border-white/15 bg-bg-surface px-3"
            >
              <option value="">Everywhere</option>
              <option value="in_person">In person</option>
              <option value="online">Online</option>
              <option value="hybrid">In person + online</option>
            </select>
          </label>
        </div>
        {!c.busy && !c.error && !c.profileRequired && !items.length && (
          <p>No events match. Try another search or filter.</p>
        )}
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((e) => (
            <ApiEventCard key={e.id} item={eventItem(e)} fluid />
          ))}
        </div>
      </section>
    </main>
  );
}
export function ConnectedEventDetail() {
  const { id } = useParams(),
    c = useEvents(),
    [event, setEvent] = useState<ApiEvent | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  useEffect(() => {
    let active = true;
    setEvent(null);
    setError("");
    if (c.busy) return;
    void c
      .request("/" + id)
      .then((e) => {
        if (active) setEvent(e);
      })
      .catch((e) => {
        if (active)
          setError(
            e instanceof SyntaxError
              ? "MGTV could not be reached. Try again in a moment."
              : e.message,
          );
      });
    return () => {
      active = false;
    };
  }, [id, c.request, c.busy]);
  async function interest() {
    if (!event || !c.session?.activeProfileId) return;
    setBusy(true);
    setNotice("");
    try {
      const r = await customerApi(
        "/events/" + id + "/interest",
        "PUT",
        { interested: !event.interest?.interested },
        {
          "If-Match": '"v' + (event.interest?.version ?? 0) + '"',
          "X-Profile-Context": c.session.activeProfileId,
        },
      );
      setEvent({ ...event, interest: r });
      setNotice(
        r.interested
          ? "Added to your interests."
          : "Removed from your interests.",
      );
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!event)
    return (
      <main className="mx-auto min-h-screen max-w-[1760px] px-6 py-28 md:px-8">
        <ButtonLink to="/events" variant="ghost">
          Back to events
        </ButtonLink>
        <h1 className="mt-6 font-display text-4xl">
          {error ? "Event unavailable" : "Opening the event"}
        </h1>
        {error ? <p role="alert">{error}</p> : <State />}
      </main>
    );
  return (
    <main className="min-h-screen bg-bg-base pt-16">
      <section className="relative isolate overflow-hidden">
        <img
          src={event.artwork.landscapeUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/70 to-bg-base/20" />
        <div className="relative mx-auto max-w-[1760px] px-6 py-14 md:px-8 md:py-20">
          <ButtonLink to="/events" variant="ghost" className="mb-6">
            Back to events
          </ButtonLink>
          <p className="mb-4 text-xs uppercase tracking-widest text-gold">
            MGTV Events ·{" "}
            {event.accessTier === "premium"
              ? "MGTV+ replay"
              : "Free replay access"}
          </p>
          <h1 className="mb-6 max-w-4xl font-display text-5xl md:text-7xl">
            {event.title}
          </h1>
          <Summary event={event} />
          <div className="mt-7">
            <Actions event={event} />
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-[1760px] gap-10 px-6 py-10 md:px-8 lg:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="mb-4 font-display text-3xl">
            The story behind the moment
          </h2>
          <p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
            {event.description}
          </p>
          <ReportContent kind="event" contentId={event.id} />
          <SponsoredCards kind="event" targetId={event.id} />
          <EventTickets id={event.id} />
          <SponsorStrip kind="events" id={event.id} />
          {event.performers.length > 0 && (
            <>
              <h3 className="mb-3 font-display text-2xl">In the spotlight</h3>
              <p className="mb-6 text-text-secondary">
                {event.performers.join(" · ")}
              </p>
            </>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <ShareBar title={event.title} compact />
            {c.session?.activeProfileId ? (
              <Button
                variant="outline"
                disabled={busy}
                aria-pressed={!!event.interest?.interested}
                onClick={() => void interest()}
              >
                {event.interest?.interested ? "✓ Interested" : "I'm interested"}
              </Button>
            ) : (
              <ButtonLink
                variant="outline"
                to={c.session ? "/profiles" : "/auth/sign-in"}
              >
                Sign in to show interest
              </ButtonLink>
            )}
          </div>
          <p role="status" className="mt-3 text-sm">
            {notice}
          </p>
        </section>
        <aside className="rounded-xl bg-bg-surface p-6">
          <h2 className="mb-4 font-display text-2xl">Before you join</h2>
          <p className="mb-4 text-sm text-text-secondary">
            {event.classification} · Times shown in {event.timezone}. Event
            status and replay availability are separate.
          </p>
          {event.onlineUrl && event.lifecycle === "scheduled" && (
            <a
              href={event.onlineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 inline-flex min-h-11 text-gold"
            >
              Open online event ↗
            </a>
          )}
          <p className="text-sm text-text-secondary">
            Interest is saved to your profile. Reminder delivery and live
            broadcasts are not connected.
          </p>
        </aside>
      </div>
      <ContentRail
        title="More moments to make"
        items={c.items.filter((e) => e.id !== id).map(eventItem)}
        seeAllHref="/events"
        seeAllLabel="All events"
      />
    </main>
  );
}
export function ConnectedEventWatch() {
  const audio = useMusicAudio();
  const { id } = useParams(),
    [params] = useSearchParams(),
    c = useEvents(),
    preview = params.get("preview") === "1";
  const [event, setEvent] = useState<ApiEvent | null>(null),
    [source, setSource] = useState(""),
    [error, setError] = useState(""),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setSource("");
    setEvent(null);
    setError("");
    if (c.busy) return;
    void (async () => {
      const e = await c.request("/" + id);
      if (!active) return;
      setEvent(e);
      if (preview) {
        if (!e.previewAvailable) throw Error("No preview is available.");
        setSource("/api/v1/catalog/events/" + id + "/preview");
      } else {
        if (!c.session)
          throw Error(
            "Sign in and choose a customer profile to watch this replay.",
          );
        const v = await customerApi(
          "/events/" + id + "/playback",
          "GET",
          undefined,
          { "X-Profile-Context": c.session.activeProfileId },
        );
        if (active) setSource(v.url);
      }
    })().catch((e) => {
      if (active)
        setError(
          e instanceof SyntaxError
            ? "MGTV could not be reached. Try again in a moment."
            : e.message,
        );
    });
    return () => {
      active = false;
    };
  }, [id, preview, c.request, c.busy, revision]);
  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-8">
        <ButtonLink to={"/events/" + id} variant="ghost">
          Back to event
        </ButtonLink>
        <p className="mt-6 text-xs uppercase tracking-widest text-gold">
          {preview ? "A taste of the moment" : "The replay"}
        </p>
        <h1 className="mb-6 mt-3 font-display text-4xl md:text-6xl">
          {event?.title ?? "MGTV Events"}
        </h1>
        {source ? (
          <AdaptiveVideo
            key={source}
            src={source}
            poster={event?.artwork.landscapeUrl}
            controls
            playsInline
            preload="metadata"
            aria-label={event?.title}
            className="aspect-video max-h-[75vh] w-full rounded-xl bg-black"
            onPlay={() => audio.stop()}
            onError={() => setError("This video could not load. Try again.")}
          />
        ) : !error ? (
          <p role="status">Preparing the event…</p>
        ) : null}
        {error && (
          <div
            role="alert"
            className="my-6 rounded-xl border border-gold/20 bg-bg-surface p-6"
          >
            <p>{error}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={() => setRevision((x) => x + 1)}>
                Try again
              </Button>
              <ButtonLink
                to={c.session ? "/profiles" : "/auth/sign-in"}
                variant="outline"
              >
                {c.session ? "Choose profile" : "Sign in"}
              </ButtonLink>
              <ButtonLink to="/mgtv-plus" variant="ghost">
                Explore MGTV tiers
              </ButtonLink>
            </div>
          </div>
        )}
        {event && (
          <div className="mt-8">
            <Summary event={event} />
            <SponsorStrip kind="events" id={event.id} compact context="This event replay"/>
          </div>
        )}
      </div>
    </main>
  );
}
