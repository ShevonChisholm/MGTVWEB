import type { ReactNode } from "react"
import type { CatalogItem } from "@/data/mockContent"
import {
  useDiscoveryFilters,
  type DiscoveryState,
} from "@/hooks/useDiscoveryFilters"
import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { MediaCard } from "@/components/home/MediaCard"
import { FilterSidebar } from "./FilterSidebar"
export function ActiveFilters({
  discovery,
  count,
}: {
  discovery: DiscoveryState
  count: number
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {Object.entries(discovery.selection).map(([key, value]) => {
          const group = discovery.groups.find((g) => g.id === key)
          const label =
            group?.options.find((o) => o.value === value)?.label ?? value
          return (
            <Button
              key={key}
              size="sm"
              variant="outline"
              className="max-w-full whitespace-normal break-words text-left"
              onClick={() => discovery.set(key)}
              aria-label={`Remove ${group?.label}: ${label}`}
            >
              {group?.label}: {label}
              <Text as="span" aria-hidden="true">
                ×
              </Text>
            </Button>
          )
        })}
        {discovery.active && (
          <Button variant="ghost" size="sm" onClick={discovery.clear}>
            Clear all
          </Button>
        )}
      </div>
      <Text
        role="status"
        aria-live="polite"
        className="mt-4 text-xs text-text-secondary"
      >
        {count} {count === 1 ? "result" : "results"}
        {discovery.active
          ? " matching all selected filters"
          : " available for this profile"}
      </Text>
    </div>
  )
}
export function DiscoveryEmpty({
  clear,
  active = true,
}: {
  clear: () => void
  active?: boolean
}) {
  return (
    <div className="space-y-4 rounded-xl bg-bg-surface p-8">
      <Text as="h2" className="font-display text-3xl">
        {active
          ? "No results match these filters"
          : "No items available in this view"}
      </Text>
      <Text className="text-sm text-text-secondary">
        {active
          ? "Try removing a selection. No unrelated items have been substituted."
          : "No matching sample items are available for this profile or search. Try another search or explore another section."}
      </Text>
      {active && (
        <Button variant="outline" onClick={clear}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
export function DiscoveryResults({
  items,
  scope,
  title,
  children,
  layout = "page",
}: {
  items: CatalogItem[]
  scope: string
  title: string
  children?: ReactNode
  layout?: "page" | "contained"
}) {
  const discovery = useDiscoveryFilters(items, scope)
  return (
    <section
      className={`py-10 ${
        layout === "page" ? "mx-auto max-w-[1760px] px-6 md:px-8" : ""
      }`}
    >
      <Text as="h2" className="mb-8 font-display text-3xl">
        {title}
      </Text>
      <div className="flex min-w-0 flex-col gap-5">
        <FilterSidebar discovery={discovery} />
        <div className="min-w-0 flex-1">
          <ActiveFilters
            discovery={discovery}
            count={discovery.filtered.length}
          />
          {!discovery.filtered.length ? (
            <DiscoveryEmpty clear={discovery.clear} active={discovery.active} />
          ) : children && !discovery.active ? (
            children
          ) : (
            <div className="grid items-start gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {discovery.filtered.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  fluid
                  trackIds={discovery.filtered
                    .filter((i) => i.type === "track")
                    .map((i) => i.id)}
                  trackOrigin={`Filtered ${title}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
