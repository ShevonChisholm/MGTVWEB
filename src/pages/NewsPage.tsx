import { Link } from "react-router"
import { MediaCard } from "@/components/home/MediaCard"
import { Text } from "@/components/ui/Text"
import { useCatalog } from "@/hooks/useCatalog"
import { DiscoveryResults } from "@/components/shared/DiscoveryResults"
import { EmptyFeature } from "@/components/shared/EmptyFeature"

export function NewsPage() {
  const { latestNews } = useCatalog()
  const [featured, ...rest] = latestNews
  if (!featured) return <EmptyFeature />

  return (
    <main className="min-h-screen bg-bg-base pt-16">
      <section className="border-b border-gold/20 bg-bg-surface">
        <div className="mx-auto max-w-7xl px-6 md:px-16">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-text-muted/20 py-5">
            <Text className="font-display text-2xl tracking-widest text-text-primary">
              The Current
            </Text>
            <Text className="text-sm text-text-secondary">
              Sample edition · September 2026
            </Text>
            <Text className="text-xs font-semibold uppercase tracking-widest text-gold">
              Caribbean perspectives
            </Text>
          </div>
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center py-10 md:py-14 lg:pr-10">
              <Text className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold">
                Featured · {featured.genre}
              </Text>
              <Text
                as="h1"
                className="mb-5 font-display text-4xl leading-tight text-text-primary md:text-6xl"
              >
                {featured.title}
              </Text>
              <Text className="mb-5 text-sm text-text-secondary">
                Sample date · {featured.date} · {featured.readTime}
              </Text>
              <Text className="mb-6 max-w-md text-base leading-relaxed text-text-secondary">
                {featured.description}
              </Text>
              <Link
                to={`/news/${featured.id}`}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-gold hover:text-gold-light"
              >
                Read story
              </Link>
              <div className="mt-6 space-y-3 border-t border-text-muted/20 pt-5">
                {rest.slice(0, 2).map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.id}`}
                    className="block text-sm leading-relaxed text-text-secondary hover:text-gold"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative hidden overflow-hidden lg:block">
              <img
                src={featured.thumbnail}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-bg-surface/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>
      <DiscoveryResults
        items={latestNews}
        scope="news"
        title="Stories in the sample edition"
      >
        <Link
          to={`/news/${featured.id}`}
          className="group mb-10 grid overflow-hidden rounded-xl bg-bg-surface md:grid-cols-5"
        >
          <div className="relative aspect-video overflow-hidden md:col-span-3">
            <img
              src={featured.thumbnail}
              alt=""
              className="h-full w-full object-cover transition-transform motion-safe:group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center p-6 md:col-span-2">
            <Text className="mb-3 text-sm font-semibold text-gold">
              Sample editorial copy
            </Text>
            <Text
              as="h2"
              className="font-display text-2xl leading-tight text-text-primary group-hover:text-gold"
            >
              {featured.title}
            </Text>
            <Text className="mt-4 text-sm leading-relaxed text-text-secondary">
              {featured.description}
            </Text>
            <Text className="mt-6 text-sm font-semibold text-gold">
              Read story
            </Text>
          </div>
        </Link>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {rest.map((item) => (
            <MediaCard key={item.id} item={item} fluid />
          ))}
        </div>
      </DiscoveryResults>
    </main>
  )
}
