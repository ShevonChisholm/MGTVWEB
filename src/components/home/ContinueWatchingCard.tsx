import { Link } from 'react-router'
import type { ContentItem } from '@/data/mockContent'

interface ContinueWatchingCardProps {
  item: ContentItem
  to?: string
}

function parseProgress(duration?: string): number {
  if (!duration) return 0
  const match = duration.match(/(\d+)%/)
  return match ? parseInt(match[1], 10) : 0
}

function getRemainingText(progress: number): string {
  const totalMinutes = 90
  const remaining = Math.round(totalMinutes * (1 - progress / 100))
  return `${remaining} min remaining`
}

export function ContinueWatchingCard({ item, to }: ContinueWatchingCardProps) {
  const progress = parseProgress(item.duration)
  const remaining = getRemainingText(progress)

  const inner = (
    <div className="group relative flex-shrink-0 w-56 md:w-72">
      {/* Landscape image */}
      <div className="relative aspect-video overflow-hidden bg-[#1A1A1A]">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Hover dim */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
        {/* Resume icon — subtle, centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] transition-all duration-300">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Remaining text */}
        <div className="absolute bottom-8 right-3">
          <span className="text-[#A3A3A3] text-[10px] bg-black/70 px-2 py-0.5 rounded">{remaining}</span>
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10">
          <div
            className="h-full bg-[#C9A84C] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {/* Info */}
      <div className="mt-2 px-0.5">
        <p className="text-[#F5F5F5] text-sm font-medium truncate group-hover:text-[#C9A84C] transition-colors">
          {item.title}
        </p>
        {item.genre && (
          <p className="text-[#6B6B6B] text-xs mt-0.5">{item.genre}</p>
        )}
      </div>
    </div>
  )

  if (to) {
    return <Link to={to} className="block">{inner}</Link>
  }
  return inner
}
