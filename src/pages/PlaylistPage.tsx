import { useParams, Link, useNavigate } from 'react-router'
import { musicVideos } from '@/data/mockContent'
import { usePlaylists } from '@/context/PlaylistContext'
import { useToast } from '@/context/ToastContext'
import { AddToPlaylistMenu } from '@/components/music/AddToPlaylistMenu'

export function PlaylistPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { playlists, removeTrack, deletePlaylist } = usePlaylists()
  const { addToast } = useToast()

  const playlist = playlists.find(p => p.id === id)

  if (!playlist) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 flex flex-col items-center justify-center text-center px-8">
        <p className="text-[#6B6B6B] text-lg mb-4">Playlist not found.</p>
        <Link to="/music" className="text-[#C9A84C] hover:underline text-sm">← Back to Music</Link>
      </div>
    )
  }

  const tracks = playlist.tracks
    .map(tid => musicVideos.find(v => v.id === tid))
    .filter(Boolean) as typeof musicVideos

  const totalDuration = tracks.reduce((sum, t) => {
    const parts = (t.duration ?? '0:00').split(':').map(Number)
    return sum + (parts[0] ?? 0) * 60 + (parts[1] ?? 0)
  }, 0)
  const totalMin = Math.floor(totalDuration / 60)

  const handleDelete = () => {
    deletePlaylist(playlist.id)
    addToast(`Deleted "${playlist.name}"`, 'info')
    navigate('/music')
  }

  const relatedPlaylists = playlists.filter(p => p.id !== id).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ height: 'clamp(280px, 40vh, 420px)' }}
      >
        <img
          src={playlist.coverImage}
          alt={playlist.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 to-transparent" />

        <div className="relative h-full flex flex-col justify-end px-8 md:px-16 pb-10 max-w-[1400px] mx-auto">
          {/* Breadcrumb */}
          <p className="text-[#C9A84C] text-[9px] font-black tracking-[0.35em] uppercase mb-4">
            {playlist.isOwn ? 'Your Playlist' : 'Editorial Playlist'} · MGTV Music
          </p>
          <h1
            className="text-[#F5F5F5] leading-none mb-3"
            style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 8vw, 5.5rem)', letterSpacing: '0.03em' }}
          >
            {playlist.name}
          </h1>
          <p className="text-[#A3A3A3] text-sm mb-4">{playlist.description}</p>
          <div className="flex items-center gap-4 text-[#4A4A4A] text-xs">
            <span>{tracks.length} tracks</span>
            <span>·</span>
            <span>{totalMin} min</span>
            <span>·</span>
            <span>Created {playlist.createdAt}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-5">
            <Link
              to={tracks[0] ? `/music/video/${tracks[0].id}` : '/music'}
              className="bg-[#C9A84C] text-[#0A0A0A] text-sm font-black tracking-widest uppercase px-8 py-3 hover:bg-[#E2C36A] transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Play All
            </Link>
            {playlist.isOwn && (
              <button
                onClick={handleDelete}
                className="border border-white/12 text-[#6B6B6B] text-sm font-semibold px-4 py-3 hover:border-[#EF4444]/40 hover:text-[#EF4444] transition-all cursor-pointer"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-8">
        <div className="grid md:grid-cols-[1fr_320px] gap-12">
          {/* Tracks */}
          <div>
            {tracks.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-[#4A4A4A] text-sm">No tracks in this playlist yet.</p>
                <Link to="/music" className="text-[#C9A84C] text-sm hover:text-[#E2C36A] mt-2 inline-block">Browse Music →</Link>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4 pb-3 mb-2 border-b border-white/5 text-[#4A4A4A] text-[10px] font-semibold tracking-widest uppercase">
                  <span className="w-8 text-center">#</span>
                  <span className="flex-1">Title</span>
                  <span className="hidden md:block w-24 text-right">Duration</span>
                  <span className="w-8" />
                </div>
                {tracks.map((track, i) => (
                  <div key={track.id} className="group flex items-center gap-4 py-3 border-b border-white/5 hover:bg-white/2 transition-colors -mx-2 px-2">
                    {/* Number / play */}
                    <Link to={`/music/video/${track.id}`} className="w-8 flex-shrink-0 flex items-center justify-center">
                      <span className="text-[#4A4A4A] text-sm group-hover:hidden">{i + 1}</span>
                      <svg className="w-4 h-4 text-[#C9A84C] hidden group-hover:block" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </Link>

                    {/* Thumbnail + title */}
                    <Link to={`/music/video/${track.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 flex-shrink-0 overflow-hidden bg-[#1A1A1A]">
                        <img src={track.thumbnail} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#F5F5F5] text-sm font-medium truncate group-hover:text-[#C9A84C] transition-colors">{track.title}</p>
                        <p className="text-[#4A4A4A] text-xs mt-0.5 truncate">{track.artist}</p>
                      </div>
                    </Link>

                    {/* Duration */}
                    <span className="hidden md:block text-[#4A4A4A] text-xs w-24 text-right flex-shrink-0">{track.duration}</span>

                    {/* Actions */}
                    <div className="flex items-center gap-1 w-8 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {playlist.isOwn && (
                        <button
                          onClick={() => removeTrack(playlist.id, track.id)}
                          className="text-[#4A4A4A] hover:text-[#EF4444] transition-colors cursor-pointer"
                          title="Remove from playlist"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: related playlists */}
          {relatedPlaylists.length > 0 && (
            <div>
              <h3
                className="text-[#F5F5F5] mb-5"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', letterSpacing: '0.05em' }}
              >
                More Playlists
              </h3>
              <div className="space-y-4">
                {relatedPlaylists.map(pl => (
                  <Link
                    key={pl.id}
                    to={`/music/playlist/${pl.id}`}
                    className="flex gap-4 group"
                  >
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                      <img src={pl.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-[#F5F5F5] text-sm font-semibold truncate group-hover:text-[#C9A84C] transition-colors">{pl.name}</p>
                      <p className="text-[#4A4A4A] text-xs mt-0.5">{pl.tracks.length} tracks</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Add track hint */}
              <div className="mt-8 pt-6 border-t border-white/6">
                <p className="text-[#4A4A4A] text-xs leading-relaxed">
                  Browse a music video and use the <span className="text-[#C9A84C]">Playlist</span> button to add tracks to your playlists.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
