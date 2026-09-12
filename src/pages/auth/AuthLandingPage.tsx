import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'

export function AuthLandingPage() {
  return (
    <div className="text-center">
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#C9A84C] flex items-center justify-center shadow-[0_0_40px_rgba(201,168,76,0.3)]">
          <span className="text-[#0A0A0A] font-bold text-3xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>M</span>
        </div>
      </div>

      <h1 className="text-5xl text-[#F5F5F5] mb-3 leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
        Welcome to MGTV
      </h1>
      <p className="text-[#6B6B6B] text-sm leading-relaxed mb-10 max-w-xs mx-auto">
        The home of Caribbean entertainment. Stream exclusive originals, music, sports, and more.
      </p>

      <div className="space-y-3">
        <Link to="/auth/register" className="block">
          <Button variant="primary" size="lg" className="w-full justify-center">
            Create Free Account
          </Button>
        </Link>
        <Link to="/auth/sign-in" className="block">
          <Button variant="outline" size="lg" className="w-full justify-center">
            Sign In
          </Button>
        </Link>
      </div>

      <div className="mt-8 pt-8 border-t border-white/8">
        <Link to="/" className="text-[#6B6B6B] text-sm hover:text-[#A3A3A3] transition-colors">
          Continue browsing without an account →
        </Link>
      </div>

      {/* Feature highlights */}
      <div className="mt-10 grid grid-cols-3 gap-4 text-center">
        {[
          { icon: '🎬', label: 'Exclusive Originals' },
          { icon: '🎵', label: 'Caribbean Music' },
          { icon: '🏆', label: 'Live Sports' },
        ].map(f => (
          <div key={f.label} className="p-3 bg-[#141414] border border-white/5 rounded-xl">
            <div className="text-xl mb-1">{f.icon}</div>
            <p className="text-[#6B6B6B] text-[10px] leading-tight">{f.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
