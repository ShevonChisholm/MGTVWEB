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

export function MoviesPage() {
  const { popularMovies, originals, continueWatching } = useCatalog();
  const { watchPath } = useViewing();
  const connected = import.meta.env.VITE_API_MODE === "connected";
  const filtered = popularMovies;
  const originalMovies = originals.filter((item) => item.type === "movie");
  const featuredPage = useHomepage("movies");
  const featured =
    import.meta.env.VITE_API_MODE === "connected"
      ? featuredPage.hero[0]
        ? homepageItem(featuredPage.hero[0])
        : undefined
      : (popularMovies.find((m) => m.featureUrl) ?? popularMovies[0]);
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
      <main className="min-h-screen bg-bg-base pt-24">
        <Text
          as="h1"
          className="mx-auto max-w-[1760px] px-6 font-display text-5xl md:px-8"
        >
          Movies
        </Text>
        <FeaturedStatus page={featuredPage} />
        <LifecycleRails surface="movies"/>
        <MovieDiscovery />
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
            Caribbean cinema · Featured film
          </Text>
          <Text
            as="h1"
            className="mb-5 max-w-2xl font-display text-5xl leading-none text-text-primary md:text-7xl"
          >
            {featured.title}
          </Text>
          <Text className="mb-4 text-sm text-text-secondary">
            {featured.year} · {featured.duration} · {featured.classification} ·{" "}
            {featured.genre}
          </Text>
          <Text className="mb-8 max-w-md text-sm leading-relaxed text-text-secondary">
            {featured.description}
          </Text>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to={watchPath(featured)!}>Watch movie</ButtonLink>
            <ButtonLink to={contentPath(featured)} variant="outline">
              About this film
            </ButtonLink>
          </div>
        </div>
      </section>
      <LifecycleRails surface="movies"/>
      {connected ? (
        <MovieDiscovery>
          {(items) => (
            <div>
              <ContentRail
                layout="contained"
                title="Continue Watching"
                cardType="continueWatching"
                items={continueWatching.filter((item) => item.type === "movie")}
              />
              <ContentRail
                layout="contained"
                title="Discover Movies"
                items={items}
              />
              <ContentRail
                layout="contained"
                title="Free to watch"
                items={items.filter((item) => item.badge === "free")}
              />
              <ContentRail
                layout="contained"
                title="Premium films"
                items={items.filter((item) => item.badge === "premium")}
              />
              <ContentRail
                layout="contained"
                title="Documentary Features"
                items={items.filter((item) =>
                  item.genre?.includes("Documentary"),
                )}
              />
            </div>
          )}
        </MovieDiscovery>
      ) : (
        <DiscoveryResults
          items={popularMovies}
          scope="movies"
          title="Discover movies"
        >
          <div>
            <ContentRail
              layout="contained"
              title="Continue Watching"
              items={continueWatching.filter((item) => item.type === "movie")}
              cardType="continueWatching"
              context="Demo progress for this profile"
            />
            <ContentRail
              layout="contained"
              title="Discover Movies"
              items={filtered}
            />
            <ContentRail
              layout="contained"
              title="From the sample film collection"
              items={filtered.filter((movie) => movie.year! >= 2025)}
            />
            <ContentRail
              layout="contained"
              title="Selected Caribbean films"
              items={originalMovies}
            />
            <ContentRail
              layout="contained"
              title="Documentary Features"
              items={filtered.filter((movie) =>
                movie.genre?.includes("Documentary"),
              )}
            />
            {!filtered.length && (
              <Text className="px-6 py-10 text-text-secondary md:px-8">
                No films in this genre yet.
              </Text>
            )}
          </div>
        </DiscoveryResults>
      )}
    </main>
  );
}
