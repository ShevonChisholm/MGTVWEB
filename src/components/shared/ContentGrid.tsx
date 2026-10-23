import { MediaCard } from '@/components/home/MediaCard'
import type { ContentItem } from '@/data/mockContent'

export function ContentGrid({ items }: { items: ContentItem[]; linkPrefix?: string; variant?: 'landscape' | 'portrait' }) {
  return (
    <div className="grid gap-x-5 gap-y-8 pb-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map(item => <MediaCard key={item.id} item={item} fluid />)}
    </div>
  )
}
