import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) { setError('Enter a valid email address.'); return }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#2A2010] border border-[#C9A84C]/20 flex items-center justify-center">
            <svg className="w-9 h-9 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl text-[#F5F5F5] mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          Reset link sent
        </h1>
        <p className="text-[#6B6B6B] text-sm leading-relaxed mb-2">
          We've sent a password reset link to
        </p>
        <p className="text-[#C9A84C] text-sm font-semibold mb-8">{email}</p>
        <p className="text-[#4A4A4A] text-xs leading-relaxed mb-8 max-w-xs mx-auto">
          Click the link in your email to reset your password. The link expires in 30 minutes.
        </p>
        <Link to="/auth/sign-in" className="text-[#C9A84C] text-sm hover:text-[#E2C36A] transition-colors">
          ← Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
      </div>

      <h1 className="text-4xl text-[#F5F5F5] mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
        Forgot your password?
      </h1>
      <p className="text-[#6B6B6B] text-sm leading-relaxed mb-8">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#A3A3A3] text-xs font-medium mb-1.5 tracking-wide">Email address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={`w-full bg-[#1A1A1A] border rounded-xl px-4 py-3.5 text-sm text-[#F5F5F5] placeholder-[#3A3A3A] focus:outline-none focus:bg-[#1E1E1E] transition-colors ${error ? 'border-[#EF4444]/50' : 'border-white/10 focus:border-[#C9A84C]/50'}`}
          />
          {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
        </div>

        <Button variant="primary" size="lg" type="submit" className="w-full justify-center">
          {loading
            ? <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending…
              </span>
            : 'Send Reset Link'
          }
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/8 text-center">
        <Link to="/auth/sign-in" className="text-[#6B6B6B] text-sm hover:text-[#A3A3A3] transition-colors">
          ← Back to sign in
        </Link>
      </div>
    </div>
  )
}
