import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'

export function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    // Simulate auth
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    navigate('/profiles')
  }

  return (
    <div>
      <h1 className="text-4xl text-[#F5F5F5] mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
        Welcome back
      </h1>
      <p className="text-[#6B6B6B] text-sm mb-8">
        Sign in to your MGTV account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[#A3A3A3] text-xs font-medium tracking-wide">Password</label>
            <Link to="/auth/forgot-password" className="text-[#C9A84C] text-xs hover:text-[#E2C36A] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#F5F5F5] placeholder-[#3A3A3A] focus:outline-none focus:border-[#C9A84C]/50 focus:bg-[#1E1E1E] transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#A3A3A3] transition-colors cursor-pointer"
            >
              {showPassword
                ? <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                : <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              }
            </button>
          </div>
        </div>

        {error && (
          <p className="text-[#EF4444] text-xs bg-[#2A0A0A] border border-[#EF4444]/20 rounded-lg px-4 py-2.5">{error}</p>
        )}

        <Button
          variant="primary"
          size="lg"
          type="submit"
          className="w-full justify-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in…
            </span>
          ) : 'Sign In'}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/8 text-center">
        <p className="text-[#6B6B6B] text-sm">
          New to MGTV?{' '}
          <Link to="/auth/register" className="text-[#C9A84C] hover:text-[#E2C36A] transition-colors font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({
  label, type, value, onChange, placeholder, autoComplete
}: {
  label: string; type: string; value: string
  onChange: (v: string) => void; placeholder: string; autoComplete?: string
}) {
  return (
    <div>
      <label className="block text-[#A3A3A3] text-xs font-medium mb-1.5 tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#F5F5F5] placeholder-[#3A3A3A] focus:outline-none focus:border-[#C9A84C]/50 focus:bg-[#1E1E1E] transition-colors"
      />
    </div>
  )
}
