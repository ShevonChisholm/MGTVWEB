import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { SearchModal } from '@/components/search/SearchModal'
import { NotificationPanel } from '@/components/notifications/NotificationPanel'
import { useInteraction } from '@/context/InteractionContext'
import { CartDrawer } from '@/components/shared/CartDrawer'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shows', to: '/shows' },
  { label: 'Movies', to: '/movies' },
  { label: 'Music', to: '/music' },
  { label: 'Events', to: '/events' },
  { label: 'Shop', to: '/shop' },
]

const moreLinks = [
  { label: 'Awards', to: '/awards', accent: true },
  { label: 'Lifestyle', to: '/lifestyle' },
  { label: 'News', to: '/news' },
  { label: 'Sports', to: '/sports' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)
  const navigate = useNavigate()
  const { cartCount, setCartOpen } = useInteraction()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Global keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setNotifOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-1.5" onClick={closeMobile}>
            <div className="w-7 h-7 rounded bg-[#C9A84C] flex items-center justify-center">
              <span className="text-[#0A0A0A] font-bold text-xs" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>M</span>
            </div>
            <span className="text-[#F5F5F5] font-bold text-lg tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              MG<span className="text-[#C9A84C]">TV</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.to}
                className="px-3 py-1.5 text-sm text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors rounded-md hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(v => !v)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                className="px-3 py-1.5 text-sm text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors rounded-md hover:bg-white/5 flex items-center gap-1 cursor-pointer"
              >
                More
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {moreOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
                  {moreLinks.map(link => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors hover:bg-white/5 border-b border-white/5 last:border-0 ${link.accent ? 'text-[#C9A84C] hover:text-[#E2C36A]' : 'text-[#A3A3A3] hover:text-[#F5F5F5]'}`}
                    >
                      {link.accent && <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse flex-shrink-0" />}
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors cursor-pointer flex items-center gap-1.5 group"
              title="Search (⌘K)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="p-2 text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors cursor-pointer relative"
                title="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A84C] rounded-full text-[#0A0A0A] text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <NotificationPanel
                  onClose={() => setNotifOpen(false)}
                  onMarkAllRead={() => { setUnreadCount(0); setNotifOpen(false) }}
                />
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors cursor-pointer relative"
              title="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A84C] rounded-full text-[#0A0A0A] text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              to="/auth/sign-in"
              className="text-sm text-[#F5F5F5] hover:text-[#C9A84C] transition-colors font-medium"
            >
              Sign In
            </Link>

            {/* Account dropdown */}
            <div className="relative group">
              <Link to="/account" title="Account">
                <button className="p-2 text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </Link>
              {/* Account quick menu on hover */}
              <div className="absolute top-full right-0 mt-1 w-48 bg-[#141414] border border-white/10 rounded-xl overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-xl z-50">
                <Link to="/account" className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors border-b border-white/5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  My Account
                </Link>
                <Link to="/my-list" className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors border-b border-white/5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  My List
                </Link>
                <Link to="/profiles" className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Switch Profile
                </Link>
              </div>
            </div>

            <button onClick={() => navigate('/mgtv-plus')} className="cursor-pointer">
              <Button variant="primary" size="sm">MGTV+</Button>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[#A3A3A3] hover:text-[#F5F5F5] cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0A0A0A]/98 border-t border-white/10 px-6 py-4 flex flex-col gap-2">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.to}
                onClick={closeMobile}
                className="py-2 text-[#A3A3A3] hover:text-[#F5F5F5] text-sm border-b border-white/5"
              >
                {link.label}
              </Link>
            ))}
            {moreLinks.map(link => (
              <Link key={link.label} to={link.to} onClick={closeMobile}
                className={`py-2 text-sm border-b border-white/5 flex items-center gap-2 ${link.accent ? 'text-[#C9A84C]' : 'text-[#A3A3A3] hover:text-[#F5F5F5]'}`}
              >
                {link.accent && <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />}
                {link.label}
              </Link>
            ))}
            <Link to="/my-list" onClick={closeMobile} className="py-2 text-[#A3A3A3] hover:text-[#F5F5F5] text-sm border-b border-white/5">
              My List
            </Link>
            <div className="flex gap-3 pt-3">
              <button
                onClick={() => { setSearchOpen(true); closeMobile() }}
                className="text-sm text-[#A3A3A3] font-medium cursor-pointer"
              >
                Search
              </button>
              <Link to="/auth/sign-in" onClick={closeMobile} className="text-sm text-[#F5F5F5] font-medium">
                Sign In
              </Link>
              <Link to="/mgtv-plus" onClick={closeMobile}>
                <Button variant="primary" size="sm">MGTV+</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Search modal */}
      {searchOpen && (
        <SearchModal onClose={() => setSearchOpen(false)} />
      )}

      {/* Cart drawer */}
      <CartDrawer />
    </>
  )
}
