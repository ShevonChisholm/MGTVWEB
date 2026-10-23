import { useState } from "react"
import { useParams, Link } from "react-router"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import {
  allShowDetails,
  featuredShows,
  episodes,
  catalogById,
} from "@/data/mockContent"
import { MediaCard } from "@/components/home/MediaCard"
import { ButtonLink } from "@/components/ui/Button"
import { ContentRail } from "@/components/home/ContentRail"
import { ShareBar } from "@/components/shared/ShareBar"
import { useSaved } from "@/context/SavedContext"
import { LikeButton } from "@/components/shared/LikeButton"
import { RatingWidget } from "@/components/shared/RatingWidget"
import { useViewing } from "@/hooks/useViewing"
import { Text } from "@/components/ui/Text"

export function ShowDetailPage() {
  const { playableItem, watchPath } = useViewing()
  const { id } = useParams()
  const { isSaved, toggle } = useSaved()
  const show = id ? allShowDetails[id] : null
  const [activeSeason, setActiveSeason] = useState(0)

  if (!show) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 flex flex-col items-center justify-center text-center px-8">
        <p className="text-text-secondary text-lg mb-4">Show not found.</p>
        <Link to="/shows" className="text-[#C9A84C] hover:underline text-sm">
          ← Back to Shows
        </Link>
      </div>
    )
  }

  const season = show.seasons[activeSeason]

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Banner */}
      <div className="relative w-full h-[55vh] min-h-[400px] overflow-hidden">
        <img
          src={show.banner}
          alt={show.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant={show.badge} />
            <span className="text-[#A3A3A3] text-xs tracking-widest uppercase">
              {show.genre}
            </span>
          </div>
          <h1
            className="text-5xl md:text-7xl text-[#F5F5F5] leading-none mb-4"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            {show.title}
          </h1>
          <div className="flex flex-wrap gap-3">
            <ButtonLink size="lg" to={watchPath(catalogById[show.id])!}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {(playableItem(catalogById[show.id])?.progress ?? 0) > 0 &&
              (playableItem(catalogById[show.id])?.progress ?? 0) < 100
                ? "Resume episode"
                : "Watch episode"}
            </ButtonLink>
            <Button
              variant="outline"
              size="lg"
              onClick={() => id && toggle(id)}
            >
              {id && isSaved(id) ? "✓ Saved" : "+ My List"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-10">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Main */}
          <div className="md:col-span-2">
            <p className="text-[#A3A3A3] text-base leading-relaxed mb-6">
              {show.description}
            </p>
            <Text role="note" className="mb-6 text-sm text-text-secondary">
              Sample editorial copy · Credits, artwork and original-production
              status are unconfirmed.
            </Text>

            {/* Like + Rating */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-white/6">
              <LikeButton id={show.id} />
              <RatingWidget id={show.id} label="Rate this show" />
            </div>

            {/* Season tabs */}
            {show.seasons.length > 1 && (
              <div className="flex gap-2 mb-6">
                {show.seasons.map((s, i) => (
                  <button
                    key={s.number}
                    onClick={() => setActiveSeason(i)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      activeSeason === i
                        ? "bg-[#C9A84C] text-[#0A0A0A]"
                        : "bg-[#1E1E1E] text-[#A3A3A3] hover:text-[#F5F5F5]"
                    }`}
                  >
                    Season {s.number}
                  </button>
                ))}
              </div>
            )}

            {/* Episode list */}
            <div className="grid gap-6 sm:grid-cols-2">
              {episodes
                .filter(
                  (ep) =>
                    ep.showId === show.id && ep.seasonNumber === season.number,
                )
                .map((ep) => (
                  <MediaCard key={ep.id} item={ep} fluid />
                ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-[#141414] rounded-xl p-6 border border-white/8">
              <h3 className="text-[#F5F5F5] text-sm font-semibold mb-4 tracking-wider uppercase">
                Cast
              </h3>
              <ul className="space-y-2">
                {show.cast.map((name) => (
                  <li
                    key={name}
                    className="text-[#A3A3A3] text-sm flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#2A2010] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#C9A84C] text-xs font-bold">
                        {name[0]}
                      </span>
                    </div>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Share */}
        <div className="mt-8">
          <ShareBar title={show.title} />
        </div>

        {/* Related */}
        <div className="mt-10">
          <ContentRail
            title="More Shows"
            items={featuredShows}
            cardType="default"
            seeAllHref="/shows"
            seeAllLabel="All shows"
            layout="contained"
          />
        </div>
      </div>
    </div>
  )
}
