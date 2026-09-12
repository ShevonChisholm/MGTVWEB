import { Link } from 'react-router'
import { Badge } from '@/components/ui/Badge'
import type { ContentItem } from '@/data/mockContent'

interface ContentGridProps {
  items: ContentItem[]
  linkPrefix?: string
  variant?: 'landscape' | 'portrait'
}

export function ContentGrid({ items, linkPrefix = '/shows', variant = 'landscape' }: ContentGridProps) {
  if (variant === 'portrait') {
    return (
      <div className="pb-12">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map(item => (
            <Link key={item.id} to={`${linkPrefix}/${item.id}`} className="group cursor-pointer">
              <div className="relative aspect-[2/3] overflow-hidden bg-[#1A1A1A]">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 bg-[#C9A84C] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#0A0A0A] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#C9A84C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                {item.badge && (
                  <div className="absolute top-2 left-2"><Badge variant={item.badge} /></div>
                )}
              </div>
              <div className="mt-2">
                <p className="text-[#F5F5F5] text-sm font-semibold truncate group-hover:text-[#C9A84C] transition-colors leading-tight">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.year && <span className="text-[#6B6B6B] text-[11px]">{item.year}</span>}
                  {item.genre && <span className="text-[#4A4A4A] text-[11px] truncate">{item.genre}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pb-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map(item => (
          <Link key={item.id} to={`${linkPrefix}/${item.id}`} className="group cursor-pointer">
            <div className="relative aspect-video overflow-hidden bg-[#1A1A1A]">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-4 py-2 text-xs font-bold">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Play
                </div>
              </div>
              {item.badge && (
                <div className="absolute top-2 left-2"><Badge variant={item.badge} /></div>
              )}
              {item.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-[#A3A3A3] text-[10px] px-1.5 py-0.5">
                  {item.duration}
                </div>
              )}
            </div>
            <div className="mt-2 px-0.5">
              <p className="text-[#F5F5F5] text-sm font-medium truncate group-hover:text-[#C9A84C] transition-colors">{item.title}</p>
              {item.genre && <p className="text-[#6B6B6B] text-xs mt-0.5">{item.genre}</p>}
              {item.year && <p className="text-[#6B6B6B] text-xs">{item.year}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
