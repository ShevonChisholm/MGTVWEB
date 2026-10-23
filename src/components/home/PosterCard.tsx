import { MediaCard } from './MediaCard'
import type { ContentItem } from '@/data/mockContent'

// Legacy route props remain accepted; the catalog, not presentation, resolves destinations.
export function PosterCard({ item, type }: { item: ContentItem; to?: string; detailTo?: string; type?: 'portrait' | 'landscape' }) {
  return <MediaCard item={item} mode={type === 'landscape' ? 'continue' : 'standard'} />
}
