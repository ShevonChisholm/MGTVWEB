import { useParams, Link } from "react-router"
import { catalogById } from "@/data/mockContent"
import { ContentUnavailable } from "@/components/shared/ContentUnavailable"
import {
  TrackCard,
  TrackPlay,
  TrackActions,
} from "@/components/music/TrackCard"
import { Text } from "@/components/ui/Text"
import { ButtonLink } from "@/components/ui/Button"
import { ShareBar } from "@/components/shared/ShareBar"
import { LikeButton } from "@/components/shared/LikeButton"
import { RatingWidget } from "@/components/shared/RatingWidget"
import { usePlayback } from "@/context/MediaPlaybackContext"
import { statusLabel } from "@/lib/playback"
import { useCatalog } from "@/hooks/useCatalog"

export function TrackDetailPage() {
  const { tracks } = useCatalog()
  const { id } = useParams()
  const track = id ? catalogById[id] : undefined
  const { state } = usePlayback()
  if (!track || track.type !== "track")
    return (
      <ContentUnavailable
        kind="Track"
        backTo="/music?view=tracks"
        backLabel="Browse tracks"
      />
    )
  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-16">
        <ButtonLink to="/music?view=tracks" variant="ghost" className="mb-8">
          Back to tracks
        </ButtonLink>
        <div className="grid items-center gap-10 md:grid-cols-[1fr_2fr]">
          <img
            src={track.thumbnail}
            alt={`${track.title} artwork`}
            className="aspect-square w-full rounded-xl object-cover"
          />
          <div>
            <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
              Audio track · {track.duration} · {track.genre}
            </Text>
            <Text
              as="h1"
              className="font-display text-5xl leading-none md:text-7xl"
            >
              {track.title}
            </Text>
            <Link
              to={`/music/artist/${track.artistId}`}
              className="mt-4 block text-lg text-gold hover:underline"
            >
              {track.artist}
            </Link>
            <Text className="my-6 max-w-lg text-sm leading-relaxed text-text-secondary">
              Simulated audio preview — no audio source connected. The shared
              mini-player keeps your queue and position while you browse.
              Refresh resets this session.
            </Text>
            <div className="flex flex-wrap items-center gap-3">
              <TrackPlay track={track} />
              <TrackActions track={track} />
              <LikeButton id={track.id} />
              <ShareBar title={track.title} compact />
            </div>
            {state.audio?.media.id === track.id && (
              <Text role="status" className="mt-4 text-sm text-gold">
                {statusLabel(state.audio)}
              </Text>
            )}
            <div className="mt-6">
              <RatingWidget id={track.id} label="Rate this track" />
            </div>
            {track.musicVideoId && (
              <ButtonLink
                to={`/music/video/${track.musicVideoId}`}
                variant="outline"
                className="mt-6"
              >
                View music video
              </ButtonLink>
            )}
          </div>
        </div>
        <Text as="h2" className="mb-6 mt-14 font-display text-3xl">
          More tracks to discover
        </Text>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {tracks
            .filter((item) => item.id !== track.id)
            .slice(0, 4)
            .map((item) => (
              <TrackCard key={item.id} track={item} fluid />
            ))}
        </div>
      </div>
    </main>
  )
}
