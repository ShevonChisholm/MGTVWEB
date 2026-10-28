import ScreenTransition from "@/components/shared/ScreenTransition";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Link, Outlet, useLocation } from "react-router"

const panels = [
  {
    img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80",
    quote: "Pull up a seat.",
    sub: "Explore Jamaican and Caribbean stories in the sample MGTV collection.",
  },
  {
    img: "https://images.unsplash.com/photo-1700720711254-602cb6b8468d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80",
    quote: "A different island. Another perspective.",
    sub: "Series, films and cultural stories to explore in this prototype.",
  },
  {
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80",
    quote: "Find a rhythm to return to.",
    sub: "Browse sample tracks, videos and artist profiles.",
  },
]

const panel = panels[Math.floor(Math.random() * panels.length)]

export function AuthLayout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Left cinematic panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden flex-shrink-0">
        <img
          src={panel.img}
          alt="MGTV"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]/60" />

        {/* Top logo */}
        <div className="relative z-10 p-10">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <BrandLogo className="h-16 w-32" />
          </Link>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 mt-auto p-10 pb-14">
          <div className="h-0.5 w-10 bg-[#C9A84C] mb-6" />
          <p
            className="text-white text-3xl font-bold leading-tight mb-2"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            {panel.quote}
          </p>
          <p className="text-text-primary text-sm leading-relaxed max-w-xs">
            {panel.sub}
          </p>

          {/* Content preview chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            {["Drama", "Music", "Sports", "Culture", "Events", "News"].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-white/70 text-xs"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-white/8">
          <Link to="/" className="flex items-center gap-1.5">
            <BrandLogo className="h-10 w-20" />
          </Link>
          <Link
            to="/"
            className="text-text-secondary text-sm hover:text-[#A3A3A3] transition-colors"
          >
            ← Browse
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[400px]">
            <ScreenTransition screenKey={pathname}><Outlet /></ScreenTransition>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/5 text-center lg:text-left">
          <p className="text-text-secondary text-xs">
            © {new Date().getFullYear()} Mining Gold TV (MGTV).{" "}
            <Link
              to="/privacy"
              className="hover:text-text-secondary transition-colors"
            >
              Privacy
            </Link>
            {" · "}
            <Link
              to="/terms"
              className="hover:text-text-secondary transition-colors"
            >
              Terms
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
