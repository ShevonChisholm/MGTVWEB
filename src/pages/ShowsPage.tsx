import {SponsorStrip} from "@/components/shared/SponsorStrip";
import LifecycleRails from "@/components/home/LifecycleRails";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useHomepage, homepageItem } from "@/lib/homepage";
import { FeaturedStatus } from "@/components/home/FeaturedStatus";
import { HeroBackdrop } from "@/components/shared/HeroBackdrop";
import { MovieDiscovery } from "@/components/movies/MovieDiscovery";
import { ContentRail } from "@/components/home/ContentRail";
import { ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { contentPath } from "@/data/mockContent";
import { useCatalog } from "@/hooks/useCatalog";
import { useViewing } from "@/hooks/useViewing";
import { DiscoveryResults } from "@/components/shared/DiscoveryResults";
import { EmptyFeature } from "@/components/shared/EmptyFeature";

export function ShowsPage() {
  const { featuredShows, originals, continueWatching } = useCatalog();
  const { watchPath, playableItem } = useViewing();
  const filtered = featuredShows;
  const originalShows = originals.filter((item) => item.type === "show");
  const featuredPage = useHomepage("shows");
  const featured =
    import.meta.env.VITE_API_MODE === "connected"
      ? featuredPage.hero[0]
        ? homepageItem(featuredPage.hero[0])
        : undefined
      : featuredShows[0];
  const connected = import.meta.env.VITE_API_MODE === "connected";
  if (connected && featuredPage.loading && !featured)
    return (
      <main className="min-h-screen bg-bg-base pt-16">
        <FeaturedStatus page={featuredPage} />
        <div className="mx-auto max-w-[1760px] px-6 md:px-8">
          <LoadingSkeleton label="Loading the collection…" columns={3} />
        </div>
      </main>
    );
  if (!featured)
    return connected ? (
      <main className="min-h-screen pt-24">
        <h1 className="px-6 font-display text-5xl md:px-8">Shows</h1>
        <FeaturedStatus page={featuredPage} />
        <LifecycleRails surface="shows"/>
        <MovieDiscovery collection="shows" title="Discover series" />
      </main>
    ) : (
      <EmptyFeature />
    );
  return (
    <main className="min-h-screen bg-bg-base pt-16">
      <FeaturedStatus page={featuredPage} />
      <section className="hero-card">
        <HeroBackdrop
          poster={featured.landscapeThumbnail ?? featured.thumbnail}
          featureUrl={featured.featureUrl}
        />
        <div className="hero-card__content">
          <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
            Shows · Find your next great series.
          </Text>
          <Text
            as="h1"
            className="mb-5 max-w-2xl font-display text-5xl leading-none text-text-primary md:text-7xl"
          >
            {featured.title}
          </Text>
          <Text className="mb-4 text-sm text-text-secondary">
            {featured.duration} · {featured.classification} · {featured.genre}
          </Text>
          <Text className="mb-8 max-w-md text-sm leading-relaxed text-text-secondary">
            {featured.description}
          </Text>
          <div className="flex flex-wrap gap-3">
            <ButtonLink
              to={connected ? contentPath(featured) : watchPath(featured)!}
            >
              {(playableItem(featured)?.progress ?? 0) > 0 &&
              (playableItem(featured)?.progress ?? 0) < 100
                ? "Resume episode"
                : connected
                  ? "Explore episodes"
                  : "Watch episode"}
            </ButtonLink>
            <ButtonLink to={contentPath(featured)} variant="outline">
              View series
            </ButtonLink>
          </div>
          {connected&&<SponsorStrip key={featured.id} kind="shows" id={featured.id} compact context={featured.title}/>}
        </div>
      </section>
      <LifecycleRails surface="shows"/>
      <ShowsDiscovery
        connected={connected}
        items={featuredShows}
        scope="shows"
        title="Discover series"
      >
        <div>
          <ContentRail
            layout="contained"
            title="Continue Watching"
            items={continueWatching.filter((item) => item.type === "episode")}
            cardType="continueWatching"
            context={connected ? undefined : "Demo progress for this profile"}
          />
          <ContentRail
            layout="contained"
            title="Discover Series"
            items={filtered}
          />
          {!connected && (
            <>
              <ContentRail
                layout="contained"
                title="Selected Caribbean series"
                items={originalShows}
              />
            </>
          )}
          <ContentRail
            layout="contained"
            title="Drama"
            items={filtered.filter((show) => show.genre?.includes("Drama"))}
          />
          <ContentRail
            layout="contained"
            title="Documentaries & Culture"
            items={filtered.filter((show) =>
              ["Documentary", "Culture", "Travel"].includes(show.genre!),
            )}
          />
          {!filtered.length && (
            <Text className="px-6 py-10 text-text-secondary md:px-8">
              No series in this genre yet.
            </Text>
          )}
        </div>
      </ShowsDiscovery>
    </main>
  );
}

// Keep this component identity stable so parent refreshes do not close the filter drawer.
function ShowsDiscovery({ connected, children, ...props }: any) {
  return connected ? (
    <MovieDiscovery collection="shows" title="Discover series" {...props}>
      {() => children}
    </MovieDiscovery>
  ) : (
    <DiscoveryResults {...props}>{children}</DiscoveryResults>
  );
}
