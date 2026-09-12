import { Link } from 'react-router'

const footerLinks: Record<string, { label: string; to: string }[]> = {
  Platform: [
    { label: 'Shows', to: '/shows' },
    { label: 'Movies', to: '/movies' },
    { label: 'Music', to: '/music' },
    { label: 'Sports', to: '/sports' },
    { label: 'News', to: '/news' },
    { label: 'Events', to: '/events' },
    { label: 'MGTV+', to: '/mgtv-plus' },
    { label: 'Awards', to: '/awards' },
  ],
  Account: [
    { label: 'Sign In', to: '/auth/sign-in' },
    { label: 'Sign Up', to: '/auth/register' },
    { label: 'My Account', to: '/account' },
    { label: 'My List', to: '/my-list' },
    { label: 'Switch Profile', to: '/profiles' },
    { label: 'Parental Controls', to: '/parental-controls' },
  ],
  Company: [
    { label: 'About MGTV', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Careers', to: '#' },
    { label: 'Press', to: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Use', to: '/terms' },
    { label: 'Accessibility', to: '#' },
    { label: 'Cookie Policy', to: '#' },
  ],
  Business: [
    { label: 'Partner with MGTV', to: '#' },
    { label: 'Sponsor with MGTV', to: '#' },
    { label: 'Advertise with MGTV', to: '#' },
  ],
}

const socialLinks = [
  { label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { label: 'Twitter/X', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { label: 'YouTube', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { label: 'TikTok', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
]

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/8 mt-12">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-16">
        {/* Logo + tagline */}
        <div className="mb-12">
          <Link to="/" className="flex items-center gap-2 mb-3 w-fit">
            <div className="w-8 h-8 rounded bg-[#C9A84C] flex items-center justify-center">
              <span className="text-[#0A0A0A] font-bold text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>M</span>
            </div>
            <span className="text-[#F5F5F5] font-bold text-2xl tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              MG<span className="text-[#C9A84C]">TV</span>
            </span>
          </Link>
          <p className="text-[#6B6B6B] text-sm max-w-sm">
            The home of Caribbean entertainment. Music, culture, sport and stories — all in one place.
          </p>
          {/* Social links */}
          <div className="flex gap-4 mt-5">
            {socialLinks.map(s => (
              <a key={s.label} href="#" aria-label={s.label}
                className="w-9 h-9 rounded-full bg-[#1E1E1E] hover:bg-[#C9A84C] flex items-center justify-center text-[#A3A3A3] hover:text-[#0A0A0A] transition-all duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d={s.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[#F5F5F5] text-xs font-semibold tracking-[0.15em] uppercase mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-[#6B6B6B] text-sm hover:text-[#C9A84C] transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/8 pt-10 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h4 className="text-[#F5F5F5] text-sm font-semibold mb-1">Stay in the loop</h4>
              <p className="text-[#6B6B6B] text-xs">Get the latest on new releases, events, and Caribbean culture.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 bg-[#1E1E1E] border border-white/10 rounded-md px-4 py-2.5 text-sm text-[#F5F5F5] placeholder-[#6B6B6B] focus:outline-none focus:border-[#C9A84C]/50"
              />
              <button className="px-5 py-2.5 bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold rounded-md hover:bg-[#E2C36A] transition-colors cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">
          <p className="text-[#6B6B6B] text-xs">© 2025 Mining Gold TV (MGTV). All rights reserved.</p>
          <p className="text-[#6B6B6B] text-xs">Jamaica · Trinidad & Tobago · Barbados · Caribbean & Beyond</p>
        </div>
      </div>
    </footer>
  )
}
