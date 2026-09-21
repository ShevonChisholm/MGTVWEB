import { useState } from 'react'
import { Link } from 'react-router'
import type { ContentItem } from '@/data/mockContent'

interface MusicCardProps {
  item: ContentItem
  to?: string
}

export function MusicCard({ item, to }: MusicCardProps) {
  const [playing, setPlaying] = useState(false)

  const inner = (
    <div className="group flex-shrink-0 w-44 md:w-52 cursor-pointer">
      {/* Rounded square artwork */}
      <div className="relative aspect-square overflow-hidden bg-[#1A1A1A] rounded-xl mb-3">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Duration badge */}
        {item.duration && !item.duration.includes('%') && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-[#F5F5F5] text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            {item.duration}
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-xl" />
        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={e => { e.preventDefault(); setPlaying(v => !v) }}
            className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center shadow-xl shadow-black/60 hover:scale-105 transition-transform cursor-pointer"
          >
            {playing ? (
              <svg className="w-5 h-5 text-[#0A0A0A]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-[#0A0A0A] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Info row — YouTube card style */}
      <div className="flex gap-2.5 px-0.5">
        {/* Artist avatar */}
        <div className="w-8 h-8 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex-shrink-0 overflow-hidden mt-0.5">
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#C9A84C] text-xs font-bold">
              {(item.artist ?? item.title).charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        {/* Text info */}
        <div className="min-w-0 flex-1">
          <p className="text-[#F5F5F5] text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
            {item.title}
          </p>
          {item.artist && (
            <p className="text-[#A3A3A3] text-xs mt-0.5 truncate flex items-center gap-1">
              {item.artist}
              <svg className="w-3 h-3 text-[#6B6B6B] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </p>
          )}
          {item.genre && (
            <p className="text-[#6B6B6B] text-[11px] mt-0.5">{item.genre}</p>
          )}
        </div>
      </div>
    </div>
  )

  if (to) {
    return <Link to={to} className="block">{inner}</Link>
  }
  return inner
}
