import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (password !== confirm) errs.confirm = 'Passwords do not match'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#1A2A1A] border border-[#4ADE80]/20 flex items-center justify-center">
            <svg className="w-9 h-9 text-[#4ADE80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl text-[#F5F5F5] mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          Password updated
        </h1>
        <p className="text-[#6B6B6B] text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          Your password has been successfully updated. You can now sign in with your new password.
        </p>
        <Button variant="primary" size="lg" className="w-full justify-center" onClick={() => navigate('/auth/sign-in')}>
          Continue to Sign In
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-4xl text-[#F5F5F5] mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
        Set new password
      </h1>
      <p className="text-[#6B6B6B] text-sm leading-relaxed mb-8">
        Choose a strong password for your MGTV account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#A3A3A3] text-xs font-medium mb-1.5 tracking-wide">New password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className={`w-full bg-[#1A1A1A] border rounded-xl px-4 py-3.5 text-sm text-[#F5F5F5] placeholder-[#3A3A3A] focus:outline-none focus:bg-[#1E1E1E] transition-colors pr-12 ${errors.password ? 'border-[#EF4444]/50' : 'border-white/10 focus:border-[#C9A84C]/50'}`}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#A3A3A3] cursor-pointer">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showPassword
                  ? <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></>
                  : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                }
              </svg>
            </button>
          </div>
          {errors.password && <p className="text-[#EF4444] text-xs mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-[#A3A3A3] text-xs font-medium mb-1.5 tracking-wide">Confirm new password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            className={`w-full bg-[#1A1A1A] border rounded-xl px-4 py-3.5 text-sm text-[#F5F5F5] placeholder-[#3A3A3A] focus:outline-none focus:bg-[#1E1E1E] transition-colors ${errors.confirm ? 'border-[#EF4444]/50' : 'border-white/10 focus:border-[#C9A84C]/50'}`}
          />
          {errors.confirm && <p className="text-[#EF4444] text-xs mt-1">{errors.confirm}</p>}
        </div>

        <Button variant="primary" size="lg" type="submit" className="w-full justify-center">
          {loading
            ? <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Updating…
              </span>
            : 'Reset Password'
          }
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link to="/auth/sign-in" className="text-[#6B6B6B] text-sm hover:text-[#A3A3A3] transition-colors">
          ← Back to sign in
        </Link>
      </div>
    </div>
  )
}
