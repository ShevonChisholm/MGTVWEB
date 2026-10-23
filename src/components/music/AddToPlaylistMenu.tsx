import { useState } from "react"
import { catalogById } from "@/data/mockContent"
import { usePlaylists } from "@/context/PlaylistContext"
import { useToast } from "@/context/ToastContext"
import { Button, ButtonLink } from "@/components/ui/Button"
import { useAppState } from "@/context/AppStateContext"
import { Input } from "@/components/ui/Input"
import { Text } from "@/components/ui/Text"
import { SessionDialog } from "@/components/shared/SessionDialog"

export function AddToPlaylistMenu({ trackId }: { trackId: string }) {
  const app = useAppState()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const { playlists, addTrack, createPlaylist, hasTrack } = usePlaylists()
  const { addToast } = useToast()
  const item = catalogById[trackId]
  if (!item || !["track", "musicVideo"].includes(item.type)) return null
  const kind = item.type === "track" ? "audio" : "video"
  const compatible = playlists.filter(
    (playlist) => playlist.kind === kind && playlist.isOwn,
  )
  if (!app.profile)
    return (
      <ButtonLink
        variant="ghost"
        size="sm"
        to={`/auth/sign-in?returnTo=${encodeURIComponent(location.pathname + location.search)}`}
      >
        Sign in for playlists
      </ButtonLink>
    )
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="min-h-11"
        onClick={() => setOpen(true)}
        aria-label={`Add ${item.title} to a ${
          kind === "audio" ? "track" : "video"
        } playlist`}
      >
        Playlist
      </Button>
      {open && (
        <SessionDialog
          title={`Save ${kind === "audio" ? "track" : "video"} to playlist`}
          onClose={() => setOpen(false)}
        >
          <Text className="mb-4 text-sm text-text-secondary">
            Only your compatible playlists are shown. Editorial playlists are
            read-only.
          </Text>
          <div className="space-y-2">
            {!compatible.length && (
              <Text className="text-sm text-text-secondary">
                No compatible playlist yet. Create one below.
              </Text>
            )}
            {compatible.map((playlist) => (
              <Button
                key={playlist.id}
                variant="outline"
                className="w-full justify-between"
                disabled={hasTrack(playlist.id, trackId)}
                onClick={() => {
                  addTrack(playlist.id, trackId)
                  addToast(
                    `Added to "${playlist.name}" for this session`,
                    "success",
                  )
                  setOpen(false)
                }}
              >
                {playlist.name}
                <Text as="span" className="text-xs">
                  {hasTrack(playlist.id, trackId)
                    ? "Already added"
                    : `${playlist.itemIds.length} items`}
                </Text>
              </Button>
            ))}
          </div>
          <form
            className="mt-6 flex flex-wrap gap-3 border-t border-text-muted/20 pt-6"
            onSubmit={(event) => {
              event.preventDefault()
              if (!createPlaylist(name, kind, trackId)) return
              addToast("Playlist created for this session", "success")
              setName("")
              setOpen(false)
            }}
          >
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-label="New playlist name"
              placeholder={`New ${
                kind === "audio" ? "track" : "video"
              } playlist name`}
              maxLength={80}
              className="min-w-0 flex-1"
            />
            <Button type="submit" disabled={!name.trim()}>
              Create & add
            </Button>
          </form>
        </SessionDialog>
      )}
    </>
  )
}
