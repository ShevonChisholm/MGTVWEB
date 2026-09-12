import { Link } from 'react-router'
import { Badge } from '@/components/ui/Badge'
import type { ContentItem } from '@/data/mockContent'

interface ContentCardProps {
  item: ContentItem
  to?: string
}

export function ContentCard({ item, to }: ContentCardProps) {
  const inner = (
    <>
      <div className="relative aspect-video overflow-hidden bg-[#1A1A1A]">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
        {/* Square play + explore overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-4 py-2 text-xs font-bold">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            Play
          </div>
        </div>
        {/* Gold accent bottom bar on hover */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#C9A84C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        {item.badge && (
          <div className="absolute top-2 left-2"><Badge variant={item.badge} /></div>
        )}
        {item.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-[#A3A3A3] text-[10px] px-1.5 py-0.5">
            {item.duration}
          </div>
        )}
      </div>
      <div className="mt-2.5 px-0.5">
        <p className="text-[#F5F5F5] text-sm font-semibold truncate group-hover:text-[#C9A84C] transition-colors">
          {item.title}
        </p>
        {item.genre && <p className="text-[#6B6B6B] text-xs mt-0.5">{item.genre}</p>}
      </div>
    </>
  )

  if (to) {
    return (
      <Link to={to} className="group relative flex-shrink-0 w-52 md:w-60 block">
        {inner}
      </Link>
    )
  }
  return <div className="group relative flex-shrink-0 w-52 md:w-60">{inner}</div>
}
