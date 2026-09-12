import { Link } from 'react-router'
import type { ContentItem } from '@/data/mockContent'

interface MusicCardProps {
  item: ContentItem
  to?: string
}

export function MusicCard({ item, to }: MusicCardProps) {
  const inner = (
    <div className="group relative flex-shrink-0 w-40 md:w-48">
      {/* Perfect square artwork */}
      <div className="relative aspect-square overflow-hidden bg-[#1A1A1A]">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Playback state on hover */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center shadow-lg shadow-black/50">
            <svg className="w-6 h-6 text-[#0A0A0A] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Waveform decoration on hover */}
        <div className="absolute bottom-0 inset-x-0 flex items-end justify-center gap-0.5 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {[3, 5, 8, 5, 10, 7, 4, 9, 6, 3, 8, 5].map((h, i) => (
            <div
              key={i}
              className="w-0.5 bg-[#C9A84C]/70 rounded-full"
              style={{ height: `${h}px`, animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      </div>
      {/* Info */}
      <div className="mt-2.5 px-0.5">
        <p className="text-[#F5F5F5] text-sm font-semibold truncate group-hover:text-[#C9A84C] transition-colors">
          {item.title}
        </p>
        {item.artist && (
          <p className="text-[#A3A3A3] text-xs mt-0.5 truncate">{item.artist}</p>
        )}
        {!item.artist && item.genre && (
          <p className="text-[#6B6B6B] text-xs mt-0.5">{item.genre}</p>
        )}
        {item.duration && !item.duration.includes('%') && (
          <p className="text-[#4A4A4A] text-[11px] mt-0.5">{item.duration}</p>
        )}
      </div>
    </div>
  )

  if (to) {
    return <Link to={to} className="block">{inner}</Link>
  }
  return inner
}
