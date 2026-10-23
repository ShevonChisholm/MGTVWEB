import { useEffect, useState } from "react"
import { useParams, Link, useNavigate, useSearchParams } from "react-router"
import { VideoPlayer } from "@/components/player/VideoPlayer"
import { ContentRail } from "@/components/home/ContentRail"
import { ShareBar } from "@/components/shared/ShareBar"
import { LikeButton } from "@/components/shared/LikeButton"
import { RatingWidget } from "@/components/shared/RatingWidget"
import { AddToPlaylistMenu } from "@/components/music/AddToPlaylistMenu"
import { mediaFor, usePlayback } from "@/context/MediaPlaybackContext"
import { usePlaylists } from "@/context/PlaylistContext"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { Badge } from "@/components/ui/Badge"
import { useAppState } from "@/context/AppStateContext"
import { useCatalog } from "@/hooks/useCatalog"

export function MusicVideoPage() {
  const app = useAppState()
  const { musicVideos, featuredArtists } = useCatalog()
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [guestAutoplay, setGuestAutoplay] = useState(true)
  const autoplay = app.profile?.preferences.autoplay ?? guestAutoplay
  const setAutoplay = (change: (value: boolean) => boolean) =>
    app.profile
      ? app.execute({
          type: "preferences",
          preferences: {
            ...app.profile.preferences,
            autoplay: change(autoplay),
          },
        })
      : setGuestAutoplay(change)
  const { videoSequence, setVideoSequence, dispatch } = usePlayback()
  const { playlists } = usePlaylists()
  const playlistId = params.get("playlist")
  const requested = playlists.find(
    (playlist) =>
      playlist.id === playlistId &&
      playlist.kind === "video" &&
      playlist.itemIds.includes(id ?? ""),
  )
  const sequence =
    playlistId && videoSequence?.playlistId === playlistId
      ? videoSequence
      : requested
        ? { playlistId: requested.id, ids: [...requested.itemIds] }
        : null
  const validSequence = sequence?.ids.includes(id ?? "") ? sequence : null
  const nextId = validSequence
    ? validSequence.ids[validSequence.ids.indexOf(id!) + 1]
    : undefined
  useEffect(() => {
    if (requested && videoSequence?.playlistId !== playlistId)
      setVideoSequence({
        playlistId: requested.id,
        ids: [...requested.itemIds],
      })
  }, [playlistId, requested, videoSequence?.playlistId])
  const video = musicVideos.find((v) => v.id === id)
  const related = musicVideos.filter((v) => v.id !== id)
  const artist = video
    ? featuredArtists.find((a) => a.title === video.artist)
    : null

  if (!video) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 flex flex-col items-center justify-center text-center px-8">
        <p className="text-text-secondary text-lg mb-4">Video not found.</p>
        <Link to="/music" className="text-[#C9A84C] hover:underline text-sm">
          ← Back to Music
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <Link
          to="/music"
          className="flex items-center gap-2 text-[#A3A3A3] hover:text-[#C9A84C] transition-colors mb-6 text-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Music
        </Link>

        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          <div>
            <VideoPlayer
              key={video.id}
              mediaId={video.id}
              title={video.title}
              thumbnail={video.thumbnail}
              onEnded={() => {
                if (autoplay && nextId && validSequence) {
                  dispatch({ type: "prepareVideo", media: mediaFor(nextId) })
                  dispatch({ type: "play", owner: "video" })
                  navigate(
                    `/music/video/${nextId}?playlist=${validSequence.playlistId}`,
                  )
                }
              }}
            />
            {playlistId && !validSequence && (
              <Text role="status" className="mt-4 text-xs text-text-secondary">
                Playlist context is invalid. This video is available on its own;
                no other video will auto-play.
              </Text>
            )}
            {validSequence && (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-bg-surface p-4">
                <Button
                  variant="ghost"
                  aria-pressed={autoplay}
                  onClick={() => setAutoplay((value) => !value)}
                >
                  Video playlist auto-play: {autoplay ? "On" : "Off"}
                </Button>
                <ButtonLink
                  variant="ghost"
                  to={`/music/playlist/${validSequence.playlistId}`}
                >
                  View playlist
                </ButtonLink>
                {nextId ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      dispatch({
                        type: "prepareVideo",
                        media: mediaFor(nextId),
                      })
                      dispatch({ type: "play", owner: "video" })
                      navigate(
                        `/music/video/${nextId}?playlist=${validSequence.playlistId}`,
                      )
                    }}
                  >
                    Next video
                  </Button>
                ) : (
                  <Text className="text-xs text-text-secondary">
                    Last video · Stops at the end
                  </Text>
                )}
              </div>
            )}

            <div className="mt-5">
              <h1
                className="text-3xl md:text-4xl text-[#F5F5F5] leading-tight"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {video.title}
              </h1>
              <p className="text-[#C9A84C] text-sm mt-1 font-medium">
                {video.artist}
              </p>
              <div className="flex items-center gap-4 mt-2 text-text-secondary text-xs">
                <span>{video.duration}</span>
                {video.badge && <Badge variant={video.badge} />}
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
                    <p className="text-[#F5F5F5] text-sm font-semibold">
                      {artist.title}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {artist.genre}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {artist.description}
                    </p>
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
                <LikeButton id={video.id} />
                <AddToPlaylistMenu trackId={video.id} />
                <ShareBar title={video.title} compact />
              </div>
              <div className="mt-6">
                <RatingWidget id={video.id} label="Rate this video" />
              </div>
            </div>
          </div>

          {/* Related videos sidebar */}
          <div>
            <h3 className="text-[#F5F5F5] text-sm font-semibold tracking-wider uppercase mb-4">
              More Videos
            </h3>
            <div className="space-y-3">
              {related.slice(0, 6).map((v) => (
                <Link
                  key={v.id}
                  to={`/music/video/${v.id}`}
                  className="flex gap-3 group"
                >
                  <div className="relative flex-shrink-0 w-28 aspect-video rounded-lg overflow-hidden bg-[#1E1E1E]">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-[#C9A84C]/90 flex items-center justify-center">
                        <svg
                          className="w-3.5 h-3.5 text-[#0A0A0A] ml-0.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F5F5F5] text-sm font-medium line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
                      {v.title}
                    </p>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {v.artist}
                    </p>
                    <p className="text-text-secondary text-xs">{v.duration}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Related content rail */}
        <div className="mt-12 -mx-6 md:-mx-12">
          <ContentRail
            title="More Music Videos"
            items={related}
            cardType="video"
            seeAllHref="/music"
            seeAllLabel="All videos"
            linkPrefix="/music/video"
          />
        </div>
      </div>
    </div>
  )
}
