import { Link } from 'react-router'
import type { ContentItem } from '@/data/mockContent'

interface ArtistCardProps {
  item: ContentItem
  to?: string
}

export function ArtistCard({ item, to }: ArtistCardProps) {
  const inner = (
    <>
      <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden bg-[#1E1E1E] ring-2 ring-transparent group-hover:ring-[#C9A84C] transition-all duration-300">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-full" />
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, transparent 60%)' }}
        />
      </div>
      <div className="mt-3">
        <p className="text-[#F5F5F5] text-sm font-semibold group-hover:text-[#C9A84C] transition-colors">{item.title}</p>
        {item.genre && <p className="text-[#6B6B6B] text-xs mt-0.5">{item.genre}</p>}
        {item.description && <p className="text-[#C9A84C]/70 text-xs mt-0.5">{item.description}</p>}
      </div>
    </>
  )

  if (to) {
    return (
      <Link to={to} className="group flex-shrink-0 w-36 md:w-44 block text-center">
        {inner}
      </Link>
    )
  }
  return <div className="group flex-shrink-0 w-36 md:w-44 text-center">{inner}</div>
}
