import { Link } from 'react-router'
import type { ContentItem } from '@/data/mockContent'

interface NewsCardProps {
  item: ContentItem
  to?: string
}

export function NewsCard({ item, to }: NewsCardProps) {
  const inner = (
    <div className="group relative flex-shrink-0 w-72 md:w-80 bg-[#0E0E0E] overflow-hidden">
      {/* Editorial cover frame */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-black/20 to-transparent" />
        {/* Category tag overlaid on image */}
        {item.genre && (
          <div className="absolute top-0 left-0">
            <span className="block bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1.5">
              {item.genre}
            </span>
          </div>
        )}
      </div>

      {/* Editorial text block */}
      <div className="p-4 border-t border-white/5">
        {/* Typographic headline hierarchy */}
        <h3
          className="text-[#F5F5F5] font-bold leading-tight line-clamp-3 group-hover:text-[#C9A84C] transition-colors"
          style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', letterSpacing: '0.02em' }}
        >
          {item.title}
        </h3>
        {item.description && (
          <p className="text-[#6B6B6B] text-xs mt-2 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
        {/* Publish date + read cue */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-[#4A4A4A] text-[10px] uppercase tracking-widest">
            {item.date ?? 'Caribbean News'}
          </span>
          <span className="text-[#C9A84C] text-[10px] font-semibold tracking-wide flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Read
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )

  if (to) {
    return <Link to={to} className="block">{inner}</Link>
  }
  return inner
}
