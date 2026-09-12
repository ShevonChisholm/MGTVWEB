import { useParams, Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { movieDetails, extraMovieDetails, popularMovies } from '@/data/mockContent'
import { ContentRail } from '@/components/home/ContentRail'
import { ShareBar } from '@/components/shared/ShareBar'
import { useSaved } from '@/context/SavedContext'
import { LikeButton } from '@/components/shared/LikeButton'
import { RatingWidget } from '@/components/shared/RatingWidget'

const allMovieDetails = { ...movieDetails, ...extraMovieDetails }

export function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isSaved, toggle } = useSaved()
  const movie = id ? allMovieDetails[id] : null

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 flex flex-col items-center justify-center text-center px-8">
        <p className="text-[#6B6B6B] text-lg mb-4">Movie not found.</p>
        <Link to="/movies" className="text-[#C9A84C] hover:underline text-sm">← Back to Movies</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Banner */}
      <div className="relative w-full h-[60vh] min-h-[420px] overflow-hidden">
        <img src={movie.banner} alt={movie.title} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-10 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant={movie.badge} />
            <span className="text-[#A3A3A3] text-xs tracking-widest uppercase">{movie.genre}</span>
            <span className="text-[#6B6B6B] text-xs">{movie.year}</span>
            <span className="text-[#6B6B6B] text-xs">{movie.duration}</span>
          </div>
          <h1 className="text-5xl md:text-7xl text-[#F5F5F5] leading-none mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {movie.title}
          </h1>
          <div className="flex gap-3 flex-wrap">
            <Button variant="primary" size="lg" onClick={() => navigate(`/watch/${movie.id}`)}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Watch Now
            </Button>
            <Button variant="outline" size="lg">▷ Trailer</Button>
            <Button variant="outline" size="lg" onClick={() => id && toggle(id)}>
              {id && isSaved(id) ? '✓ Saved' : '+ My List'}
            </Button>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-10">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <p className="text-[#A3A3A3] text-base leading-relaxed mb-6">{movie.description}</p>
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-white/6">
              <LikeButton id={movie.id} baseCount={1563} />
              <RatingWidget id={movie.id} label="Rate this film" />
            </div>
            <ShareBar title={movie.title} />
          </div>
          <div className="space-y-6">
            <div className="bg-[#141414] rounded-xl p-6 border border-white/8">
              <dl className="space-y-3">
                {[
                  { label: 'Director', value: movie.director },
                  { label: 'Genre', value: movie.genre },
                  { label: 'Year', value: String(movie.year) },
                  { label: 'Duration', value: movie.duration },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-[#6B6B6B] text-xs uppercase tracking-wider">{label}</dt>
                    <dd className="text-[#F5F5F5] text-sm mt-0.5">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="bg-[#141414] rounded-xl p-6 border border-white/8">
              <h3 className="text-[#F5F5F5] text-sm font-semibold mb-3 uppercase tracking-wider">Cast</h3>
              <ul className="space-y-2">
                {movie.cast.map(name => (
                  <li key={name} className="text-[#A3A3A3] text-sm flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#2A2010] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#C9A84C] text-[10px] font-bold">{name[0]}</span>
                    </div>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 -mx-8 md:-mx-16">
          <ContentRail title="More Movies" items={popularMovies} cardType="default" seeAllHref="/movies" />
        </div>
      </div>
    </div>
  )
}
