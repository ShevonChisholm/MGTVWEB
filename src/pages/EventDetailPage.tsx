import { useParams, Link } from 'react-router'
import { eventDetails, extraEventDetails, upcomingEvents } from '@/data/mockContent'
import { Button } from '@/components/ui/Button'
import { ContentRail } from '@/components/home/ContentRail'
import { ShareBar } from '@/components/shared/ShareBar'
import { LikeButton } from '@/components/shared/LikeButton'
import { RatingWidget } from '@/components/shared/RatingWidget'
import { useInteraction } from '@/context/InteractionContext'
import { useToast } from '@/context/ToastContext'

const allEventDetails = { ...eventDetails, ...extraEventDetails }

export function EventDetailPage() {
  const { id } = useParams()
  const { toggleReminder, hasReminder } = useInteraction()
  const { addToast } = useToast()
  const event = id ? allEventDetails[id] : null

  const handleReminder = () => {
    if (!id) return
    toggleReminder(id)
    if (!hasReminder(id)) {
      addToast("Reminder set — we'll notify you 24h before the event", 'success')
    } else {
      addToast('Reminder removed', 'info')
    }
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 flex flex-col items-center justify-center text-center px-8">
        <p className="text-[#6B6B6B] text-lg mb-4">Event not found.</p>
        <Link to="/events" className="text-[#C9A84C] hover:underline text-sm">← Back to Events</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-10 max-w-[1400px] mx-auto">
          <span className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase">{event.genre}</span>
          <h1 className="text-5xl md:text-7xl text-[#F5F5F5] leading-none mt-2 mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-5 text-sm text-[#A3A3A3]">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-10">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl text-[#F5F5F5] mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>About This Event</h2>
            <p className="text-[#A3A3A3] text-base leading-relaxed mb-6">{event.description}</p>
            <div className="mb-8">
              <ShareBar title={event.title} />
            </div>

            {/* Performers */}
            {event.performers.length > 0 && (
              <div>
                <h3 className="text-xl text-[#F5F5F5] mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Performers</h3>
                <div className="flex flex-wrap gap-2">
                  {event.performers.map(p => (
                    <span key={p} className="px-4 py-2 bg-[#141414] border border-white/10 rounded-full text-[#A3A3A3] text-sm hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-colors cursor-pointer">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ticket CTA sidebar */}
          <div>
            <div className="bg-[#141414] rounded-2xl p-6 border border-[#C9A84C]/20 sticky top-24">
              <div className="w-12 h-12 rounded-full bg-[#2A2010] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-[#F5F5F5] font-semibold mb-1">{event.title}</h3>
              <p className="text-[#6B6B6B] text-sm mb-1">{event.date}</p>
              <p className="text-[#6B6B6B] text-sm mb-6">{event.location}</p>
              <Button variant="primary" size="lg" className="w-full justify-center">
                Get Tickets
              </Button>

              {/* Reminder */}
              <button
                onClick={handleReminder}
                className={`w-full mt-3 flex items-center justify-center gap-2 py-3 border text-sm font-semibold transition-all cursor-pointer ${
                  id && hasReminder(id)
                    ? 'border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C]'
                    : 'border-white/12 text-[#6B6B6B] hover:border-white/20 hover:text-[#A3A3A3]'
                }`}
              >
                <svg className="w-4 h-4" fill={id && hasReminder(id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {id && hasReminder(id) ? 'Reminder Set ✓' : 'Set Reminder'}
              </button>

              {/* Like */}
              <div className="mt-3 flex justify-center">
                {id && <LikeButton id={id} baseCount={4720} label="Interested" />}
              </div>

              <p className="text-[#6B6B6B] text-xs text-center mt-3">Powered by MGTV Events</p>

              {/* Rating */}
              <div className="mt-5 pt-5 border-t border-white/6">
                {id && <RatingWidget id={id} label="Rate this event" />}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 -mx-8 md:-mx-16">
          <ContentRail title="More Events" items={upcomingEvents} cardType="event" seeAllHref="/events" />
        </div>
      </div>
    </div>
  )
}
