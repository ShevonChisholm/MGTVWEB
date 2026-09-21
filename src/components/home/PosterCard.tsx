import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Badge } from '@/components/ui/Badge'
import type { ContentItem } from '@/data/mockContent'

interface PosterCardProps {
  item: ContentItem
  to?: string
  detailTo?: string
  type?: 'portrait' | 'landscape'
}

export function PosterCard({ item, to, detailTo, type = 'portrait' }: PosterCardProps) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const matchPct =
    ((item.id.charCodeAt(0) + item.id.charCodeAt(item.id.length - 1)) % 20) + 80
  const rating = item.badge === 'premium' ? '18+' : '13+'
  const genres = item.genre?.split(',').map(g => g.trim()).slice(0, 2) ?? []
  const isLandscape = type === 'landscape'
  const cardW = isLandscape ? 240 : 160
  const cardH = isLandscape ? 135 : 240

  return (
    <div
      className="flex-shrink-0 transition-all duration-300 ease-out"
      style={{ width: cardW, zIndex: hovered ? 20 : 1, position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div
        className="w-full overflow-hidden bg-[#1A1A1A] rounded-xl relative transition-transform duration-300 ease-out"
        style={{
          height: cardH,
          transform: hovered ? 'scale(1.06) translateY(-4px)' : 'scale(1)',
          transformOrigin: 'center top',
          boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.8)' : 'none',
        }}
      >
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {/* Hover dim */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: 'rgba(0,0,0,0.3)', opacity: hovered ? 1 : 0 }}
        />
        {/* Badge */}
        {item.badge && (
          <div className="absolute top-2.5 left-2.5">
            <Badge variant={item.badge} />
          </div>
        )}
        {/* Duration pill */}
        {item.duration && !item.duration.includes('%') && (
          <div className="absolute bottom-2.5 right-2.5 bg-black/70 text-[#F5F5F5] text-[10px] font-medium px-1.5 py-0.5 rounded">
            {item.duration}
          </div>
        )}
        {/* Progress bar */}
        {item.duration?.includes('%') && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 rounded-b-xl overflow-hidden">
            <div className="h-full bg-[#C9A84C]" style={{ width: item.duration }} />
          </div>
        )}
        {/* Play hint on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Metadata shelf — expands in flow below thumbnail, scaled to match thumbnail */}
      <div
        className="overflow-hidden rounded-b-xl transition-all duration-300 ease-out"
        style={{
          maxHeight: hovered ? '160px' : '0px',
          opacity: hovered ? 1 : 0,
          background: '#181818',
          border: hovered ? '1px solid rgba(255,255,255,0.08)' : 'none',
          borderTop: 'none',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transformOrigin: 'center top',
          boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.7)' : 'none',
          marginTop: hovered ? '-2px' : '0',
        }}
      >
        <div className="px-3 pt-2.5 pb-3">
          {/* Controls */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <button
              onClick={() => to && navigate(to)}
              className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-white transition-colors cursor-pointer flex-shrink-0"
            >
              <svg className="w-4 h-4 text-[#0A0A0A] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <button
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:border-white/60 transition-colors cursor-pointer flex-shrink-0"
              title="Add to list"
            >
              <svg className="w-4 h-4 text-[#F5F5F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:border-[#C9A84C]/60 transition-colors cursor-pointer flex-shrink-0"
              title="Like"
            >
              <svg className="w-3.5 h-3.5 text-[#F5F5F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.993-1.85l-.5-8A2 2 0 0110.75 11H14V4a2 2 0 012-2h.5a1.5 1.5 0 011.5 1.5V10z" />
              </svg>
            </button>
            <button
              onClick={() => detailTo && navigate(detailTo)}
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:border-white/60 transition-colors cursor-pointer flex-shrink-0 ml-auto"
              title="More info"
            >
              <svg className="w-3.5 h-3.5 text-[#F5F5F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {/* Match + rating */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[#46D369] text-xs font-bold">{matchPct}% Match</span>
            <span className="border border-white/30 text-[#A3A3A3] text-[10px] px-1 py-px rounded">{rating}</span>
            {item.year && <span className="text-[#A3A3A3] text-[10px]">{item.year}</span>}
          </div>
          {genres.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {genres.map((g, i) => (
                <span key={i} className="text-[#A3A3A3] text-[10px]">
                  {g}{i < genres.length - 1 && <span className="text-[#4A4A4A] mx-1">·</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
