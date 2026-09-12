import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { playlists as mockPlaylists, type Playlist } from '@/data/mockContent'

interface PlaylistContextValue {
  playlists: Playlist[]
  createPlaylist: (name: string, firstTrackId?: string) => string
  addTrack: (playlistId: string, trackId: string) => void
  removeTrack: (playlistId: string, trackId: string) => void
  deletePlaylist: (id: string) => void
  hasTrack: (playlistId: string, trackId: string) => boolean
}

const PlaylistContext = createContext<PlaylistContextValue | null>(null)

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists)

  const createPlaylist = useCallback((name: string, firstTrackId?: string) => {
    const id = `pl-${Date.now()}`
    const newPlaylist: Playlist = {
      id,
      name,
      description: 'My playlist',
      coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
      tracks: firstTrackId ? [firstTrackId] : [],
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isOwn: true,
    }
    setPlaylists(prev => [newPlaylist, ...prev])
    return id
  }, [])

  const addTrack = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(pl =>
      pl.id === playlistId && !pl.tracks.includes(trackId)
        ? { ...pl, tracks: [...pl.tracks, trackId] }
        : pl
    ))
  }, [])

  const removeTrack = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(pl =>
      pl.id === playlistId
        ? { ...pl, tracks: pl.tracks.filter(t => t !== trackId) }
        : pl
    ))
  }, [])

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => prev.filter(pl => pl.id !== id))
  }, [])

  const hasTrack = useCallback((playlistId: string, trackId: string) => {
    const pl = playlists.find(p => p.id === playlistId)
    return pl ? pl.tracks.includes(trackId) : false
  }, [playlists])

  return (
    <PlaylistContext.Provider value={{ playlists, createPlaylist, addTrack, removeTrack, deletePlaylist, hasTrack }}>
      {children}
    </PlaylistContext.Provider>
  )
}

export function usePlaylists() {
  const ctx = useContext(PlaylistContext)
  if (!ctx) throw new Error('usePlaylists must be used within PlaylistProvider')
  return ctx
}
