import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { VideoPlayer } from '@/components/player/VideoPlayer'
import { ContentRail } from '@/components/home/ContentRail'
import {
  trending, popularMovies, musicVideos, featuredShows, originals,
  showDetails, movieDetails,
} from '@/data/mockContent'

function findContent(id: string) {
  const all = [...trending, ...popularMovies, ...musicVideos, ...featuredShows, ...originals]
  return all.find(c => c.id === id) ?? null
}

function findEpisode(id: string) {
  for (const show of Object.values(showDetails)) {
    for (const season of show.seasons) {
      const ep = season.episodes.find(e => e.id === id)
      if (ep) return { episode: ep, show }
    }
  }
  return null
}

function findMovie(id: string) {
  return movieDetails[id] ?? null
}

export function WatchPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [autoplayNext, setAutoplayNext] = useState(true)

  if (!id) { navigate('/'); return null }

  const episodeResult = findEpisode(id)
  const movie = findMovie(id)
  const genericContent = findContent(id)

  let title = 'Now Playing'
  let thumbnail: string | undefined
  let showData = episodeResult?.show ?? null
  let currentEpisode = episodeResult?.episode ?? null
  let relatedItems = trending

  if (episodeResult) {
    title = `${episodeResult.show.title} — E${episodeResult.episode.number}: ${episodeResult.episode.title}`
    thumbnail = episodeResult.episode.thumbnail
    relatedItems = featuredShows
  } else if (movie) {
    title = movie.title
    thumbnail = movie.banner
    relatedItems = popularMovies
  } else if (genericContent) {
    title = genericContent.title
    thumbnail = genericContent.thumbnail
  }

  const allEpisodes = showData?.seasons.flatMap(s => s.episodes) ?? []
  const currentIdx = allEpisodes.findIndex(e => e.id === id)
  const nextEpisode = currentIdx >= 0 && currentIdx < allEpisodes.length - 1 ? allEpisodes[currentIdx + 1] : null

  const handleEnded = () => {
    if (autoplayNext && nextEpisode) {
      navigate(`/watch/${nextEpisode.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#A3A3A3] hover:text-[#C9A84C] transition-colors mb-5 text-sm cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Player + info */}
          <div>
            <VideoPlayer title={title} thumbnail={thumbnail} onEnded={handleEnded} />

            {/* Info below player */}
            <div className="mt-5">
              <h1 className="text-2xl md:text-3xl text-[#F5F5F5] leading-tight" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                {title}
              </h1>

              {currentEpisode && (
                <p className="text-[#A3A3A3] text-sm mt-2 leading-relaxed max-w-2xl">
                  {currentEpisode.description}
                </p>
              )}

              {movie && (
                <p className="text-[#A3A3A3] text-sm mt-2 leading-relaxed max-w-2xl">
                  {movie.description}
                </p>
              )}

              {/* Auto-play toggle */}
              {nextEpisode && (
                <div className="flex items-center gap-3 mt-5 p-4 bg-[#141414] rounded-xl border border-white/8">
                  <div className="flex-1">
                    <p className="text-[#F5F5F5] text-sm font-medium">Auto-play next episode</p>
                    <p className="text-[#6B6B6B] text-xs mt-0.5">E{nextEpisode.number}: {nextEpisode.title} · {nextEpisode.duration}</p>
                  </div>
                  <button
                    onClick={() => setAutoplayNext(v => !v)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${autoplayNext ? 'bg-[#C9A84C]' : 'bg-[#3A3A3A]'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${autoplayNext ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <Link
                    to={`/watch/${nextEpisode.id}`}
                    className="flex items-center gap-1 text-[#C9A84C] text-sm hover:text-[#E2C36A] transition-colors"
                  >
                    Play now
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: episode list or related */}
          <div className="space-y-4">
            {showData && allEpisodes.length > 0 ? (
              <div>
                <h3 className="text-[#F5F5F5] text-sm font-semibold tracking-wider uppercase mb-3">Episodes</h3>
                <div className="space-y-2 max-h-[70vh] overflow-y-auto scrollbar-hide">
                  {allEpisodes.map(ep => (
                    <Link
                      key={ep.id}
                      to={`/watch/${ep.id}`}
                      className={`flex gap-3 p-3 rounded-xl transition-all border ${
                        ep.id === id
                          ? 'bg-[#2A2010] border-[#C9A84C]/40'
                          : 'bg-[#141414] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="relative flex-shrink-0 w-24 aspect-video rounded-lg overflow-hidden bg-[#1E1E1E]">
                        <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" />
                        {ep.id === id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <div className="w-6 h-6 rounded-full bg-[#C9A84C] flex items-center justify-center">
                              <svg className="w-3 h-3 text-[#0A0A0A]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                              </svg>
                            </div>
                          </div>
                        )}
                        {ep.progress !== undefined && ep.progress > 0 && ep.id !== id && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                            <div className="h-full bg-[#C9A84C]" style={{ width: `${ep.progress}%` }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs mb-0.5 ${ep.id === id ? 'text-[#C9A84C]' : 'text-[#6B6B6B]'}`}>
                          Episode {ep.number}
                        </p>
                        <p className={`text-sm font-medium line-clamp-1 ${ep.id === id ? 'text-[#C9A84C]' : 'text-[#F5F5F5]'}`}>
                          {ep.title}
                        </p>
                        <p className="text-[#6B6B6B] text-xs mt-0.5">{ep.duration}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-[#F5F5F5] text-sm font-semibold tracking-wider uppercase mb-3">Up Next</h3>
                <div className="space-y-3">
                  {relatedItems.slice(0, 5).map(item => (
                    <Link
                      key={item.id}
                      to={`/watch/${item.id}`}
                      className="flex gap-3 p-3 bg-[#141414] rounded-xl border border-white/5 hover:border-white/15 transition-all"
                    >
                      <img src={item.thumbnail} alt={item.title} className="w-24 aspect-video object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F5F5F5] text-sm font-medium line-clamp-2">{item.title}</p>
                        {item.duration && <p className="text-[#6B6B6B] text-xs mt-1">{item.duration}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related content rail */}
        <div className="mt-12 -mx-4 md:-mx-8">
          <ContentRail title="You Might Also Like" items={relatedItems} cardType="default" seeAllHref="/" />
        </div>
      </div>
    </div>
  )
}
