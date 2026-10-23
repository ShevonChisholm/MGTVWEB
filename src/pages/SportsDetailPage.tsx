import { useParams } from "react-router"
import {
  catalogById,
  contentPath,
  sportsHighlights,
  watchPath,
} from "@/data/mockContent"
import { ContentUnavailable } from "@/components/shared/ContentUnavailable"
import { Text } from "@/components/ui/Text"
import { Button, ButtonLink } from "@/components/ui/Button"
import { ContentRail } from "@/components/home/ContentRail"
import { useSaved } from "@/context/SavedContext"

export function SportsDetailPage() {
  const { id } = useParams()
  const item = id ? catalogById[id] : undefined
  const { toggle, isSaved } = useSaved()
  if (item?.type !== "sports")
    return (
      <ContentUnavailable
        kind="Sports highlight"
        backTo="/sports"
        backLabel="Browse Sports"
      />
    )
  return (
    <main className="bg-bg-base pt-16">
      <section className="relative isolate overflow-hidden">
        <img
          src={item.thumbnail}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/60 to-transparent" />
        <div className="relative max-w-4xl px-6 py-24 md:px-16">
          <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
            Sports archive · Replay
          </Text>
          <Text
            as="h1"
            className="mb-5 font-display text-5xl text-text-primary md:text-7xl"
          >
            {item.title}
          </Text>
          <Text className="mb-4 text-sm text-text-secondary">
            {item.genre} · {item.duration}
          </Text>
          <Text className="mb-8 text-base leading-relaxed text-text-secondary">
            {item.description}
          </Text>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to={watchPath(item)!}>Watch replay</ButtonLink>
            <Button
              variant="outline"
              aria-pressed={isSaved(item.id)}
              onClick={() => toggle(item.id)}
            >
              {isSaved(item.id) ? "Saved to My List" : "Save to My List"}
            </Button>
            <ButtonLink variant="ghost" to="/sports">
              All Sports
            </ButtonLink>
          </div>
        </div>
      </section>
      <ContentRail
        title="More Sports"
        items={sportsHighlights.filter(
          (other) => contentPath(other) !== contentPath(item),
        )}
        seeAllHref="/sports"
        seeAllLabel="All sports"
      />
    </main>
  )
}
