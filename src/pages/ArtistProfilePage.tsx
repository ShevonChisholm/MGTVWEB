import { useParams, Link } from "react-router"
import { allArtistDetails } from "@/data/mockContent"
import { TrackRow } from "@/components/music/TrackCard"
import { Text } from "@/components/ui/Text"
import { Button } from "@/components/ui/Button"
import { ContentRail } from "@/components/home/ContentRail"
import { ShareBar } from "@/components/shared/ShareBar"
import { useInteraction } from "@/context/InteractionContext"
import { useToast } from "@/context/ToastContext"
import { useCatalog } from "@/hooks/useCatalog"
import { useAppState } from "@/context/AppStateContext"

export function ArtistProfilePage() {
  const { tracks, featuredArtists } = useCatalog()
  const app = useAppState()
  const { id } = useParams()
  const artist = id ? allArtistDetails[id] : null
  const { toggleFollow, isFollowing } = useInteraction()
  const { addToast } = useToast()

  if (!artist) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 flex flex-col items-center justify-center text-center px-8">
        <p className="text-text-secondary text-lg mb-4">Artist not found.</p>
        <Link to="/music" className="text-[#C9A84C] hover:underline text-sm">
          ← Back to Music
        </Link>
      </div>
    )
  }

  const following = id ? isFollowing(id) : false

  const handleFollow = () => {
    if (!id) return
    if (!app.requirePersonal(id)) return
    toggleFollow(id)
    addToast(
      following ? `Unfollowed ${artist.name}` : `Following ${artist.name}`,
      "success",
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* Hero */}
      <div className="relative">
        <div className="h-72 md:h-96 overflow-hidden">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="relative -mt-24 md:-mt-32 flex flex-col md:flex-row items-start md:items-end gap-6 pb-8">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-[#0A0A0A] ring-2 ring-[#C9A84C]/40 flex-shrink-0">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 pb-2">
              <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.25em] uppercase mb-1">
                {artist.genre}
              </p>
              <h1
                className="text-5xl md:text-7xl text-[#F5F5F5] leading-none"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {artist.name}
              </h1>
              <p className="text-text-secondary text-sm mt-1 flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {artist.origin}
              </p>
              <div className="flex gap-3 mt-4">
                <Button
                  variant={following ? "primary" : "outline"}
                  onClick={handleFollow}
                  aria-pressed={following}
                  className={`px-6 py-2.5 text-sm font-black tracking-widest uppercase transition-all cursor-pointer ${
                    following
                      ? "bg-[#C9A84C] text-[#0A0A0A] hover:bg-[#B8963C]"
                      : "border border-white/20 text-[#F5F5F5] hover:border-[#C9A84C]/40 hover:text-[#C9A84C]"
                  }`}
                >
                  {following ? "Following" : "Follow"}
                </Button>
                <ShareBar title={artist.name} compact />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio + videos */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 pb-4">
        <div className="max-w-2xl">
          <h2
            className="text-2xl text-[#F5F5F5] mb-4"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            About
          </h2>
          <p className="text-[#A3A3A3] text-base leading-relaxed">
            {artist.bio}
          </p>
          <Text role="note" className="mt-4 text-sm text-text-secondary">
            Sample editorial copy · Biography, origin and artwork associations
            await owner confirmation.
          </Text>
        </div>
      </div>

      <div className="pb-12">
        <section className="mx-auto max-w-7xl px-8 py-8 md:px-16">
          <Text as="h2" className="mb-4 font-display text-3xl">
            Tracks
          </Text>
          <Text className="mb-4 text-xs text-text-secondary">
            Simulated audio previews · No sound
          </Text>
          {tracks
            .filter((track) => track.artistId === id)
            .map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                ids={tracks
                  .filter((item) => item.artistId === id)
                  .map((item) => item.id)}
                origin={`${artist.name} / Tracks`}
              />
            ))}
          {!tracks.some((track) => track.artistId === id) && (
            <Text className="text-sm text-text-secondary">
              No sample tracks for this artist yet.
            </Text>
          )}
        </section>
        <ContentRail
          title="Music Videos"
          items={artist.videos}
          cardType="video"
          seeAllHref="/music"
          seeAllLabel="All videos"
        />
        <ContentRail
          title="Related Artists"
          items={featuredArtists}
          cardType="artist"
          seeAllHref="/music?view=artists"
          seeAllLabel="All artists"
        />
      </div>
    </div>
  )
}
