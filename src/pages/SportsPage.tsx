import { useState } from 'react'
import { useNavigate } from 'react-router'
import { FilterSidebar } from '@/components/shared/FilterSidebar'
import { ContentRail } from '@/components/home/ContentRail'
import { sportsHighlights } from '@/data/mockContent'

const sportSection = { label: 'Sport', options: ['All', 'Track & Field', 'Football', 'Cricket', 'Tennis', 'Basketball'] }
const statusSection = { label: 'Match Status', options: ['All Matches', 'Live', 'Upcoming', 'Replays'] }
const featuredHighlight = sportsHighlights[0]

const STATS = [
  { value: '5', label: 'Gold Medals' },
  { value: '3', label: 'World Records' },
  { value: '12', label: 'Live Streams' },
  { value: '47', label: 'Highlights' },
]

export function SportsPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? sportsHighlights : sportsHighlights.filter(s => s.genre === active)

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* ── BROADCAST SPLIT HERO ── */}
      <section className="relative overflow-hidden flex" style={{ height: 'clamp(480px, 65vh, 640px)' }}>
        {/* Left: Full bleed sports image */}
        <div className="absolute left-0 top-0 bottom-0 w-full md:w-3/5">
          <img
            src="https://images.unsplash.com/photo-1763639700615-225fe7fdffff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80"
            alt="Sports action"
            className="w-full h-full object-cover object-center"
          />
          {/* Blend into right panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#060606]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent md:hidden" />
        </div>

        {/* Right: Dark broadcast panel */}
        <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-2/5 bg-[#060606] flex-col justify-center px-10 border-l border-white/5">
          {/* LIVE badge */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex items-center gap-1.5 bg-[#EF4444]/15 border border-[#EF4444]/30 px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
              <span className="text-[#EF4444] text-[10px] font-black tracking-[0.25em] uppercase">Live Now</span>
            </div>
          </div>

          <h2
            className="text-[#F5F5F5] leading-none mb-2"
            style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3.5rem', letterSpacing: '0.05em' }}
          >
            In The Zone
          </h2>
          <p className="text-[#6B6B6B] text-sm leading-relaxed mb-8 max-w-xs">
            Highlights, athlete stories, live event coverage, and the sporting moments that define a generation.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2 mb-8">
            {STATS.map(stat => (
              <div key={stat.label} className="bg-[#0E0E0E] border border-white/6 p-3">
                <div
                  className="text-[#C9A84C] leading-none"
                  style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.2rem' }}
                >
                  {stat.value}
                </div>
                <div className="text-[#4A4A4A] text-[10px] uppercase tracking-widest mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/watch/${featuredHighlight.id}`)}
              className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-5 py-2.5 text-sm font-black hover:bg-[#E2C36A] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Watch Live
            </button>
            <button
              onClick={() => navigate('/events')}
              className="border border-white/20 text-[#A3A3A3] px-5 py-2.5 text-sm font-medium hover:border-white/40 transition-all cursor-pointer"
            >
              Schedule
            </button>
          </div>
        </div>

        {/* Mobile: overlay text */}
        <div className="md:hidden absolute bottom-0 inset-x-0 p-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
            <span className="text-[#EF4444] text-[10px] font-black tracking-widest uppercase">Live Now</span>
          </div>
          <h2 className="text-[#F5F5F5] text-5xl mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>In The Zone</h2>
          <button onClick={() => navigate(`/watch/${featuredHighlight.id}`)} className="bg-[#C9A84C] text-[#0A0A0A] px-5 py-2.5 text-sm font-black cursor-pointer">Watch Now</button>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      </section>

      {/* ── BROWSE ── */}
      <div className="max-w-[1400px] mx-auto pb-16">
        <div className="flex items-center gap-4 px-8 md:px-16 py-6">
          <FilterSidebar sections={[sportSection, statusSection]} active={active} onChange={setActive} />
          <span className="text-[#4A4A4A] text-xs">{(filtered.length || sportsHighlights.length)} clips</span>
        </div>
        <ContentRail title="Latest Highlights" items={filtered.length ? filtered : sportsHighlights} cardType="video" seeAllHref="/sports" linkPrefix="/sports" context="Popular in Jamaica" />
        <ContentRail title="Athlete Interviews" items={[...sportsHighlights].reverse()} cardType="video" seeAllHref="/sports" linkPrefix="/sports" />
        <ContentRail title="Top Performances" items={sportsHighlights.slice(0, 6)} cardType="video" seeAllHref="/sports" linkPrefix="/sports" ranked context="This week's rankings" />
      </div>
    </div>
  )
}
