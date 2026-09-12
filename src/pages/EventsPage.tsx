import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { FilterSidebar } from '@/components/shared/FilterSidebar'
import { upcomingEvents } from '@/data/mockContent'

const typeSection = { label: 'Event Type', options: ['All', 'Music Festival', 'Film Premiere', 'Athletics', 'Cultural Festival', 'Awards Ceremony', 'Masterclass'] }
const venueSection = { label: 'Format', options: ['All Venues', 'In-Person', 'Online', 'Hybrid'] }
const ticketSection = { label: 'Tickets', options: ['All', 'Available', 'VIP', 'Free'] }

const featuredEvent = upcomingEvents[0]

function parseDateBlock(date?: string): { month: string; day: string } | null {
  if (!date) return null
  const parts = date.split(' ')
  if (parts.length >= 2) return { month: parts[0].toUpperCase().slice(0, 3), day: parts[1].replace(',', '') }
  return null
}

export function EventsPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? upcomingEvents : upcomingEvents.filter(e => e.genre === active)
  const events = filtered.length ? filtered : upcomingEvents

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* ── FESTIVAL POSTER HERO ── */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ height: 'clamp(480px, 65vh, 640px)' }}>
        {/* Festival crowd background */}
        <img
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80"
          alt="Festival"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Strong dark vignette */}
        <div className="absolute inset-0 bg-black/72" />
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }} />

        {/* Centered poster/ticket element */}
        <div className="relative z-10 text-center px-6" style={{ maxWidth: '480px' }}>
          {/* Top decorative bar */}
          <div className="flex items-center gap-3 mb-5 justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C9A84C]/50" />
            <span className="text-[#C9A84C] text-[9px] font-black tracking-[0.4em] uppercase">MGTV Presents</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C9A84C]/50" />
          </div>

          {/* Main title in giant Bebas */}
          <h1
            className="text-[#F5F5F5] leading-[0.9] mb-3"
            style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(4.5rem, 14vw, 7.5rem)', letterSpacing: '0.05em' }}
          >
            What's On
          </h1>

          <p className="text-[#A3A3A3] text-sm mb-5 tracking-wide">
            Caribbean Events · Festivals · Experiences
          </p>

          {/* Perforated tear line */}
          <div className="flex items-center gap-0 mb-5">
            <div className="w-3 h-3 rounded-full bg-[#0A0A0A] -ml-3 flex-shrink-0" />
            <div className="flex-1 border-t-2 border-dashed border-[#C9A84C]/30" />
            <div className="w-3 h-3 rounded-full bg-[#0A0A0A] -mr-3 flex-shrink-0" />
          </div>

          {/* Event preview row */}
          <div className="flex justify-center gap-6 mb-6 text-xs text-[#6B6B6B]">
            <div className="text-center">
              <div className="text-[#C9A84C] font-bold text-sm">{upcomingEvents.length}</div>
              <div className="tracking-widest uppercase text-[9px]">Events</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-[#C9A84C] font-bold text-sm">Jul–Dec</div>
              <div className="tracking-widest uppercase text-[9px]">2025</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-[#C9A84C] font-bold text-sm">5+</div>
              <div className="tracking-widest uppercase text-[9px]">Islands</div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/events/${featuredEvent.id}`)}
              className="bg-[#C9A84C] text-[#0A0A0A] px-8 py-3 text-sm font-black tracking-widest uppercase hover:bg-[#E2C36A] transition-colors cursor-pointer"
            >
              Get Tickets
            </button>
            <button
              onClick={() => navigate(`/events/${featuredEvent.id}`)}
              className="border border-white/25 text-[#F5F5F5] px-6 py-3 text-sm font-medium hover:border-white/50 transition-all cursor-pointer"
            >
              View Event
            </button>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      </section>

      {/* ── BROWSE ── */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <FilterSidebar sections={[typeSection, venueSection, ticketSection]} active={active} onChange={setActive} />
            <span className="text-[#4A4A4A] text-xs">{events.length} events</span>
          </div>
          <h2 className="text-[#F5F5F5] text-lg hidden md:block" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.08em' }}>What's On</h2>
        </div>

        {/* Block list layout */}
        <div className="space-y-0">
          {events.map(event => {
            const dateBlock = parseDateBlock(event.date)
            return (
              <Link key={event.id} to={`/events/${event.id}`} className="group block">
                <div className="flex items-stretch border-b border-white/5 hover:border-[#C9A84C]/20 transition-colors">
                  {dateBlock ? (
                    <div className="flex-shrink-0 w-20 flex flex-col items-center justify-center py-6 bg-[#C9A84C] group-hover:bg-[#E2C36A] transition-colors">
                      <span className="text-[#0A0A0A] text-[9px] font-black tracking-widest uppercase">{dateBlock.month}</span>
                      <span className="text-[#0A0A0A] text-4xl font-black leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{dateBlock.day}</span>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-2 bg-[#C9A84C]" />
                  )}
                  <div className="flex-shrink-0 w-32 md:w-52 overflow-hidden" style={{ minHeight: '100px' }}>
                    <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center py-5 px-5 md:px-8 bg-[#0A0A0A] min-w-0">
                    {event.genre && <span className="text-[#C9A84C] text-[9px] font-bold tracking-[0.2em] uppercase mb-1">{event.genre}</span>}
                    <h3 className="text-[#F5F5F5] font-bold leading-tight group-hover:text-[#C9A84C] transition-colors text-base md:text-lg truncate" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.02em' }}>
                      {event.title}
                    </h3>
                    {event.location && (
                      <p className="text-[#6B6B6B] text-xs mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 text-[#4ADE80] bg-[#4ADE80]/10">Tickets Available</span>
                      <span className="text-[#C9A84C] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Get Tickets →</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
