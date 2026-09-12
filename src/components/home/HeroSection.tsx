import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const heroSlides = [
  {
    id: 1,
    title: 'ISLAND CHRONICLES',
    subtitle: 'MGTV Original Series',
    description: 'A sweeping saga of love, power, and identity across the Caribbean islands — five generations, one unforgettable story.',
    image: 'https://images.unsplash.com/photo-1700720711254-602cb6b8468d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBjYXJpYmJlYW4lMjBuaWdodCUyMGVudGVydGFpbm1lbnQlMjBzdGFnZSUyMGNvbmNlcnQlMjBkcmFtYXRpY3xlbnwxfHx8fDE3ODg4Mjg0MjV8MA&ixlib=rb-4.1.0&q=80&w=1920',
    badge: 'exclusive' as const,
    genre: 'Drama · Series',
    rating: 'TV-14',
    watchTo: '/shows/t1',
    infoTo: '/shows/t1',
  },
  {
    id: 2,
    title: 'RIDDIM NATION',
    subtitle: 'Live Concert Experience',
    description: 'The biggest names in reggae and dancehall unite for one historic night. Stream the full concert exclusively on MGTV+.',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBmZXN0aXZhbCUyMGNyb3dkJTIwc3RhZ2UlMjBsaWdodHN8ZW58MXx8fHwxNzg4ODI4NDMzfDA&ixlib=rb-4.1.0&q=80&w=1920',
    badge: 'premium' as const,
    genre: 'Music · Live Event',
    rating: 'TV-PG',
    watchTo: '/music',
    infoTo: '/music',
  },
  {
    id: 3,
    title: 'GOLDEN MILE',
    subtitle: 'MGTV Sports Documentary',
    description: 'The untold story of Jamaica\'s greatest sprinters — a documentary about sacrifice, glory, and the pursuit of gold.',
    image: 'https://images.unsplash.com/photo-1763639700615-225fe7fdffff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjayUyMGZpZWxkJTIwYXRobGV0ZSUyMHNwcmludCUyMHN0YWRpdW18ZW58MXx8fHwxNzg4ODI4NDMyfDA&ixlib=rb-4.1.0&q=80&w=1920',
    badge: 'new' as const,
    genre: 'Sports · Documentary',
    rating: 'TV-G',
    watchTo: '/movies/m2',
    infoTo: '/sports',
  },
]

export function HeroSection() {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const slide = heroSlides[active]

  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={s.image} alt={s.title} className="w-full h-full object-cover object-center" />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-[#0A0A0A]/20 to-transparent" />

      <div className="relative h-full flex flex-col justify-end pb-20 px-8 md:px-16 max-w-[1400px] mx-auto">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant={slide.badge} />
            <span className="text-[#A3A3A3] text-xs tracking-widest uppercase">{slide.genre}</span>
            <span className="text-[#6B6B6B] text-xs">{slide.rating}</span>
          </div>

          <p className="text-[#C9A84C] text-sm font-semibold tracking-[0.2em] uppercase mb-2">
            {slide.subtitle}
          </p>

          <h1
            className="text-6xl md:text-8xl lg:text-9xl text-[#F5F5F5] leading-none mb-5 tracking-wider"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            {slide.title}
          </h1>

          <p className="text-[#A3A3A3] text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            {slide.description}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Button variant="primary" size="lg" onClick={() => navigate(slide.watchTo)}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate(slide.infoTo)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </Button>
          </div>
        </div>

        <div className="absolute right-8 md:right-16 bottom-20 flex flex-col gap-2">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`w-1 rounded-full transition-all duration-300 cursor-pointer ${
                i === active ? 'h-8 bg-[#C9A84C]' : 'h-4 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
    </section>
  )
}
