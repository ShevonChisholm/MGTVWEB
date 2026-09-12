import { Link } from 'react-router'
import { HeroSection } from '@/components/home/HeroSection'
import { ContentRail } from '@/components/home/ContentRail'
import { MGTVPlusBanner } from '@/components/home/MGTVPlusBanner'
import {
  trending,
  featuredShows,
  popularMovies,
  musicVideos,
  featuredArtists,
  sportsHighlights,
  latestNews,
  upcomingEvents,
  originals,
  ContentItem,
} from '@/data/mockContent'

// Continue Watching — landscape with progress
const continueWatching: ContentItem[] = [
  { ...trending[0], duration: '42% watched' },
  { ...trending[5], duration: '78% watched' },
  { ...popularMovies[0], duration: '15% watched' },
  { ...trending[6], duration: '61% watched' },
]

// Recommended For You
const recommendedForYou: ContentItem[] = [
  ...originals.slice(0, 3),
  ...featuredShows.slice(2, 5),
  ...popularMovies.slice(3, 5),
]

export function HomePage() {
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
          linkPrefix="/watch"
        />

        {/* Trending — ranked numbered rail */}
        <ContentRail
          title="Trending Now"
          items={trending}
          cardType="default"
          seeAllHref="/shows"
          ranked
          context="What everyone's watching right now"
        />

        {/* Featured Shows — standard landscape */}
        <ContentRail
          title="Featured Shows"
          items={featuredShows}
          cardType="default"
          seeAllHref="/shows"
        />

        {/* Popular Movies — portrait cinematic */}
        <ContentRail
          title="Popular Movies"
          items={popularMovies}
          cardType="movie"
          seeAllHref="/movies"
          context="Because you watched drama"
        />

        {/* Music Videos — square artwork */}
        <ContentRail
          title="Music Videos"
          items={musicVideos}
          cardType="music"
          seeAllHref="/music"
          linkPrefix="/music/video"
          context="Popular in Jamaica"
        />

        {/* Featured Artists */}
        <ContentRail
          title="Featured Artists"
          items={featuredArtists}
          cardType="artist"
          seeAllHref="/music"
        />

        {/* Sports Highlights */}
        <ContentRail
          title="Sports Highlights"
          items={sportsHighlights}
          cardType="video"
          seeAllHref="/sports"
          linkPrefix="/sports"
          context="Live & Upcoming"
        />

        {/* MGTV+ banner */}
        <MGTVPlusBanner />

        {/* MGTV Originals */}
        <ContentRail
          title="MGTV Originals"
          items={originals}
          cardType="default"
          seeAllHref="/shows"
          goldBorder
        />

        {/* Editorial news split — magazine layout */}
        {featuredNews && (
          <section className="py-8 px-8 md:px-16">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-[#C9A84C]" />
                <h2
                  className="text-[#F5F5F5] text-2xl leading-none"
                  style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}
                >
                  Latest News
                </h2>
              </div>
              <Link to="/news" className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase hover:text-[#E2C36A] transition-colors">
                All News →
              </Link>
            </div>
            {/* Featured editorial split */}
            <div className="grid md:grid-cols-5 gap-0 mb-0">
              <Link to={`/news/${featuredNews.id}`} className="group md:col-span-3 block overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={featuredNews.thumbnail}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-black/20 to-transparent" />
                  {featuredNews.genre && (
                    <div className="absolute top-0 left-0">
                      <span className="block bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1.5">
                        {featuredNews.genre}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <h3
                      className="text-[#F5F5F5] font-bold leading-tight group-hover:text-[#C9A84C] transition-colors"
                      style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem', letterSpacing: '0.02em' }}
                    >
                      {featuredNews.title}
                    </h3>
                    <p className="text-[#A3A3A3] text-xs mt-2 line-clamp-2">{featuredNews.description}</p>
                  </div>
                </div>
              </Link>
              {/* Supporting stories stack */}
              <div className="md:col-span-2 flex flex-col">
                {moreNews.slice(0, 3).map(item => (
                  <Link key={item.id} to={`/news/${item.id}`} className="group flex gap-0 border-b border-white/5 hover:border-[#C9A84C]/15 transition-colors overflow-hidden">
                    <div className="flex-shrink-0 w-28 overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{ minHeight: '80px' }}
                      />
                    </div>
                    <div className="flex-1 p-4 bg-[#0A0A0A] min-w-0">
                      {item.genre && (
                        <span className="text-[#C9A84C] text-[9px] font-bold tracking-[0.2em] uppercase">{item.genre}</span>
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
          title="Recommended For You"
          items={recommendedForYou}
          cardType="default"
          seeAllHref="/shows"
          context="Based on your watch history"
        />

        {/* Upcoming Events */}
        <ContentRail
          title="Upcoming Events"
          items={upcomingEvents}
          cardType="event"
          seeAllHref="/events"
        />
      </div>
    </main>
  )
}
