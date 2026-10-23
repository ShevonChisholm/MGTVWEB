import { MediaCard } from './MediaCard'
import type { ContentItem } from '@/data/mockContent'

export function ContentCard({ item }: { item: ContentItem; to?: string }) {
  return <MediaCard item={item} />
}
