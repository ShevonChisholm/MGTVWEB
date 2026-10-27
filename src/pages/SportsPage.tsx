import SportsSkeleton from "@/components/sports/SportsSkeleton";
import LifecycleRails from "@/components/home/LifecycleRails";
import { useHomepage, homepageItem } from "@/lib/homepage";
import { FeaturedStatus } from "@/components/home/FeaturedStatus";
import { MovieDiscovery } from "@/components/movies/MovieDiscovery";
import { useSports } from "@/context/SportsContext";
import { HeroBackdrop } from "@/components/shared/HeroBackdrop";
import { ContentRail } from "@/components/home/ContentRail";
import { contentPath, watchPath } from "@/data/mockContent";
import { ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useCatalog } from "@/hooks/useCatalog";
import { DiscoveryResults } from "@/components/shared/DiscoveryResults";

export function SportsPage() {
  const remote = useSports();
  const connected = import.meta.env.VITE_API_MODE === "connected";
  const { sportsHighlights } = useCatalog();
  const filtered = sportsHighlights;
  const featuredPage = useHomepage("sports");
  const featured =
    import.meta.env.VITE_API_MODE === "connected"
      ? featuredPage.hero[0]
        ? homepageItem(featuredPage.hero[0])
        : undefined
      : sportsHighlights[0];
  if (connected && remote.busy && !remote.error && !remote.profileRequired)
    return <SportsSkeleton page />;
  if (connected && (remote.error || remote.busy || remote.profileRequired))
    return (
      <main className="min-h-screen px-6 py-28">
        <Text as="h1" className="font-display text-5xl">
          MGTV Sports
        </Text>
        <p role={remote.error ? "alert" : "status"} className="my-6">
          {remote.error ||
            (remote.profileRequired
              ? "Choose who is watching to browse Sports."
              : "Loading the sports archive…")}
        </p>
        {remote.error && (
          <button onClick={remote.retry} className="text-gold">
            Try again
          </button>
        )}
        {remote.profileRequired && (
          <ButtonLink to="/profiles">Choose profile</ButtonLink>
        )}
      </main>
    );
  if (!featured)
    return (
      <main className="min-h-screen px-6 py-28">
        <Text as="h1" className="font-display text-5xl">
          MGTV Sports
        </Text>
        <FeaturedStatus page={featuredPage} />
        <p className="mt-6">
          The next sporting moment belongs here. Published coverage will appear
          when available.
        </p>
        <LifecycleRails surface="sports" />
        <MovieDiscovery collection="sports" title="Explore sports" />
      </main>
    );
  return (
    <main className="min-h-screen bg-bg-base pt-16">
      <FeaturedStatus page={featuredPage} />
      <section className="sports-feature relative isolate grid overflow-hidden md:grid-cols-5">
        <div className="relative min-h-64 md:col-span-3">
          <HeroBackdrop
            poster={featured.landscapeThumbnail ?? featured.thumbnail}
            featureUrl={featured.featureUrl}
            sideGradient={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-bg-base" />
          <Text className="absolute left-6 top-6 rounded bg-bg-base/90 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-gold">
            MGTV Sports · Archive
          </Text>
        </div>
        <div className="relative flex flex-col justify-center px-6 pb-12 pt-6 md:col-span-2 md:py-20 md:pr-12">
          <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
            {featured.sportsCoverage === "highlight"
              ? "In the spotlight · Highlights"
              : "In the spotlight · Full replay"}
          </Text>
          <Text
            as="h1"
            className="mb-5 font-display text-5xl leading-none text-text-primary md:text-6xl"
          >
            {featured.title}
          </Text>
          <Text className="mb-4 text-sm text-text-secondary">
            {featured.genre} · {featured.duration}
          </Text>
          <Text className="mb-8 text-sm leading-relaxed text-text-secondary">
            {featured.description}
          </Text>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to={watchPath(featured)!}>
              {featured.sportsCoverage === "highlight"
                ? "Watch highlights"
                : "Watch replay"}
            </ButtonLink>
            <ButtonLink variant="outline" to={contentPath(featured)}>
              Explore this coverage
            </ButtonLink>
          </div>
        </div>
      </section>
      <LifecycleRails surface="sports" />
      {connected ? (
        <MovieDiscovery collection="sports" title="Explore the sports archive">
          {(items) => (
            <>
              <ContentRail
                layout="contained"
                title="The moments worth replaying"
                items={items}
              />
              <ContentRail
                layout="contained"
                title="Back to the full action"
                items={items.filter((x) => x.sportsCoverage === "replay")}
              />
              <ContentRail
                layout="contained"
                title="Track & Field"
                items={items.filter((x) => x.genre?.includes("Track & Field"))}
              />
              <ContentRail
                layout="contained"
                title="Team Sports"
                items={items.filter((x) =>
                  ["Football", "Cricket", "Basketball"].some((s) =>
                    x.genre?.includes(s),
                  ),
                )}
              />
            </>
          )}
        </MovieDiscovery>
      ) : (
        <DiscoveryResults
          items={sportsHighlights}
          scope="sports"
          title="Explore the sports archive"
        >
          <div>
            <ContentRail
              layout="contained"
              title="The moments worth replaying"
              items={filtered}
            />
            <ContentRail
              layout="contained"
              title="Track & Field"
              items={filtered.filter((item) =>
                ["Track & Field", "Athletics"].includes(item.genre!),
              )}
            />
            <ContentRail
              layout="contained"
              title="Team Sports"
              items={filtered.filter((item) =>
                ["Football", "Cricket", "Basketball"].includes(item.genre!),
              )}
            />
          </div>
        </DiscoveryResults>
      )}
    </main>
  );
}
