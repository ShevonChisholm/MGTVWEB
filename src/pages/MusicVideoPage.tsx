import { useParams, Link } from 'react-router'
import { VideoPlayer } from '@/components/player/VideoPlayer'
import { ContentRail } from '@/components/home/ContentRail'
import { musicVideos, featuredArtists } from '@/data/mockContent'
import { ShareBar } from '@/components/shared/ShareBar'
import { LikeButton } from '@/components/shared/LikeButton'
import { RatingWidget } from '@/components/shared/RatingWidget'
import { AddToPlaylistMenu } from '@/components/music/AddToPlaylistMenu'

export function MusicVideoPage() {
  const { id } = useParams()
  const video = musicVideos.find(v => v.id === id)
  const related = musicVideos.filter(v => v.id !== id)
  const artist = video ? featuredArtists.find(a => a.title === video.artist) : null

  if (!video) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 flex flex-col items-center justify-center text-center px-8">
        <p className="text-[#6B6B6B] text-lg mb-4">Video not found.</p>
        <Link to="/music" className="text-[#C9A84C] hover:underline text-sm">← Back to Music</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8">
        <Link to="/music" className="flex items-center gap-2 text-[#A3A3A3] hover:text-[#C9A84C] transition-colors mb-6 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Music
        </Link>

        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          <div>
            <VideoPlayer title={video.title} thumbnail={video.thumbnail} />

            <div className="mt-5">
              <h1 className="text-3xl md:text-4xl text-[#F5F5F5] leading-tight" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                {video.title}
              </h1>
              <p className="text-[#C9A84C] text-sm mt-1 font-medium">{video.artist}</p>
              <div className="flex items-center gap-4 mt-2 text-[#6B6B6B] text-xs">
                <span>{video.duration}</span>
                {video.badge && (
                  <span className="uppercase tracking-wider px-2 py-0.5 bg-[#2A2010] text-[#C9A84C] rounded text-[10px] font-semibold">
                    {video.badge}
                  </span>
                )}
              </div>

              {/* Artist info */}
              {artist && (
                <div className="mt-6 flex items-center gap-4 p-4 bg-[#141414] rounded-xl border border-white/8">
                  <img
                    src={artist.thumbnail}
                    alt={artist.title}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F5F5F5] text-sm font-semibold">{artist.title}</p>
                    <p className="text-[#6B6B6B] text-xs">{artist.genre}</p>
                    <p className="text-[#6B6B6B] text-xs">{artist.description}</p>
                  </div>
                  <Link
                    to={`/music/artist/${artist.id}`}
                    className="text-[#C9A84C] text-xs hover:text-[#E2C36A] transition-colors flex-shrink-0"
                  >
                    View artist →
                  </Link>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <LikeButton id={video.id} baseCount={982} />
                <AddToPlaylistMenu trackId={video.id} />
                <ShareBar title={video.title} compact />
              </div>
              <div className="mt-6">
                <RatingWidget id={video.id} label="Rate this track" />
              </div>
            </div>
          </div>

          {/* Related videos sidebar */}
          <div>
            <h3 className="text-[#F5F5F5] text-sm font-semibold tracking-wider uppercase mb-4">More Videos</h3>
            <div className="space-y-3">
              {related.slice(0, 6).map(v => (
                <Link
                  key={v.id}
                  to={`/music/video/${v.id}`}
                  className="flex gap-3 group"
                >
                  <div className="relative flex-shrink-0 w-28 aspect-video rounded-lg overflow-hidden bg-[#1E1E1E]">
                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-[#C9A84C]/90 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-[#0A0A0A] ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F5F5F5] text-sm font-medium line-clamp-2 group-hover:text-[#C9A84C] transition-colors">{v.title}</p>
                    <p className="text-[#6B6B6B] text-xs mt-0.5">{v.artist}</p>
                    <p className="text-[#6B6B6B] text-xs">{v.duration}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Related content rail */}
        <div className="mt-12 -mx-6 md:-mx-12">
          <ContentRail title="More Music Videos" items={related} cardType="video" seeAllHref="/music" linkPrefix="/music/video" />
        </div>
      </div>
    </div>
  )
}
