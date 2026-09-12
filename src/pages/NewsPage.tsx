import { useState } from 'react'
import { Link } from 'react-router'
import { FilterSidebar } from '@/components/shared/FilterSidebar'
import { latestNews } from '@/data/mockContent'

const categories = ['All', 'Entertainment', 'Sports', 'Music', 'Regional News', 'Current Affairs', 'Business']
const featuredStory = latestNews[0]
const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

export function NewsPage() {
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? latestNews : latestNews.filter(n => n.genre === active)
  const [featured, ...rest] = filtered.length ? filtered : latestNews

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* ── NEWSPAPER MASTHEAD HERO ── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(480px, 65vh, 640px)' }}>
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Top masthead bar */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-8 md:px-16 py-4 border-b border-white/8 z-10">
          <span
            className="text-[#F5F5F5] tracking-[0.4em]"
            style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem' }}
          >
            THE CURRENT
          </span>
          <span className="text-[#3A3A3A] text-[10px] hidden md:block">{TODAY}</span>
          <span className="text-[#C9A84C] text-[10px] font-bold tracking-[0.2em] uppercase">Caribbean Edition</span>
        </div>

        {/* Main editorial split */}
        <div className="absolute inset-0 flex mt-14">
          {/* Left: Editorial text column */}
          <div className="flex flex-col justify-center px-8 md:px-16 py-8 w-full md:w-1/2 border-r border-white/6">
            <span className="text-[#C9A84C] text-[9px] font-black tracking-[0.3em] uppercase mb-4 block">
              Breaking · {featuredStory.genre}
            </span>

            <h2
              className="text-[#F5F5F5] leading-[1.05] mb-5"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', letterSpacing: '0.02em' }}
            >
              {featuredStory.title}
            </h2>

            {/* Rule */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-white/8" />
              <span className="text-[#3A3A3A] text-[10px] uppercase tracking-widest flex-shrink-0">
                {featuredStory.description}
              </span>
              <div className="h-px w-8 bg-white/8" />
            </div>

            <p className="text-[#6B6B6B] text-sm leading-relaxed mb-6 max-w-sm line-clamp-3">
              Caribbean athletes and artists continue to dominate the global stage, with record-breaking performances capturing international attention and inspiring the next generation across the islands.
            </p>

            <Link
              to={`/news/${featuredStory.id}`}
              className="inline-flex items-center gap-2 text-[#C9A84C] text-sm font-bold hover:text-[#E2C36A] transition-colors group"
            >
              Read Full Story
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Mini headlines */}
            <div className="mt-8 space-y-3 border-t border-white/6 pt-5">
              {latestNews.slice(1, 3).map(item => (
                <Link key={item.id} to={`/news/${item.id}`} className="flex items-start gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0 mt-1.5" />
                  <span className="text-[#6B6B6B] text-xs leading-snug group-hover:text-[#A3A3A3] transition-colors">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Editorial photograph */}
          <div className="hidden md:block relative overflow-hidden flex-1">
            <img
              src={featuredStory.thumbnail}
              alt={featuredStory.title}
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(30%) contrast(1.1)' }}
            />
            {/* Gold color wash overlay */}
            <div className="absolute inset-0 bg-[#C9A84C]/8 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050505]/60" />
            {/* Category label on image */}
            <div className="absolute bottom-0 inset-x-0 p-6">
              <span className="bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1.5">
                {featuredStory.genre}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom horizontal rule */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />
      </section>

      {/* ── BROWSE ── */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <FilterSidebar filters={categories} active={active} onChange={setActive} title="Category" />
            <span className="text-[#4A4A4A] text-xs">{filtered.length} stories</span>
          </div>
          <h2 className="text-[#F5F5F5] text-lg hidden md:block" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.08em' }}>Latest Stories</h2>
        </div>

        {/* Editorial split feature */}
        {featured && (
          <Link to={`/news/${featured.id}`} className="group block mb-10">
            <div className="grid md:grid-cols-5 gap-0 overflow-hidden">
              <div className="md:col-span-3 relative overflow-hidden" style={{ minHeight: '260px' }}>
                <img src={featured.thumbnail} alt={featured.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
                {featured.genre && (
                  <div className="absolute top-0 left-0">
                    <span className="block bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1.5">{featured.genre}</span>
                  </div>
                )}
              </div>
              <div className="md:col-span-2 bg-[#0E0E0E] p-8 flex flex-col justify-center border border-white/5 group-hover:border-[#C9A84C]/20 transition-colors">
                <span className="text-[#C9A84C] text-[10px] font-bold tracking-[0.25em] uppercase mb-3">Featured Story</span>
                <h2 className="text-[#F5F5F5] leading-tight group-hover:text-[#C9A84C] transition-colors" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', letterSpacing: '0.02em' }}>
                  {featured.title}
                </h2>
                <p className="text-[#6B6B6B] text-sm mt-4 leading-relaxed line-clamp-3">{featured.description}</p>
                <span className="text-[#C9A84C] text-sm font-semibold mt-6 flex items-center gap-1.5">
                  Read Story
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Magazine grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {rest.map(item => (
            <Link key={item.id} to={`/news/${item.id}`} className="group overflow-hidden">
              <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' }}>
                <img src={item.thumbnail} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-black/10 to-transparent" />
                {item.genre && (
                  <div className="absolute top-0 left-0">
                    <span className="block bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-black tracking-[0.2em] uppercase px-2 py-1">{item.genre}</span>
                  </div>
                )}
              </div>
              <div className="p-5 bg-[#0A0A0A] border border-white/5 group-hover:border-[#C9A84C]/15 transition-colors">
                <h3 className="text-[#F5F5F5] font-bold leading-tight line-clamp-2 group-hover:text-[#C9A84C] transition-colors" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', letterSpacing: '0.02em' }}>
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[#4A4A4A] text-[10px] uppercase tracking-widest">{item.date ?? 'Caribbean News'}</span>
                  <span className="text-[#C9A84C] text-[10px] font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">READ →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
