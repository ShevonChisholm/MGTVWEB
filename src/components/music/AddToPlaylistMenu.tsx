import { useState, useRef, useEffect } from 'react'
import { usePlaylists } from '@/context/PlaylistContext'
import { useToast } from '@/context/ToastContext'
import { useNavigate } from 'react-router'

interface AddToPlaylistMenuProps {
  trackId: string
}

export function AddToPlaylistMenu({ trackId }: AddToPlaylistMenuProps) {
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { playlists, addTrack, createPlaylist, hasTrack } = usePlaylists()
  const { addToast } = useToast()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
        setCreating(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleAdd = (playlistId: string, playlistName: string) => {
    addTrack(playlistId, trackId)
    addToast(`Added to "${playlistName}"`, 'success')
    setOpen(false)
  }

  const handleCreate = () => {
    if (!newName.trim()) return
    const id = createPlaylist(newName.trim(), trackId)
    addToast(`Playlist "${newName.trim()}" created`, 'success')
    setNewName('')
    setCreating(false)
    setOpen(false)
    navigate(`/music/playlist/${id}`)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => { setOpen(v => !v); setCreating(false) }}
        className="flex items-center gap-1.5 px-3 py-2 border border-white/12 text-[#6B6B6B] hover:border-white/20 hover:text-[#A3A3A3] transition-all cursor-pointer"
        title="Add to playlist"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <span className="text-xs font-semibold">Playlist</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#161616] border border-white/10 shadow-2xl shadow-black/60 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/8">
            <p className="text-[#F5F5F5] text-xs font-semibold">Save to Playlist</p>
          </div>

          {/* Playlist list */}
          <div className="max-h-[240px] overflow-y-auto">
            {playlists.map(pl => {
              const already = hasTrack(pl.id, trackId)
              return (
                <button
                  key={pl.id}
                  onClick={() => !already && handleAdd(pl.id, pl.name)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${
                    already ? 'opacity-50 cursor-default' : 'hover:bg-white/4 cursor-pointer'
                  }`}
                >
                  <div className="w-8 h-8 flex-shrink-0 overflow-hidden">
                    <img src={pl.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F5F5F5] text-xs font-medium truncate">{pl.name}</p>
                    <p className="text-[#4A4A4A] text-[10px]">{pl.tracks.length} tracks</p>
                  </div>
                  {already && (
                    <svg className="w-3.5 h-3.5 text-[#C9A84C] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>

          {/* Create new */}
          <div className="border-t border-white/8 p-3">
            {creating ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  placeholder="Playlist name..."
                  className="flex-1 bg-[#0A0A0A] border border-white/12 text-[#F5F5F5] text-xs px-2.5 py-2 placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C9A84C]/40"
                />
                <button
                  onClick={handleCreate}
                  className="px-3 py-2 bg-[#C9A84C] text-[#0A0A0A] text-xs font-black cursor-pointer hover:bg-[#E2C36A] transition-colors"
                >
                  Create
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="flex items-center gap-2 text-[#C9A84C] text-xs font-semibold hover:text-[#E2C36A] transition-colors cursor-pointer w-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Playlist
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
