import { useState } from "react"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Text } from "@/components/ui/Text"
import { catalogById, contentPath } from "@/data/mockContent"
import { useAppState } from "@/context/AppStateContext"
import { useViewing } from "@/hooks/useViewing"
import { EmptyFeature } from "@/components/shared/EmptyFeature"

export function HeroSection() {
  const [active, setActive] = useState(0)
  const app = useAppState()
  const { playableItem, watchPath } = useViewing()
  const slides = app.visible(["t1", "m11", "m12"].map((id) => catalogById[id]))
  const item = slides[active] ?? slides[0]
  const displayedIndex = slides[active] ? active : 0
  if (!item) return <EmptyFeature />
  const playable = playableItem(item)
  return (
    <section className="relative flex min-h-144 w-full items-end overflow-hidden md:min-h-160">
      {slides.map((slide, i) => (
        <img
          key={slide.id}
          src={slide.thumbnail}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === displayedIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-base/95 via-bg-base/80 to-bg-base/70 md:via-bg-base/50 md:to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-12 pt-32 md:px-16 md:pb-20">
        <div className="max-w-2xl">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
            {item.badge && <Badge variant={item.badge} />}
            <Text as="span">
              {item.genre} · {item.classification}
            </Text>
            <Text as="span">{item.duration}</Text>
          </div>
          <Text className="mb-2 text-sm font-semibold uppercase tracking-widest text-gold">
            {item.type === "show" ? "Series in the spotlight" : "Featured film"}
          </Text>
          <Text
            as="h1"
            className="mb-5 font-display text-5xl leading-none tracking-wide text-text-primary md:text-7xl"
          >
            {item.title}
          </Text>
          <Text className="mb-8 max-w-lg text-base leading-relaxed text-text-secondary">
            {item.description}
          </Text>
          <div className="flex flex-wrap gap-3">
            <ButtonLink size="lg" to={watchPath(item)!}>
              {playable?.type === "episode"
                ? `${
                    (playable.progress ?? 0) > 0 &&
                    (playable.progress ?? 0) < 100
                      ? "Resume"
                      : "Watch"
                  } S${playable.seasonNumber} · E${playable.episodeNumber}`
                : "Watch movie"}
            </ButtonLink>
            <ButtonLink size="lg" variant="outline" to={contentPath(item)}>
              {item.type === "show" ? "View series" : "About this film"}
            </ButtonLink>
          </div>
        </div>
        <div className="mt-8 flex gap-2" aria-label="Featured content">
          {slides.map((slide, i) => (
            <Button
              key={slide.id}
              variant="ghost"
              size="sm"
              className={`min-h-11 ${active === i ? "text-gold" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Feature ${slide.title}`}
              aria-pressed={active === i}
            >
              {String(i + 1).padStart(2, "0")}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
