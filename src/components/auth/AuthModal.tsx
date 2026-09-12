import { useState } from 'react'
import { Button } from '@/components/ui/Button'

type AuthView = 'signin' | 'signup' | 'forgot'

interface AuthModalProps {
  initialView?: AuthView
  onClose: () => void
}

export function AuthModal({ initialView = 'signin', onClose }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(initialView)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="relative w-full max-w-md bg-[#141414] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Gold top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#C9A84C] to-[#E2C36A]" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors cursor-pointer p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-8 py-8">
          {/* Logo */}
          <div className="flex items-center gap-1.5 mb-8">
            <div className="w-6 h-6 rounded bg-[#C9A84C] flex items-center justify-center">
              <span className="text-[#0A0A0A] font-bold text-xs" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>M</span>
            </div>
            <span className="text-[#F5F5F5] font-bold text-base tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              MG<span className="text-[#C9A84C]">TV</span>
            </span>
          </div>

          {view === 'forgot' ? (
            <>
              <h2 className="text-2xl text-[#F5F5F5] mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Reset Password</h2>
              <p className="text-[#6B6B6B] text-sm mb-6">Enter your email and we'll send a reset link.</p>
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-[#2A2010] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[#F5F5F5] font-medium">Check your inbox</p>
                  <p className="text-[#6B6B6B] text-sm mt-1">A reset link has been sent to {email}</p>
                  <button onClick={() => setView('signin')} className="text-[#C9A84C] text-sm mt-4 hover:underline cursor-pointer">
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
                  <Button variant="primary" size="lg" className="w-full justify-center" type="submit">
                    Send Reset Link
                  </Button>
                  <button type="button" onClick={() => setView('signin')} className="text-[#6B6B6B] text-sm hover:text-[#C9A84C] transition-colors cursor-pointer w-full text-center">
                    ← Back to Sign In
                  </button>
                </form>
              )}
            </>
          ) : view === 'signin' ? (
            <>
              <h2 className="text-3xl text-[#F5F5F5] mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Welcome Back</h2>
              <p className="text-[#6B6B6B] text-sm mb-6">Sign in to your MGTV account.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
                <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
                <button type="button" onClick={() => setView('forgot')} className="text-[#C9A84C] text-xs hover:underline cursor-pointer block text-right -mt-2">
                  Forgot password?
                </button>
                <Button variant="primary" size="lg" className="w-full justify-center" type="submit">
                  Sign In
                </Button>
              </form>
              <div className="mt-6 pt-6 border-t border-white/8 text-center">
                <p className="text-[#6B6B6B] text-sm">
                  Don't have an account?{' '}
                  <button onClick={() => setView('signup')} className="text-[#C9A84C] hover:underline cursor-pointer font-medium">
                    Sign Up
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl text-[#F5F5F5] mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Create Account</h2>
              <p className="text-[#6B6B6B] text-sm mb-6">Join MGTV and start streaming today.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Full Name" type="text" value={name} onChange={setName} placeholder="Your name" />
                <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
                <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="Create a password" />
                <p className="text-[#6B6B6B] text-xs">
                  By signing up you agree to MGTV's{' '}
                  <span className="text-[#C9A84C] cursor-pointer hover:underline">Terms of Use</span> and{' '}
                  <span className="text-[#C9A84C] cursor-pointer hover:underline">Privacy Policy</span>.
                </p>
                <Button variant="primary" size="lg" className="w-full justify-center" type="submit">
                  Create Account
                </Button>
              </form>
              <div className="mt-6 pt-6 border-t border-white/8 text-center">
                <p className="text-[#6B6B6B] text-sm">
                  Already have an account?{' '}
                  <button onClick={() => setView('signin')} className="text-[#C9A84C] hover:underline cursor-pointer font-medium">
                    Sign In
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Input({ label, type, value, onChange, placeholder }: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label className="block text-[#A3A3A3] text-xs font-medium mb-1.5 tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#4A4A4A] focus:outline-none focus:border-[#C9A84C]/50 focus:bg-[#222] transition-colors"
      />
    </div>
  )
}
