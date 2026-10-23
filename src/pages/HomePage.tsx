import { Link } from "react-router"
import { HeroSection } from "@/components/home/HeroSection"
import { ContentRail } from "@/components/home/ContentRail"
import { MGTVPlusBanner } from "@/components/home/MGTVPlusBanner"
import { useCatalog } from "@/hooks/useCatalog"
import { useAppState } from "@/context/AppStateContext"
import type { ContentItem } from "@/data/mockContent"

export function HomePage() {
  const {
    trending,
    featuredShows,
    popularMovies,
    musicVideos,
    tracks,
    featuredArtists,
    sportsHighlights,
    latestNews,
    upcomingEvents,
    originals,
    continueWatching,
  } = useCatalog()
  const app = useAppState()
  const preferences = app.profile?.preferences
  const recommendedForYou = [...originals, ...featuredShows, ...popularMovies]
    .filter(
      (item, index, items) =>
        items.findIndex((i) => i.id === item.id) === index,
    )
    .sort((a, b) => {
      const score = (item: ContentItem) =>
        Number(preferences?.regions.includes(item.region ?? "")) +
        Number(preferences?.genres.some((g) => item.genre?.includes(g)))
      return score(b) - score(a)
    })
    .slice(0, 8)
  const [featuredNews, ...moreNews] = latestNews

  return (
    <main>
      <HeroSection />
      <div className="mt-2 space-y-2">
        {/* Continue Watching — ContinueWatchingCard with progress bars */}
        <ContentRail
          title="Continue Watching"
          items={continueWatching}
          cardType="continueWatching"
          seeAllHref="/my-list"
          seeAllLabel="My List"
          context="Demo progress for this profile"
          linkPrefix="/watch"
        />

        {/* Trending — ranked numbered rail */}
        <ContentRail
          title="In focus"
          items={trending}
          cardType="default"
          seeAllHref="/shows"
          seeAllLabel="Browse shows"
          context="A selection from the sample catalog."
        />

        {/* Featured Shows — standard landscape */}
        <ContentRail
          title="Series in the spotlight"
          items={featuredShows}
          cardType="default"
          seeAllHref="/shows"
          seeAllLabel="All shows"
        />

        {/* Popular Movies — portrait cinematic */}
        <ContentRail
          title="Tonight’s watchlist"
          items={popularMovies}
          cardType="movie"
          seeAllHref="/movies"
          seeAllLabel="All movies"
          context="Caribbean cinema selections"
        />

        {/* Music Videos — square artwork */}
        <ContentRail
          title="Music Videos"
          items={musicVideos}
          cardType="music"
          seeAllHref="/music"
          seeAllLabel="All videos"
          linkPrefix="/music/video"
          context="Selected Caribbean music videos"
        />

        <ContentRail
          title="Tracks to Discover"
          items={tracks}
          seeAllHref="/music?view=tracks"
          seeAllLabel="All tracks"
          context="Audio tracks · Simulated previews, no sound"
        />
        {/* Featured Artists */}
        <ContentRail
          title="Artists to explore"
          items={featuredArtists}
          cardType="artist"
          seeAllHref="/music?view=artists"
          seeAllLabel="All artists"
        />

        {/* Sports Highlights */}
        <ContentRail
          title="Sports Highlights"
          items={sportsHighlights}
          cardType="video"
          seeAllHref="/sports"
          seeAllLabel="All sports"
          linkPrefix="/sports"
          context="From the sample sports archive"
        />

        {/* MGTV+ banner */}
        <MGTVPlusBanner />

        {/* MGTV Originals */}
        <ContentRail
          title="From the MGTV+ collection"
          items={originals}
          cardType="default"
          seeAllHref="/shows"
          seeAllLabel="Browse shows"
          goldBorder
        />

        {/* Editorial news split — magazine layout */}
        {featuredNews && (
          <section className="mx-auto max-w-7xl py-8 px-6 md:px-16">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-[#C9A84C]" />
                <h2
                  className="text-[#F5F5F5] text-2xl leading-none"
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  The current
                </h2>
              </div>
              <Link
                to="/news"
                className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase hover:text-[#E2C36A] transition-colors"
              >
                All news
              </Link>
            </div>
            {/* Featured editorial split */}
            <div className="grid md:grid-cols-5 gap-0 mb-0">
              <Link
                to={`/news/${featuredNews.id}`}
                className="group md:col-span-3 block overflow-hidden"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={featuredNews.thumbnail}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-black/20 to-transparent" />
                  {featuredNews.genre && (
                    <div className="absolute top-0 left-0">
                      <span className="block bg-[#C9A84C] text-[#0A0A0A] text-xs font-black tracking-[0.2em] uppercase px-3 py-1.5">
                        {featuredNews.genre}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <h3
                      className="text-[#F5F5F5] font-bold leading-tight group-hover:text-[#C9A84C] transition-colors"
                      style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: "1.6rem",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {featuredNews.title}
                    </h3>
                    <p className="text-[#A3A3A3] text-xs mt-2 line-clamp-2">
                      {featuredNews.description}
                    </p>
                  </div>
                </div>
              </Link>
              {/* Supporting stories stack */}
              <div className="md:col-span-2 flex flex-col">
                {moreNews.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.id}`}
                    className="group flex gap-0 border-b border-white/5 hover:border-[#C9A84C]/15 transition-colors overflow-hidden"
                  >
                    <div className="flex-shrink-0 w-28 overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{ minHeight: "80px" }}
                      />
                    </div>
                    <div className="flex-1 p-4 bg-[#0A0A0A] min-w-0">
                      {item.genre && (
                        <span className="text-[#C9A84C] text-xs font-bold tracking-[0.2em] uppercase">
                          {item.genre}
                        </span>
                      )}
                      <h4 className="text-[#F5F5F5] text-xs font-semibold mt-0.5 leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recommended For You */}
        <ContentRail
          title="More to Discover"
          items={recommendedForYou}
          cardType="default"
          seeAllHref="/shows"
          seeAllLabel="Browse shows"
          context={
            preferences?.genres.length && preferences?.regions.length
              ? `For ${app.profile?.name} · Based on selected genres and regions`
              : preferences?.genres.length
                ? `For ${app.profile?.name} · Based on selected genres`
                : preferences?.regions.length
                  ? `For ${app.profile?.name} · Based on selected regions`
                  : "Editorial selections from the sample catalog"
          }
        />

        {/* Upcoming Events */}
        <ContentRail
          title="Events & Experiences"
          context="Sample schedule · September 2026"
          items={upcomingEvents}
          cardType="event"
          seeAllHref="/events"
          seeAllLabel="All events"
        />
      </div>
    </main>
  )
}
