import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { FilterSidebar } from '@/components/shared/FilterSidebar'
import { ContentRail } from '@/components/home/ContentRail'
import { musicVideos, featuredArtists } from '@/data/mockContent'
import { usePlaylists } from '@/context/PlaylistContext'

const genreSection = { label: 'Genre', options: ['All', 'Reggae', 'Dancehall', 'Soca', 'Gospel', 'R&B', 'Afrobeats'] }
const regionSection = { label: 'Region', options: ['All Islands', 'Jamaica', 'Trinidad', 'Barbados', 'Guyana'] }

const featuredVideo = musicVideos[0]
const featuredArtist = featuredArtists[0]

// Static waveform heights to avoid re-render flicker
const WAVE = [18,32,44,28,52,38,20,46,34,24,56,40,18,42,30,50,22,48,36,26,54,32,44,20,58,38,28,46,34,24,50,40,18,44,30,52,22,48,36,26,56,32,44,20,54,38,28,46,34,24]

export function MusicPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? musicVideos : musicVideos.filter(v => v.genre === active)
  const { playlists } = usePlaylists()

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* ── NOW PLAYING / VINYL HERO ── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(480px, 65vh, 640px)' }}>
        {/* Full concert image */}
        <img
          src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80"
          alt="Concert"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/55 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/30 to-transparent" />

        {/* Right: Vinyl record disc */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:block">
          {/* Outer ring glow */}
          <div
            className="relative"
            style={{
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              boxShadow: '0 0 60px rgba(201,168,76,0.15), 0 0 120px rgba(0,0,0,0.8)',
            }}
          >
            {/* Disc */}
            <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-[#1A1A1A]">
              <img src={featuredArtist.thumbnail} alt="Artist" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7) contrast(1.1)' }} />
            </div>
            {/* Groove rings */}
            <div className="absolute inset-0 rounded-full ring-[1px] ring-white/5" style={{ margin: '20%' }} />
            <div className="absolute inset-0 rounded-full ring-[1px] ring-white/3" style={{ margin: '35%' }} />
            {/* Center hole */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#0A0A0A] ring-1 ring-white/10" />
            </div>
          </div>
          {/* Artist label below */}
          <div className="text-center mt-4">
            <p className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase">{featuredArtist.title}</p>
            <p className="text-[#4A4A4A] text-[10px] mt-0.5">{featuredArtist.genre}</p>
          </div>
        </div>

        {/* Waveform decoration at bottom */}
        <div className="absolute bottom-12 inset-x-0 flex items-end justify-center gap-px px-20 overflow-hidden" style={{ height: '64px' }}>
          {WAVE.map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-[#C9A84C]/20"
              style={{ height: `${h}%`, maxWidth: '8px', minWidth: '2px' }}
            />
          ))}
        </div>

        {/* Text */}
        <div className="relative h-full flex flex-col justify-center px-8 md:px-16 pb-16 max-w-xl">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
            <span className="text-[#EF4444] text-[10px] font-black tracking-[0.3em] uppercase">Live Streaming Now</span>
          </div>
          <p className="text-[#C9A84C] text-sm font-semibold tracking-[0.15em] uppercase mb-2">{featuredVideo.title} · {featuredVideo.artist}</p>
          <h1
            className="text-[#F5F5F5] leading-[0.9] mb-5"
            style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(4rem, 11vw, 7.5rem)' }}
          >
            The<br />Riddim
          </h1>
          <p className="text-[#6B6B6B] text-sm leading-relaxed mb-8 max-w-sm">
            Reggae, dancehall, soca, and afrobeats — the sounds shaping Caribbean culture, all in one place.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/music/video/${featuredVideo.id}`)}
              className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-6 py-2.5 text-sm font-black hover:bg-[#E2C36A] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Listen Now
            </button>
            <button
              onClick={() => navigate(`/music/artist/${featuredArtist.id}`)}
              className="border border-white/20 text-[#F5F5F5] px-6 py-2.5 text-sm font-medium hover:border-white/40 transition-all cursor-pointer"
            >
              View Artist
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      </section>

      {/* ── BROWSE ── */}
      <div className="max-w-[1400px] mx-auto pb-16">
        <div className="flex items-center gap-4 px-8 md:px-16 py-6">
          <FilterSidebar sections={[genreSection, regionSection]} active={active} onChange={setActive} />
          <span className="text-[#4A4A4A] text-xs">{(filtered.length || musicVideos.length)} videos</span>
        </div>
        <ContentRail title="Music Videos" items={filtered.length ? filtered : musicVideos} cardType="music" seeAllHref="/music" linkPrefix="/music/video" />
        <ContentRail title="Featured Artists" items={featuredArtists} cardType="artist" seeAllHref="/music" context="Trending in the Caribbean" />
        <ContentRail title="Rising Artists" items={[...featuredArtists].reverse()} cardType="artist" seeAllHref="/music" context="New voices worth hearing" />

        {/* Playlists */}
        <div className="px-8 md:px-16 py-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[#C9A84C] text-[9px] font-black tracking-[0.3em] uppercase mb-1">Curated</p>
              <h2 className="text-[#F5F5F5]" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', letterSpacing: '0.05em' }}>Playlists</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {playlists.map(pl => (
              <Link key={pl.id} to={`/music/playlist/${pl.id}`} className="group block">
                <div className="relative aspect-square overflow-hidden bg-[#141414]">
                  <img src={pl.coverImage} alt={pl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-[#C9A84C] flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#0A0A0A] ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                  {pl.isOwn && (
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] font-black tracking-widest uppercase px-2 py-1 bg-[#C9A84C] text-[#0A0A0A]">Yours</span>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-[#F5F5F5] text-sm font-semibold truncate group-hover:text-[#C9A84C] transition-colors">{pl.name}</p>
                  <p className="text-[#4A4A4A] text-xs mt-0.5">{pl.tracks.length} tracks</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
