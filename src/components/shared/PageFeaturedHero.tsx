import { useNavigate } from 'react-router'
import { Badge } from '@/components/ui/Badge'
import type { ContentItem } from '@/data/mockContent'
import type { ContentBadge } from '@/data/mockContent'

interface PageFeaturedHeroProps {
  item: ContentItem
  subtitle?: string
  primaryCta: { label: string; to: string }
  secondaryCta?: { label: string; to: string }
  badge?: ContentBadge
}

export function PageFeaturedHero({ item, subtitle, primaryCta, secondaryCta, badge }: PageFeaturedHeroProps) {
  const navigate = useNavigate()

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(480px, 68vh, 760px)' }}>
      {/* Cinematic background image */}
      <img
        src={item.thumbnail}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Multi-layer gradient vignette — matches homepage HeroSection */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/85 via-[#0A0A0A]/25 to-transparent" />
      {/* Subtle left edge burn */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0A]/60 to-transparent" />

      {/* Content — bottom-anchored like HeroSection */}
      <div className="relative h-full flex flex-col justify-end pb-14 md:pb-20 px-8 md:px-16 max-w-[1400px] mx-auto">
        <div className="max-w-2xl">
          {/* Metadata row */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {(badge ?? item.badge) && <Badge variant={(badge ?? item.badge)!} />}
            {item.genre && (
              <span className="text-[#A3A3A3] text-xs tracking-widest uppercase">{item.genre}</span>
            )}
            {item.duration && !item.duration.includes('%') && (
              <span className="text-[#6B6B6B] text-xs">{item.duration}</span>
            )}
            {item.year && (
              <span className="text-[#6B6B6B] text-xs">{item.year}</span>
            )}
          </div>

          {/* Eyebrow */}
          {subtitle && (
            <p className="text-[#C9A84C] text-sm font-semibold tracking-[0.2em] uppercase mb-2">
              {subtitle}
            </p>
          )}

          {/* Hero title — Bebas Neue, large */}
          <h1
            className="text-[#F5F5F5] leading-none mb-5 tracking-wider"
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(3.5rem, 9vw, 7.5rem)',
            }}
          >
            {item.title.toUpperCase()}
          </h1>

          {/* Description */}
          {item.description && (
            <p className="text-[#A3A3A3] text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              {item.description}
            </p>
          )}

          {/* CTAs */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => navigate(primaryCta.to)}
              className="inline-flex items-center gap-2.5 bg-[#C9A84C] text-[#0A0A0A] px-7 py-3 text-sm font-bold tracking-wide hover:bg-[#E2C36A] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {primaryCta.label}
            </button>

            {secondaryCta && (
              <button
                onClick={() => navigate(secondaryCta.to)}
                className="inline-flex items-center gap-2.5 border border-white/25 text-[#F5F5F5] px-7 py-3 text-sm font-medium tracking-wide hover:border-white/50 hover:bg-white/6 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {secondaryCta.label}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
    </section>
  )
}
