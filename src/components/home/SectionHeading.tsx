import { Link } from 'react-router'

interface SectionHeadingProps {
  title: string
  seeAllHref?: string
}

export function SectionHeading({ title, seeAllHref = '/' }: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between mb-4 px-8 md:px-16">
      <h2
        className="text-2xl md:text-3xl text-[#F5F5F5] tracking-wide"
        style={{ fontFamily: 'Bebas Neue, sans-serif' }}
      >
        {title}
      </h2>
      <Link
        to={seeAllHref}
        className="text-xs text-[#C9A84C] hover:text-[#E2C36A] font-semibold tracking-widest uppercase transition-colors flex items-center gap-1"
      >
        See All
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}
