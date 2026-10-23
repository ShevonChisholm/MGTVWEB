import {
  createContext,
  useContext,
  type ReactNode,
  type SetStateAction,
} from "react"
import { useAppState } from "./AppStateContext"
import {
  playlists as fixtures,
  catalogById,
  type Playlist,
} from "@/data/mockContent"

type Kind = Playlist["kind"]
const compatible = (id: string, kind: Kind) =>
  catalogById[id]?.type === (kind === "audio" ? "track" : "musicVideo")
interface PlaylistContextValue {
  playlists: Playlist[]
  createPlaylist: (name: string, kind: Kind, firstId?: string) => string
  addTrack: (playlistId: string, itemId: string) => void
  removeTrack: (playlistId: string, itemId: string) => void
  moveItem: (playlistId: string, itemId: string, direction: -1 | 1) => void
  deletePlaylist: (id: string) => void
  hasTrack: (playlistId: string, itemId: string) => boolean
}
const Context = createContext<PlaylistContextValue | null>(null)
export function PlaylistProvider({ children }: { children: ReactNode }) {
  const { data, updateData, requirePersonal, allowed } = useAppState()
  const rawPlaylists = [...data.playlists, ...fixtures.filter((p) => !p.isOwn)]
  const playlists = rawPlaylists.map((p) => {
    const itemIds = p.itemIds.filter((id) => allowed(catalogById[id]))
    return {
      ...p,
      itemIds,
      coverImage: itemIds.length ? catalogById[itemIds[0]].thumbnail : "",
    }
  })
  const setPlaylists = (value: SetStateAction<Playlist[]>) => {
    if (!requirePersonal()) return
    const next = typeof value === "function" ? value(rawPlaylists) : value
    updateData({ playlists: next.filter((p) => p.isOwn) })
  }
  const createPlaylist = (name: string, kind: Kind, firstId?: string) => {
    if (
      !requirePersonal(firstId) ||
      !name.trim() ||
      (firstId && !compatible(firstId, kind))
    )
      return ""
    const id = `pl-user-${crypto.randomUUID()}`
    setPlaylists((previous) => [
      {
        id,
        name: name.trim(),
        kind,
        itemIds: firstId ? [firstId] : [],
        isOwn: true,
        description: "Your session playlist",
        coverImage: catalogById[firstId ?? "tr1"].thumbnail,
        createdAt: "This session",
      },
      ...previous,
    ])
    return id
  }
  const addTrack = (id: string, itemId: string) =>
    requirePersonal(itemId) &&
    setPlaylists((previous) =>
      previous.map((playlist) =>
        playlist.id === id &&
        playlist.isOwn &&
        compatible(itemId, playlist.kind) &&
        !playlist.itemIds.includes(itemId)
          ? { ...playlist, itemIds: [...playlist.itemIds, itemId] }
          : playlist,
      ),
    )
  const removeTrack = (id: string, itemId: string) =>
    setPlaylists((previous) =>
      previous.map((playlist) =>
        playlist.id === id && playlist.isOwn
          ? {
              ...playlist,
              itemIds: playlist.itemIds.filter((value) => value !== itemId),
            }
          : playlist,
      ),
    )
  const deletePlaylist = (id: string) =>
    setPlaylists((previous) =>
      previous.filter((playlist) => playlist.id !== id || !playlist.isOwn),
    )
  const moveItem = (id: string, itemId: string, direction: -1 | 1) =>
    setPlaylists((previous) =>
      previous.map((playlist) => {
        if (playlist.id !== id || !playlist.isOwn) return playlist
        const index = playlist.itemIds.indexOf(itemId)
        const target = index + direction
        if (index < 0 || target < 0 || target >= playlist.itemIds.length)
          return playlist
        const itemIds = [...playlist.itemIds]
        ;[itemIds[index], itemIds[target]] = [itemIds[target], itemIds[index]]
        return { ...playlist, itemIds }
      }),
    )
  return (
    <Context.Provider
      value={{
        playlists,
        createPlaylist,
        addTrack,
        removeTrack,
        moveItem,
        deletePlaylist,
        hasTrack: (id, itemId) =>
          !!playlists
            .find((playlist) => playlist.id === id)
            ?.itemIds.includes(itemId),
      }}
    >
      {children}
    </Context.Provider>
  )
}
export function usePlaylists() {
  const context = useContext(Context)
  if (!context) throw new Error("usePlaylists requires PlaylistProvider")
  return context
}
