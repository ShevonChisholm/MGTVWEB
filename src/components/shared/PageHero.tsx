import { Link } from 'react-router'

interface PageHeroProps {
  category: string
  title: string
  description?: string
  image: string
  cta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

export function PageHero({ category, title, description, image, cta, secondaryCta }: PageHeroProps) {
  return (
    <section className="relative w-full h-72 md:h-[420px] overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover object-center" />
      {/* Cinematic gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-[#0A0A0A]/30 to-transparent" />

      <div className="relative h-full flex flex-col justify-end px-8 md:px-16 pb-10 max-w-[1400px] mx-auto">
        <p className="text-[#C9A84C] text-[10px] font-bold tracking-[0.3em] uppercase mb-3">{category}</p>
        <h1
          className="text-6xl md:text-8xl text-[#F5F5F5] leading-none tracking-wide mb-4"
          style={{ fontFamily: 'Bebas Neue, sans-serif' }}
        >
          {title}
        </h1>
        {description && (
          <p className="text-[#A3A3A3] text-sm md:text-base max-w-md leading-relaxed mb-6">{description}</p>
        )}
        {(cta || secondaryCta) && (
          <div className="flex items-center gap-3">
            {cta && (
              <Link
                to={cta.href}
                className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-6 py-2.5 text-sm font-bold tracking-wide hover:bg-[#E2C36A] transition-colors"
              >
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {cta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                to={secondaryCta.href}
                className="inline-flex items-center gap-2 border border-white/20 text-[#F5F5F5] px-6 py-2.5 text-sm font-medium tracking-wide hover:border-white/40 hover:bg-white/5 transition-all"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
