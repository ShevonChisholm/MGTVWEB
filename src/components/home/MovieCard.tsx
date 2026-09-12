import { Link } from 'react-router'
import { Badge } from '@/components/ui/Badge'
import type { ContentItem } from '@/data/mockContent'

interface MovieCardProps {
  item: ContentItem
  to?: string
}

export function MovieCard({ item, to }: MovieCardProps) {
  const inner = (
    <div className="group relative flex-shrink-0 w-36 md:w-44">
      {/* Portrait poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[#1A1A1A]">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-11 h-11 bg-[#C9A84C] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#0A0A0A] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Gold accent line on hover */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#C9A84C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        {item.badge && (
          <div className="absolute top-2 left-2"><Badge variant={item.badge} /></div>
        )}
      </div>
      {/* Compact footer */}
      <div className="mt-2.5 px-0.5">
        <p className="text-[#F5F5F5] text-sm font-semibold truncate group-hover:text-[#C9A84C] transition-colors leading-tight">
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {item.year && (
            <span className="text-[#6B6B6B] text-[11px]">{item.year}</span>
          )}
          {item.duration && !item.duration.includes('%') && (
            <span className="text-[#6B6B6B] text-[11px]">{item.duration}</span>
          )}
          {item.genre && (
            <span className="text-[#4A4A4A] text-[11px] truncate">{item.genre}</span>
          )}
        </div>
        {item.badge === 'premium' && (
          <span className="inline-block mt-1 text-[#C9A84C] text-[10px] font-bold tracking-widest uppercase">MGTV+</span>
        )}
      </div>
    </div>
  )

  if (to) {
    return <Link to={to} className="block">{inner}</Link>
  }
  return inner
}
