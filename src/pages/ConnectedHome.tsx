import { RailViewport } from "@/components/home/RailViewport";
import LifecycleRails from "@/components/home/LifecycleRails";
import { ApiEventCard } from "@/components/home/ApiEventCard";
import { Link } from "react-router";
import { useHomepage, homepageItem, type HomepageEntry } from "@/lib/homepage";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedStatus } from "@/components/home/FeaturedStatus";
import { ContentRail } from "@/components/home/ContentRail";
import { MediaCard } from "@/components/home/MediaCard";
import { LibraryCard } from "@/components/music/LibraryCard";

import { SponsoredCards } from "@/components/shared/SponsoredCards";
import { useCatalog } from "@/hooks/useCatalog";
import { useCustomerSession } from "@/lib/customerAuth";
const destinations: Record<string, [string, string]> = {
  shows: ["/shows", "All shows"],
  movies: ["/movies", "All movies"],
  music: ["/music", "All videos"],
  sports: ["/sports", "All sports"],
  events: ["/events", "All events"],
  news: ["/news", "All news"],
  lifestyle: ["/lifestyle", "All lifestyle stories"],
  "my-list": ["/my-list", "My List"],
};
function CuratedCard({
  entry,
  fluid = false,
}: {
  entry: HomepageEntry;
  fluid?: boolean;
}) {
  return entry.kind === "event" ? (
    <ApiEventCard
      item={homepageItem(entry)}
      event={entry.content}
      fluid={fluid}
    />
  ) : ["album", "playlist"].includes(entry.kind) ? (
    <div className={fluid ? "min-w-0" : "w-44 shrink-0 md:w-52"}>
      <LibraryCard item={entry.content} kind={entry.kind + "s"} />
    </div>
  ) : (
    <MediaCard item={homepageItem(entry)} fluid={fluid} />
  );
}
function EditorialSection({ section: s }: { section: any }) {
  const destination = destinations[s.destination];
  if (
    s.layout === "rail" &&
    !s.items.some((r: HomepageEntry) =>
      ["album", "playlist", "event"].includes(r.kind),
    )
  )
    return (
      <ContentRail
        title={s.label}
        context={s.description}
        items={s.items.map(homepageItem)}
        seeAllHref={destination?.[0]}
        seeAllLabel={destination?.[1]}
      />
    );
  if (s.layout === "rail")
    return (
      <RailViewport
        title={s.label}
        description={s.description}
        format={
          s.items.every((entry: HomepageEntry) =>
            ["album", "playlist", "artist"].includes(entry.kind),
          )
            ? "artist"
            : "landscape"
        }
        seeAllHref={destination?.[0]}
        seeAllLabel={destination?.[1]}
      >
        {s.items.map((entry: HomepageEntry) => (
          <div
            key={entry.kind + entry.id}
            className="mgtv-rail-item flex shrink-0 snap-start flex-col"
          >
            <CuratedCard entry={entry} fluid />
          </div>
        ))}
      </RailViewport>
    );
  if (s.layout === "news") {
    const [first, ...rest] = s.items as HomepageEntry[];
    return (
      <section className="mx-auto max-w-[1760px] px-6 py-8 md:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            {s.description && (
              <p className="text-sm text-text-secondary">{s.description}</p>
            )}
            <h2 className="font-display text-3xl">{s.label}</h2>
          </div>
          {destination && (
            <Link className="text-sm text-gold" to={destination[0]}>
              {destination[1]}
            </Link>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-[3fr_2fr]">
          {first && (
            <Link
              to={"/" + first.kind + "/" + first.id}
              className="group relative block min-h-80 overflow-hidden rounded-xl"
            >
              <img
                src={first.content.coverUrl}
                alt={first.content.imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
              <div className="relative px-6 pb-8 pt-44">
                <p className="text-xs uppercase tracking-widest text-gold">
                  {first.content.category}
                </p>
                <h3 className="mt-2 font-display text-4xl group-hover:text-gold">
                  {first.content.title}
                </h3>
                <p className="mt-3 text-sm text-text-secondary">
                  {first.content.summary}
                </p>
              </div>
            </Link>
          )}
          <div className="space-y-4">
            {rest.map((r) => (
              <Link
                key={r.kind + r.id}
                to={"/" + r.kind + "/" + r.id}
                className="group flex gap-4 rounded-lg bg-bg-surface p-4"
              >
                <img
                  src={r.content.coverUrl}
                  alt={r.content.imageAlt}
                  className="h-24 w-28 shrink-0 rounded object-cover"
                />
                <div>
                  <p className="text-xs uppercase text-gold">
                    {r.content.category}
                  </p>
                  <h3 className="mt-2 font-display text-xl group-hover:text-gold">
                    {r.content.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="mx-auto max-w-[1760px] px-6 py-6 md:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          {s.description && (
            <p className="text-sm text-text-secondary">{s.description}</p>
          )}
          <h2 className="font-display text-3xl">{s.label}</h2>
        </div>
        {destination && (
          <Link to={destination[0]} className="text-sm text-gold">
            {destination[1]}
          </Link>
        )}
      </div>
      <div
        className={
          s.layout === "grid"
            ? "grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "flex gap-5 overflow-x-auto pb-3"
        }
      >
        {s.items.map((r: HomepageEntry) => (
          <CuratedCard
            key={r.kind + r.id}
            entry={r}
            fluid={s.layout === "grid"}
          />
        ))}
      </div>
    </section>
  );
}
export default function ConnectedHome() {
  const page = useHomepage("home"),
    { continueWatching } = useCatalog(),
    auth = useCustomerSession();
  return (
    <main className="pt-16">
      <FeaturedStatus page={page} />
      {page.hero.length ? (
        <HeroSection items={page.hero.map(homepageItem)} />
      ) : !page.loading && !page.error && !page.profileRequired ? (
        <section className="mx-auto max-w-[1760px] px-6 py-20 md:px-8">
          <h1 className="font-display text-5xl">Your next story starts here</h1>
          <p className="mt-5 text-text-secondary">
            Explore MGTV while the next editorial selection takes shape.
          </p>
          <Link className="mt-5 inline-block text-gold" to="/shows">
            Browse shows
          </Link>
        </section>
      ) : null}
      <LifecycleRails />
      <SponsoredCards
        kind="home"
        targetId="00000000-0000-4000-8000-000000000000"
      />
      <div className="mt-2 space-y-2">
        {(page.data?.sections ?? []).map((s: any) =>
          s.kind === "membership" ? (
            <section
              key={s.id}
              className="mx-auto my-8 max-w-[1760px] px-6 md:px-8"
            >
              <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold-dim to-bg-surface p-6 md:flex-row md:items-center md:p-10">
                <div className="max-w-xl">
                  <p className="mb-3 text-sm font-bold uppercase tracking-widest text-gold">
                    MGTV+
                  </p>
                  <h2 className="mb-4 font-display text-3xl md:text-5xl">
                    {s.label}
                  </h2>
                  <p className="text-text-secondary">
                    {s.description ||
                      "Explore Roots, Rhythm and Gold. Find the profile allowance and viewing quality that suit your household."}
                  </p>
                </div>
                <Link
                  className="shrink-0 rounded-lg bg-gold px-6 py-3 font-semibold text-black"
                  to="/mgtv-plus"
                >
                  Explore MGTV+
                </Link>
              </div>
            </section>
          ) : s.kind === "continue-watching" ? (
            auth.session?.activeProfileId ? (
              <ContentRail
                key={s.id}
                title={s.label}
                context={s.description}
                cardType="continueWatching"
                items={continueWatching}
                seeAllHref="/my-list"
                seeAllLabel="My List"
              />
            ) : null
          ) : (
            <EditorialSection key={s.id} section={s} />
          ),
        )}
      </div>
    </main>
  );
}
