import { MediaCard } from './MediaCard'
import type { ContentItem } from '@/data/mockContent'

export function ContinueWatchingCard({ item }: { item: ContentItem; to?: string }) {
  return <MediaCard item={item} mode="continue" />
}
