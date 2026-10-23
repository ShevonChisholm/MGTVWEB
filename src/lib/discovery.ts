import {
  allEventDetails,
  broadcasts,
  contentLabels,
  type CatalogItem,
} from "../data/mockContent"
import { getEventPresentation } from "./eventPresentation"
export interface FilterGroup {
  id: string
  label: string
  options: {
    value: string
    label: string
  }[]
}
export type FilterSelection = Record<string, string | undefined>
export const facetKeys = [
  "genre",
  "region",
  "classification",
  "access",
  "year",
  "artist",
  "album",
  "competition",
  "team",
  "athlete",
  "status",
  "date",
  "venue",
  "ticket",
  "type",
  "format",
  "owner",
]
export function valuesFor(item: CatalogItem, key: string): string[] {
  const event = allEventDetails[item.id]
  switch (key) {
    case "genre":
      return item.genre?.split(" · ") ?? []
    case "region":
      return item.region ? [item.region] : []
    case "classification":
      return [item.classification ?? "Unrated"]
    case "access":
      return [item.access ?? "free"]
    case "year":
      return item.year ? [String(item.year)] : []
    case "artist":
      return item.artist ? [item.artist] : []
    case "album":
      return item.album ? [item.album] : []
    case "competition":
      return item.competition ? [item.competition] : []
    case "team":
      return item.teams ?? []
    case "athlete":
      return item.athletes ?? []
    case "type":
      return [contentLabels[item.type]]
    case "status":
      return event
        ? [
            getEventPresentation(event, broadcasts[event.broadcastId ?? ""])
              .label,
            ...(!event.broadcastId ? ["No livestream"] : []),
          ]
        : [item.state ?? "Replay"]
    case "venue":
      return event
        ? [
            { inPerson: "In person", online: "Online", hybrid: "Hybrid" }[
              event.locationKind
            ],
          ]
        : []
    case "ticket":
      return item.ticketTier ? [item.ticketTier] : []
    case "date": {
      if (!event) return []
      const days = Math.floor(
        (Date.parse(event.startsAt) - Date.parse("2026-09-10T00:00:00Z")) /
          86400000,
      )
      return days === 0
        ? ["Today", "Next 7 days"]
        : days > 0 && days < 7
          ? ["Next 7 days"]
          : days >= 7
            ? ["Later"]
            : []
    }
    default:
      return []
  }
}
const schemas: Record<string, [string, string][]> = {
  shows: [
    ["genre", "Genre"],
    ["region", "Region"],
    ["classification", "Classification"],
    ["access", "Access"],
  ],
  movies: [
    ["genre", "Genre"],
    ["region", "Region"],
    ["year", "Release year"],
    ["classification", "Classification"],
    ["access", "Access"],
  ],
  videos: [
    ["genre", "Genre"],
    ["artist", "Artist"],
    ["album", "Album"],
    ["region", "Region"],
  ],
  tracks: [
    ["genre", "Genre"],
    ["artist", "Artist"],
    ["album", "Album"],
    ["region", "Region"],
  ],
  artists: [
    ["genre", "Genre"],
    ["region", "Region"],
  ],
  sports: [
    ["genre", "Sport"],
    ["competition", "Competition"],
    ["team", "Team"],
    ["athlete", "Athlete"],
    ["status", "Match status"],
  ],
  events: [
    ["date", "Date · Fixed demo day"],
    ["region", "Location"],
    ["venue", "Venue style"],
    ["ticket", "Ticket tier"],
    ["status", "Event / Broadcast state"],
  ],
  news: [
    ["genre", "Category"],
    ["region", "Region"],
  ],
  lifestyle: [
    ["genre", "Category"],
    ["region", "Region"],
  ],
  search: [
    ["type", "Content type"],
    ["genre", "Genre / Category"],
    ["region", "Region"],
    ["access", "Access"],
  ],
  "my-list": [["type", "Content type"]],
}
export function filterGroups(
  items: CatalogItem[],
  scope: string,
): FilterGroup[] {
  return (schemas[scope] ?? []).map(([id, label]) => {
    const values = [...new Set(items.flatMap((item) => valuesFor(item, id)))]
    if (scope === "sports" && id === "status") values.push("Live", "Upcoming")
    if (scope === "events" && id === "date")
      values.push("Today", "Next 7 days", "Later")
    if (scope === "events" && id === "venue")
      values.push("In person", "Online", "Hybrid")
    return {
      id,
      label,
      options: [...new Set(values)].sort().map((value) => ({
        value,
        label: id === "status" && value === "Live" ? "Live demo" : value,
      })),
    }
  })
}
export function normalizeFilters(
  params: URLSearchParams,
  groups: FilterGroup[],
): FilterSelection {
  return Object.fromEntries(
    groups.flatMap((group) => {
      const value = params.get(group.id)
      return value && group.options.some((o) => o.value === value)
        ? [[group.id, value]]
        : []
    }),
  )
}
export function matchesFilters(
  item: CatalogItem,
  selection: FilterSelection,
): boolean {
  return Object.entries(selection).every(
    ([key, value]) => !value || valuesFor(item, key).includes(value),
  )
}
