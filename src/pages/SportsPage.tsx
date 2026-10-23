import { ContentRail } from "@/components/home/ContentRail"
import { contentPath, watchPath } from "@/data/mockContent"
import { ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { useCatalog } from "@/hooks/useCatalog"
import { DiscoveryResults } from "@/components/shared/DiscoveryResults"
import { EmptyFeature } from "@/components/shared/EmptyFeature"

export function SportsPage() {
  const { sportsHighlights } = useCatalog()
  const filtered = sportsHighlights
  const featured = sportsHighlights[0]
  if (!featured) return <EmptyFeature />
  return (
    <main className="min-h-screen bg-bg-base pt-16">
      <section className="relative isolate grid overflow-hidden md:grid-cols-5">
        <div className="relative min-h-64 md:col-span-3">
          <img
            src={featured.thumbnail}
            alt={featured.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-bg-base" />
          <Text className="absolute left-6 top-6 rounded bg-bg-base/90 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-gold">
            MGTV Sports · Archive
          </Text>
        </div>
        <div className="relative flex flex-col justify-center px-6 pb-12 pt-6 md:col-span-2 md:py-20 md:pr-12">
          <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
            Featured replay
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
            Highlights and sporting moments from the Caribbean. This sample
            archive is not a live broadcast.
          </Text>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to={watchPath(featured)!}>Watch replay</ButtonLink>
            <ButtonLink variant="outline" to={contentPath(featured)}>
              About this replay
            </ButtonLink>
          </div>
        </div>
      </section>
      <DiscoveryResults
        items={sportsHighlights}
        scope="sports"
        title="Explore the sports archive"
      >
        <div>
          <ContentRail
            layout="contained"
            title="Sports Highlights"
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
    </main>
  )
}
