import { Button } from '@/components/ui/Button'
import { originals } from '@/data/mockContent'
import { ContentRail } from '@/components/home/ContentRail'

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$7.99',
    period: '/month',
    highlight: false,
    features: ['Full content library', 'HD streaming', 'Exclusive MGTV Originals', 'Live events', 'Ad-free viewing', 'Up to 3 profiles', 'Watch on 2 devices'],
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$59.99',
    period: '/year',
    highlight: true,
    badge: 'Best Value — Save 37%',
    features: ['Everything in Monthly', '4K streaming where available', 'Download & watch offline', 'Up to 5 profiles', 'Watch on 4 devices', 'Early access to new releases', 'Priority support'],
  },
]

const freeVsPremium = [
  { feature: 'Free content', free: true, premium: true },
  { feature: 'MGTV Originals', free: false, premium: true },
  { feature: 'Premium shows & movies', free: false, premium: true },
  { feature: 'HD streaming', free: false, premium: true },
  { feature: 'Ad-free viewing', free: false, premium: true },
  { feature: 'Live events', free: false, premium: true },
  { feature: 'Offline downloads', free: false, premium: true },
  { feature: 'Multiple profiles', free: false, premium: true },
]

export function MGTVPlusPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* Hero */}
      <section className="relative px-8 md:px-16 py-20 md:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, #C9A84C 0%, transparent 70%)'
        }} />
        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded bg-[#C9A84C] flex items-center justify-center">
              <span className="text-[#0A0A0A] font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>M</span>
            </div>
            <span className="text-[#C9A84C] font-bold tracking-[0.3em] text-lg uppercase">MGTV+</span>
          </div>
          <h1 className="text-6xl md:text-8xl text-[#F5F5F5] leading-none mb-6" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            The Full Caribbean Experience
          </h1>
          <p className="text-[#A3A3A3] text-lg leading-relaxed mb-8">
            Unlock exclusive originals, premium content, live events, and HD streaming — all ad-free. One subscription. Limitless culture.
          </p>
          <Button variant="primary" size="lg">Start Your Free Trial</Button>
          <p className="text-[#6B6B6B] text-sm mt-3">No commitment. Cancel anytime.</p>
        </div>
      </section>

      {/* Plans */}
      <section className="px-8 md:px-16 pb-20 max-w-[900px] mx-auto">
        <h2 className="text-3xl text-[#F5F5F5] text-center mb-10" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          Choose Your Plan
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-gradient-to-b from-[#2A2010] to-[#1A1200] border border-[#C9A84C]/50'
                  : 'bg-[#141414] border border-white/10'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-[#0A0A0A] text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <p className="text-[#A3A3A3] text-sm font-medium tracking-wider uppercase">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className={`text-5xl font-bold ${plan.highlight ? 'text-[#C9A84C]' : 'text-[#F5F5F5]'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {plan.price}
                  </span>
                  <span className="text-[#6B6B6B] text-sm">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[#A3A3A3]">
                    <svg className="w-4 h-4 text-[#C9A84C] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.highlight ? 'primary' : 'outline'} size="lg" className="w-full justify-center">
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Free vs Premium comparison */}
      <section className="px-8 md:px-16 pb-20 max-w-[700px] mx-auto">
        <h2 className="text-3xl text-[#F5F5F5] text-center mb-8" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          Free vs MGTV+
        </h2>
        <div className="bg-[#141414] rounded-2xl border border-white/8 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 px-6 py-4 border-b border-white/8">
            <span className="text-[#6B6B6B] text-sm">Feature</span>
            <span className="text-[#A3A3A3] text-sm text-center">Free</span>
            <span className="text-[#C9A84C] text-sm text-center font-semibold">MGTV+</span>
          </div>
          {freeVsPremium.map((row, i) => (
            <div key={row.feature} className={`grid grid-cols-3 px-6 py-4 ${i < freeVsPremium.length - 1 ? 'border-b border-white/5' : ''}`}>
              <span className="text-[#A3A3A3] text-sm">{row.feature}</span>
              <div className="flex justify-center">
                {row.free
                  ? <svg className="w-5 h-5 text-[#4ADE80]" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                  : <svg className="w-5 h-5 text-[#3A3A3A]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                }
              </div>
              <div className="flex justify-center">
                <svg className="w-5 h-5 text-[#C9A84C]" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exclusive content preview */}
      <div className="pb-16">
        <ContentRail title="Exclusive on MGTV+" items={originals} cardType="default" seeAllHref="/shows" goldBorder />
      </div>
    </div>
  )
}
