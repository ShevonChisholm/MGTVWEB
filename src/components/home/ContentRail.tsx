import { useId, useRef } from "react"
import { Link } from "react-router"
import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { MediaCard } from "./MediaCard"
import type { ContentItem } from "@/data/mockContent"
import { useViewing } from "@/hooks/useViewing"

interface ContentRailProps {
  title: string
  items: ContentItem[]
  cardType?: "default" | "video" | "artist" | "news" | "event" | "movie" | "music" | "continueWatching"
  seeAllHref?: string
  seeAllLabel?: string
  layout?: "page" | "contained"
  goldBorder?: boolean
  linkPrefix?: string
  context?: string
}

export function ContentRail({
  title,
  items,
  cardType,
  seeAllHref,
  seeAllLabel,
  layout = "page",
  goldBorder,
  context,
}: ContentRailProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const headingId = useId()
  const shell = layout === "page" ? "mx-auto max-w-[1760px] px-6 md:px-8" : ""
  const { visibleItems } = useViewing()
  items = visibleItems(items)
  if (!items.length) return null
  const scroll = (direction: number) =>
    railRef.current?.scrollBy({
      left: direction * railRef.current.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    })
  return (
    <section
      aria-labelledby={headingId}
      className={`py-6 ${goldBorder ? "border-t border-gold/20" : ""}`}
    >
      <div
        className={`mb-4 flex flex-wrap items-end justify-between gap-3 ${shell}`}
      >
        <div className="min-w-0">
          {context && (
            <Text className="mb-1 text-sm text-text-secondary">{context}</Text>
          )}
          <Text
            as="h2"
            id={headingId}
            className="font-display text-2xl leading-tight tracking-wide text-text-primary md:text-3xl"
          >
            {title}
          </Text>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {seeAllHref && seeAllLabel && (
            <Link
              to={seeAllHref}
              className="mr-2 inline-flex min-h-11 items-center text-sm font-semibold text-gold"
            >
              {seeAllLabel}
            </Link>
          )}
          {[-1, 1].map((direction) => (
            <Button
              key={direction}
              variant="ghost"
              size="sm"
              className="min-h-11 min-w-11 px-2"
              onClick={() => scroll(direction)}
              aria-label={`Scroll ${title} ${direction < 0 ? "left" : "right"}`}
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  d={direction < 0 ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
                />
              </svg>
            </Button>
          ))}
        </div>
      </div>
      <div
        ref={railRef}
        role="region"
        aria-label={`${title} content`}
        tabIndex={0}
        className={`flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide pb-3 pt-2 ${shell} ${
          layout === "page" ? "scroll-px-6 md:scroll-px-8" : "pl-1"
        }`}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="relative flex shrink-0 snap-start flex-col"
          >
            <MediaCard
              item={item}
              mode={cardType === "continueWatching" ? "continue" : "standard"}
              trackIds={items
                .filter((entry) => entry.type === "track")
                .map((entry) => entry.id)}
              trackOrigin={title}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
