import { useState, useEffect, useRef } from "react"
import { Link, NavLink, useLocation } from "react-router"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { SearchModal } from "@/components/search/SearchModal"
import { NotificationPanel } from "@/components/notifications/NotificationPanel"
import { useInteraction } from "@/context/InteractionContext"
import { CartDrawer } from "@/components/shared/CartDrawer"
import { useAppState } from "@/context/AppStateContext"

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shows", to: "/shows" },
  { label: "Movies", to: "/movies" },
  { label: "Music", to: "/music" },
  { label: "Events", to: "/events" },
  { label: "Shop", to: "/shop" },
]
const moreLinks = [
  { label: "Awards", to: "/awards" },
  { label: "Lifestyle", to: "/lifestyle" },
  { label: "News", to: "/news" },
  { label: "Sports", to: "/sports" },
]
const accountLinks = [
  { label: "My Account", to: "/account" },
  { label: "My List", to: "/my-list" },
  { label: "Switch Profile", to: "/profiles" },
  { label: "Sign In", to: "/auth/sign-in" },
]
const linkClass =
  "block rounded-md px-3 py-3 text-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeWidth={2}
        d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
      />
    </svg>
  )
}

export function Navbar() {
  const app = useAppState()
  const unreadCount = app.unread
  const accountLinks =
    app.state.session === "signedIn"
      ? [
          { label: "My Account", to: "/account" },
          { label: "My List", to: "/my-list" },
          { label: "Switch Profile", to: "/profiles" },
          { label: `Notifications (${unreadCount})`, to: "/notifications" },
        ]
      : [
          {
            label:
              app.state.session === "expired"
                ? "Session expired · Sign In"
                : "Sign In",
            to: "/auth/sign-in",
          },
        ]
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const more = useRef<HTMLDivElement>(null)
  const account = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const { cartCount, setCartOpen } = useInteraction()

  useEffect(() => {
    setMobileOpen(false)
    setMoreOpen(false)
    setAccountOpen(false)
    setNotifOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 20)
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape") {
        setMoreOpen(false)
        setAccountOpen(false)
        setNotifOpen(false)
        setMobileOpen(false)
      }
    }
    const outside = (e: PointerEvent) => {
      if (!more.current?.contains(e.target as Node)) setMoreOpen(false)
      if (!account.current?.contains(e.target as Node)) setAccountOpen(false)
    }
    window.addEventListener("scroll", scroll)
    window.addEventListener("keydown", key)
    window.addEventListener("pointerdown", outside)
    return () => {
      window.removeEventListener("scroll", scroll)
      window.removeEventListener("keydown", key)
      window.removeEventListener("pointerdown", outside)
    }
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || mobileOpen
            ? "bg-bg-base/95 backdrop-blur-md"
            : "bg-gradient-to-b from-bg-base to-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
          <Link
            to="/"
            aria-label="MGTV Home"
            className="shrink-0 font-display text-2xl tracking-wider text-text-primary"
          >
            MG
            <Text as="span" className="text-gold">
              TV
            </Text>
          </Link>
          <nav
            aria-label="Main navigation"
            className="hidden flex-1 items-center gap-1 xl:flex"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? "text-gold" : ""}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div
              ref={more}
              className="relative"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget))
                  setMoreOpen(false)
              }}
            >
              <Button
                variant="ghost"
                size="sm"
                aria-expanded={moreOpen}
                aria-controls="more-links"
                onClick={() => setMoreOpen((value) => !value)}
              >
                More
                <svg
                  aria-hidden="true"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2}
                    d={moreOpen ? "m5 15 7-7 7 7" : "m5 9 7 7 7-7"}
                  />
                </svg>
              </Button>
              {moreOpen && (
                <div
                  id="more-links"
                  className="absolute left-0 top-full mt-2 w-44 rounded-xl border border-text-muted/30 bg-bg-surface p-2"
                >
                  {moreLinks.map((link) => (
                    <NavLink key={link.to} to={link.to} className={linkClass}>
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 px-3"
              onClick={() => setSearchOpen(true)}
              aria-label="Search MGTV"
            >
              <SearchIcon />
            </Button>
            <div className="relative hidden xl:block">
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Notifications, ${unreadCount} unread`}
                aria-expanded={notifOpen}
                onClick={() => setNotifOpen((value) => !value)}
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2}
                    d="M18 8a6 6 0 0 0-12 0v6l-2 3h16l-2-3V8Zm-8 12h4"
                  />
                </svg>
                {unreadCount > 0 && (
                  <Text as="span" className="text-xs text-gold">
                    {unreadCount}
                  </Text>
                )}
              </Button>
              {notifOpen && (
                <NotificationPanel onClose={() => setNotifOpen(false)} />
              )}
            </div>
            <div className="hidden xl:block">
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Open cart, ${cartCount} items`}
                onClick={() => setCartOpen(true)}
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2}
                    d="M8 8V6a4 4 0 0 1 8 0v2M5 8h14l1 13H4L5 8Z"
                  />
                </svg>
                {cartCount > 0 && (
                  <Text as="span" className="text-xs text-gold">
                    {cartCount}
                  </Text>
                )}
              </Button>
            </div>
            <div
              ref={account}
              className="relative hidden xl:block"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget))
                  setAccountOpen(false)
              }}
            >
              <Button
                variant="ghost"
                size="sm"
                aria-expanded={accountOpen}
                aria-controls="account-links"
                onClick={() => setAccountOpen((value) => !value)}
              >
                {app.profile?.name ??
                  (app.state.session === "expired" ? "Expired" : "Account")}
              </Button>
              {accountOpen && (
                <div
                  id="account-links"
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-text-muted/30 bg-bg-surface p-2"
                >
                  {accountLinks.map((link) => (
                    <Link key={link.to} to={link.to} className={linkClass}>
                      {link.label}
                    </Link>
                  ))}
                  {app.state.session === "signedIn" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        app.execute({ type: "scenario", session: "guest" })
                      }
                    >
                      Sign out of demo
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="hidden xl:block">
              <ButtonLink to="/mgtv-plus" size="sm">
                MGTV+
              </ButtonLink>
            </div>
            <Link
              to={
                app.state.session === "signedIn" ? "/profiles" : "/auth/sign-in"
              }
              aria-label={
                app.profile
                  ? `Switch profile, current ${app.profile.name}`
                  : "Demo sign in"
              }
              className="p-3 text-text-secondary xl:hidden"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21a7 7 0 0 1 14 0H5Z"
                />
              </svg>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 xl:hidden"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((value) => !value)}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  d={
                    mobileOpen
                      ? "m6 6 12 12M6 18 18 6"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </Button>
          </div>
        </div>
        {mobileOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-text-muted/30 bg-bg-base px-6 py-4 xl:hidden"
          >
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
            <details className="border-y border-text-muted/20 py-2">
              <summary className="cursor-pointer px-3 py-3 text-sm text-text-primary">
                More
              </summary>
              <div className="pl-3">
                {moreLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className={linkClass}>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </details>
            {accountLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </Link>
            ))}
            {app.state.session === "signedIn" && (
              <Button
                variant="ghost"
                onClick={() =>
                  app.execute({ type: "scenario", session: "guest" })
                }
              >
                Sign out of demo
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                setCartOpen(true)
                setMobileOpen(false)
              }}
            >
              Cart ({cartCount})
            </Button>
            <ButtonLink to="/mgtv-plus">MGTV+</ButtonLink>
          </nav>
        )}
      </header>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      <CartDrawer />
    </>
  )
}
