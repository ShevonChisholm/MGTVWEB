import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { showDetails, extraShowDetails, featuredShows } from '@/data/mockContent'
import { ContentRail } from '@/components/home/ContentRail'
import { ShareBar } from '@/components/shared/ShareBar'
import { useSaved } from '@/context/SavedContext'
import { LikeButton } from '@/components/shared/LikeButton'
import { RatingWidget } from '@/components/shared/RatingWidget'

const allShowDetails = { ...showDetails, ...extraShowDetails }

export function ShowDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isSaved, toggle } = useSaved()
  const show = id ? allShowDetails[id] : null
  const [activeSeason, setActiveSeason] = useState(0)

  if (!show) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 flex flex-col items-center justify-center text-center px-8">
        <p className="text-[#6B6B6B] text-lg mb-4">Show not found.</p>
        <Link to="/shows" className="text-[#C9A84C] hover:underline text-sm">← Back to Shows</Link>
      </div>
    )
  }

  const season = show.seasons[activeSeason]

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Banner */}
      <div className="relative w-full h-[55vh] min-h-[400px] overflow-hidden">
        <img src={show.banner} alt={show.title} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-10 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant={show.badge} />
            <span className="text-[#A3A3A3] text-xs tracking-widest uppercase">{show.genre}</span>
          </div>
          <h1 className="text-5xl md:text-7xl text-[#F5F5F5] leading-none mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {show.title}
          </h1>
          <div className="flex gap-3">
            <Button variant="primary" size="lg" onClick={() => {
              const firstEp = show.seasons[0]?.episodes[0]
              navigate(firstEp ? `/watch/${firstEp.id}` : `/watch/${show.id}`)
            }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Play
            </Button>
            <Button variant="outline" size="lg" onClick={() => id && toggle(id)}>
              {id && isSaved(id) ? '✓ Saved' : '+ My List'}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-10">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Main */}
          <div className="md:col-span-2">
            <p className="text-[#A3A3A3] text-base leading-relaxed mb-6">{show.description}</p>

            {/* Like + Rating */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-white/6">
              <LikeButton id={show.id} baseCount={2841} />
              <RatingWidget id={show.id} label="Rate this show" />
            </div>

            {/* Season tabs */}
            {show.seasons.length > 1 && (
              <div className="flex gap-2 mb-6">
                {show.seasons.map((s, i) => (
                  <button
                    key={s.number}
                    onClick={() => setActiveSeason(i)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      activeSeason === i ? 'bg-[#C9A84C] text-[#0A0A0A]' : 'bg-[#1E1E1E] text-[#A3A3A3] hover:text-[#F5F5F5]'
                    }`}
                  >
                    Season {s.number}
                  </button>
                ))}
              </div>
            )}

            {/* Episode list */}
            <div className="space-y-3">
              {season.episodes.map(ep => (
                <div key={ep.id} className="group flex gap-4 bg-[#141414] rounded-xl p-4 border border-white/5 hover:border-[#C9A84C]/20 transition-colors cursor-pointer">
                  <div className="relative flex-shrink-0 w-36 aspect-video rounded-lg overflow-hidden bg-[#1E1E1E]">
                    <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-[#C9A84C]/90 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#0A0A0A] ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    {ep.progress !== undefined && ep.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div className="h-full bg-[#C9A84C]" style={{ width: `${ep.progress}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#6B6B6B] text-xs">Episode {ep.number}</span>
                      <span className="text-[#6B6B6B] text-xs">{ep.duration}</span>
                    </div>
                    <p className="text-[#F5F5F5] text-sm font-semibold group-hover:text-[#C9A84C] transition-colors">{ep.title}</p>
                    <p className="text-[#6B6B6B] text-xs mt-1 line-clamp-2 leading-relaxed">{ep.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-[#141414] rounded-xl p-6 border border-white/8">
              <h3 className="text-[#F5F5F5] text-sm font-semibold mb-4 tracking-wider uppercase">Cast</h3>
              <ul className="space-y-2">
                {show.cast.map(name => (
                  <li key={name} className="text-[#A3A3A3] text-sm flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#2A2010] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#C9A84C] text-[10px] font-bold">{name[0]}</span>
                    </div>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Share */}
        <div className="mt-8">
          <ShareBar title={show.title} />
        </div>

        {/* Related */}
        <div className="mt-10 -mx-8 md:-mx-16">
          <ContentRail title="More Shows" items={featuredShows} cardType="default" seeAllHref="/shows" />
        </div>
      </div>
    </div>
  )
}
