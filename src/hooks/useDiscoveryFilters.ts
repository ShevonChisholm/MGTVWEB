import { useEffect } from "react"
import { useSearchParams } from "react-router"
import {
  facetKeys,
  filterGroups,
  matchesFilters,
  normalizeFilters,
  type FilterGroup,
} from "@/lib/discovery"
import type { CatalogItem } from "@/data/mockContent"
export function useDiscoveryFilters(
  items: CatalogItem[],
  scope: string,
  customGroups?: FilterGroup[],
) {
  const [params, setParams] = useSearchParams()
  const groups = customGroups ?? filterGroups(items, scope)
  const selection = normalizeFilters(params, groups)
  const normalized = new URLSearchParams(params)
  for (const key of facetKeys) if (!selection[key]) normalized.delete(key)
  const normalizedString = normalized.toString()
  useEffect(() => {
    if (params.toString() !== normalizedString)
      setParams(normalizedString, { replace: true })
  }, [normalizedString, params, setParams])
  const set = (key: string, value?: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }
  const clear = () => {
    const next = new URLSearchParams(params)
    facetKeys.forEach((key) => next.delete(key))
    setParams(next)
  }
  return {
    groups,
    selection,
    set,
    clear,
    active: Object.keys(selection).length > 0,
    filtered: items.filter((item) => matchesFilters(item, selection)),
  }
}
export type DiscoveryState = ReturnType<typeof useDiscoveryFilters>
