import { ContentRail } from "@/components/home/ContentRail"
import { ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { contentPath } from "@/data/mockContent"
import { useCatalog } from "@/hooks/useCatalog"
import { useViewing } from "@/hooks/useViewing"
import { DiscoveryResults } from "@/components/shared/DiscoveryResults"
import { EmptyFeature } from "@/components/shared/EmptyFeature"

export function MoviesPage() {
  const { popularMovies, originals, continueWatching } = useCatalog()
  const { watchPath } = useViewing()
  const filtered = popularMovies
  const originalMovies = originals.filter((item) => item.type === "movie")
  const featured = popularMovies[0]
  if (!featured) return <EmptyFeature />
  return (
    <main className="min-h-screen bg-bg-base pt-16">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-y-0 right-0 flex w-full items-center justify-end gap-3 overflow-hidden pr-6 opacity-40 md:w-3/5 md:opacity-80">
          {popularMovies.slice(0, 5).map((movie, i) => (
            <div
              key={movie.id}
              className={`shrink-0 overflow-hidden rounded-xl ${
                i === 2 ? "w-44 -rotate-2" : "w-32 translate-y-8 rotate-3"
              }`}
            >
              <img
                src={movie.thumbnail}
                alt=""
                className="aspect-[2/3] w-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-bg-base via-bg-base/90 to-bg-base/70 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-16 md:py-20">
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
            <Text className="px-6 py-10 text-text-secondary md:px-16">
              No films in this genre yet.
            </Text>
          )}
        </div>
      </DiscoveryResults>
    </main>
  )
}
