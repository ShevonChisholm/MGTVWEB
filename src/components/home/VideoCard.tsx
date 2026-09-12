import { Link } from 'react-router'
import { Badge } from '@/components/ui/Badge'
import type { ContentItem } from '@/data/mockContent'

interface VideoCardProps {
  item: ContentItem
  to?: string
}

export function VideoCard({ item, to }: VideoCardProps) {
  const inner = (
    <>
      <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1E1E1E]">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-[#C9A84C]/80 group-hover:border-[#C9A84C] transition-all duration-300">
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-0 rounded-lg ring-0 group-hover:ring-2 ring-[#C9A84C]/60 transition-all duration-300" />
        {item.badge && (
          <div className="absolute top-2 left-2"><Badge variant={item.badge} /></div>
        )}
        {item.duration && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-[#F5F5F5] text-[10px] px-2 py-0.5 rounded font-medium">
            {item.duration}
          </div>
        )}
      </div>
      <div className="mt-2.5 px-0.5">
        <p className="text-[#F5F5F5] text-sm font-medium truncate group-hover:text-[#C9A84C] transition-colors">{item.title}</p>
        {item.artist && <p className="text-[#C9A84C] text-xs mt-0.5 font-medium">{item.artist}</p>}
        {!item.artist && item.genre && <p className="text-[#6B6B6B] text-xs mt-0.5">{item.genre}</p>}
      </div>
    </>
  )

  if (to) {
    return (
      <Link to={to} className="group relative flex-shrink-0 w-52 md:w-64 block">
        {inner}
      </Link>
    )
  }
  return <div className="group relative flex-shrink-0 w-52 md:w-64">{inner}</div>
}
