import { useRef, useState } from 'react'
import { SectionHeading } from './SectionHeading'
import { ContentCard } from './ContentCard'
import { VideoCard } from './VideoCard'
import { ArtistCard } from './ArtistCard'
import { NewsCard } from './NewsCard'
import { EventCard } from './EventCard'
import { MovieCard } from './MovieCard'
import { MusicCard } from './MusicCard'
import { ContinueWatchingCard } from './ContinueWatchingCard'
import type { ContentItem } from '@/data/mockContent'

type CardType = 'default' | 'video' | 'artist' | 'news' | 'event' | 'movie' | 'music' | 'continueWatching'

const defaultLinkPrefix: Record<CardType, string> = {
  default: '/shows',
  video: '/sports',
  artist: '/music/artist',
  news: '/news',
  event: '/events',
  movie: '/movies',
  music: '/music/video',
  continueWatching: '/watch',
}

interface ContentRailProps {
  title: string
  items: ContentItem[]
  cardType?: CardType
  seeAllHref?: string
  goldBorder?: boolean
  linkPrefix?: string
  context?: string
  ranked?: boolean
}

export function ContentRail({
  title,
  items,
  cardType = 'default',
  seeAllHref,
  goldBorder = false,
  linkPrefix,
  context,
  ranked = false,
}: ContentRailProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const resolvedLinkPrefix = linkPrefix ?? defaultLinkPrefix[cardType]
  const resolvedSeeAll = seeAllHref ?? defaultLinkPrefix[cardType]

  const scroll = (dir: 'left' | 'right') => {
    if (!railRef.current) return
    railRef.current.scrollBy({ left: dir === 'right' ? 480 : -480, behavior: 'smooth' })
  }

  const onScroll = () => {
    if (!railRef.current) return
    setCanScrollLeft(railRef.current.scrollLeft > 0)
    setCanScrollRight(railRef.current.scrollLeft + railRef.current.clientWidth < railRef.current.scrollWidth - 10)
  }

  const renderCard = (item: ContentItem, index: number) => {
    const to = cardType === 'artist'
      ? `/music/artist/${item.id}`
      : `${resolvedLinkPrefix}/${item.id}`

    const card = (() => {
      switch (cardType) {
        case 'movie': return <MovieCard key={item.id} item={item} to={to} />
        case 'music': return <MusicCard key={item.id} item={item} to={to} />
        case 'continueWatching': return <ContinueWatchingCard key={item.id} item={item} to={to} />
        case 'video': return <VideoCard key={item.id} item={item} to={to} />
        case 'artist': return <ArtistCard key={item.id} item={item} to={`/music/artist/${item.id}`} />
        case 'news': return <NewsCard key={item.id} item={item} to={to} />
        case 'event': return <EventCard key={item.id} item={item} to={to} />
        default: return <ContentCard key={item.id} item={item} to={to} />
      }
    })()

    if (ranked) {
      return (
        <div key={item.id} className="relative flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
          <div
            className="absolute -left-2 bottom-10 z-10 select-none pointer-events-none"
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '4.5rem',
              lineHeight: 1,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(201,168,76,0.30)',
              letterSpacing: '-0.02em',
            }}
          >
            {index + 1}
          </div>
          <div className="pl-6">{card}</div>
        </div>
      )
    }

    return (
      <div key={item.id} style={{ scrollSnapAlign: 'start' }}>
        {card}
      </div>
    )
  }

  return (
    <section className={`py-6 ${goldBorder ? 'border-t border-[#C9A84C]/20' : ''}`}>
      <div className="px-8 md:px-16 mb-1">
        {goldBorder && (
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-semibold">MGTV Originals</span>
          </div>
        )}
        {context && (
          <p className="text-[#4A4A4A] text-[11px] tracking-wide mb-1 italic">{context}</p>
        )}
      </div>
      <SectionHeading title={title} seeAllHref={resolvedSeeAll} />

      <div className="relative group/rail">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-[#0A0A0A]/90 border border-white/10 text-[#F5F5F5] hover:bg-[#C9A84C] hover:text-[#0A0A0A] hover:border-[#C9A84C] transition-all duration-200 flex items-center justify-center cursor-pointer opacity-0 group-hover/rail:opacity-100 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div
          ref={railRef}
          onScroll={onScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-8 md:px-16 pb-4 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map((item, i) => renderCard(item, i))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-[#0A0A0A]/90 border border-white/10 text-[#F5F5F5] hover:bg-[#C9A84C] hover:text-[#0A0A0A] hover:border-[#C9A84C] transition-all duration-200 flex items-center justify-center cursor-pointer opacity-0 group-hover/rail:opacity-100 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
