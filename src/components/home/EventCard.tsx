import { Link } from 'react-router'
import type { ContentItem } from '@/data/mockContent'

interface EventCardProps {
  item: ContentItem
  to?: string
}

function parseDateBlock(date?: string): { month: string; day: string } | null {
  if (!date) return null
  const parts = date.split(' ')
  if (parts.length >= 2) {
    return { month: parts[0].toUpperCase().slice(0, 3), day: parts[1].replace(',', '') }
  }
  return null
}

export function EventCard({ item, to }: EventCardProps) {
  const dateBlock = parseDateBlock(item.date)

  const inner = (
    <div className="group relative flex-shrink-0 w-64 md:w-72 bg-[#111111] overflow-hidden hover:bg-[#161616] transition-colors duration-200">
      {/* Image strip */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111111]" />
      </div>
      {/* Content block */}
      <div className="flex">
        {/* Bold structural date block */}
        {dateBlock ? (
          <div className="flex-shrink-0 w-16 bg-[#C9A84C] flex flex-col items-center justify-center py-4 px-2">
            <span className="text-[#0A0A0A] text-[9px] font-black tracking-widest uppercase leading-none">
              {dateBlock.month}
            </span>
            <span className="text-[#0A0A0A] text-3xl font-black leading-none mt-0.5" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              {dateBlock.day}
            </span>
          </div>
        ) : (
          <div className="flex-shrink-0 w-2 bg-[#C9A84C]" />
        )}
        {/* Event details */}
        <div className="flex-1 p-4 min-w-0">
          {item.genre && (
            <span className="text-[#C9A84C] text-[9px] font-bold tracking-[0.2em] uppercase">{item.genre}</span>
          )}
          <h3 className="text-[#F5F5F5] text-sm font-semibold mt-0.5 leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
            {item.title}
          </h3>
          {item.location && (
            <p className="text-[#6B6B6B] text-[11px] mt-1.5 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{item.location}</span>
            </p>
          )}
          <div className="mt-2">
            <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 text-[#4ADE80] bg-[#4ADE80]/10">
              Tickets Available
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  if (to) {
    return <Link to={to} className="block">{inner}</Link>
  }
  return inner
}
