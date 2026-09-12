import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'

export function MGTVPlusBanner() {
  const navigate = useNavigate()
  return (
    <section className="mx-6 md:mx-16 my-8 rounded-2xl overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #1A1200 0%, #2A2010 40%, #1A1200 100%)'
      }} />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(ellipse at 30% 50%, #C9A84C 0%, transparent 60%)'
      }} />
      {/* Gold border */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-[#C9A84C]/30" />

      <div className="relative px-8 md:px-16 py-12 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded bg-[#C9A84C] flex items-center justify-center">
              <span className="text-[#0A0A0A] font-bold text-[10px]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>M</span>
            </div>
            <span className="text-[#C9A84C] font-bold tracking-[0.25em] text-sm uppercase">MGTV+</span>
          </div>
          <h2 className="text-3xl md:text-5xl text-[#F5F5F5] leading-none mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            Unlock The Full <span className="text-[#C9A84C]">Caribbean</span> Experience
          </h2>
          <p className="text-[#A3A3A3] text-sm md:text-base leading-relaxed">
            Stream exclusive MGTV Originals, premium shows, live events, HD quality, and more — all ad-free. One subscription. Limitless culture.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-xs text-[#A3A3A3]">
            {['Exclusive Originals', 'HD Streaming', 'Live Events', 'Ad-Free', 'Download & Watch'].map(f => (
              <span key={f} className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-[#6B6B6B] text-xs uppercase tracking-wider">Starting from</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[#C9A84C] text-4xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>$7.99</span>
              <span className="text-[#A3A3A3] text-sm">/month</span>
            </div>
          </div>
          <Button variant="primary" size="lg" className="w-full md:w-auto" onClick={() => navigate('/mgtv-plus')}>
            Start Free Trial
          </Button>
          <p className="text-[#6B6B6B] text-xs">No commitment. Cancel anytime.</p>
        </div>
      </div>
    </section>
  )
}
