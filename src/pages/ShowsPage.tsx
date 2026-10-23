import { ContentRail } from "@/components/home/ContentRail"
import { ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { contentPath } from "@/data/mockContent"
import { useCatalog } from "@/hooks/useCatalog"
import { useViewing } from "@/hooks/useViewing"
import { DiscoveryResults } from "@/components/shared/DiscoveryResults"
import { EmptyFeature } from "@/components/shared/EmptyFeature"

export function ShowsPage() {
  const { featuredShows, originals, continueWatching } = useCatalog()
  const { watchPath, playableItem } = useViewing()
  const filtered = featuredShows
  const originalShows = originals.filter((item) => item.type === "show")
  const featured = featuredShows[0]
  if (!featured) return <EmptyFeature />
  return (
    <main className="min-h-screen bg-bg-base pt-16">
      <section className="relative isolate overflow-hidden bg-bg-base">
        <div className="absolute inset-y-0 right-0 grid w-full grid-cols-3 gap-1 opacity-40 md:w-3/5">
          {featuredShows.slice(0, 6).map((show, i) => (
            <div
              key={show.id}
              className={`overflow-hidden rounded-lg ${
                i === 1 ? "row-span-2" : ""
              }`}
            >
              <img
                src={show.thumbnail}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-bg-base via-bg-base/90 to-bg-base/70 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-16 md:py-20">
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
            <ButtonLink to={watchPath(featured)!}>
              {(playableItem(featured)?.progress ?? 0) > 0 &&
              (playableItem(featured)?.progress ?? 0) < 100
                ? "Resume episode"
                : "Watch episode"}
            </ButtonLink>
            <ButtonLink to={contentPath(featured)} variant="outline">
              View series
            </ButtonLink>
          </div>
        </div>
      </section>
      <DiscoveryResults
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
            context="Demo progress for this profile"
          />
          <ContentRail
            layout="contained"
            title="Discover Series"
            items={filtered}
          />
          <ContentRail
            layout="contained"
            title="Selected Caribbean series"
            items={originalShows}
          />
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
            <Text className="px-6 py-10 text-text-secondary md:px-16">
              No series in this genre yet.
            </Text>
          )}
        </div>
      </DiscoveryResults>
    </main>
  )
}
