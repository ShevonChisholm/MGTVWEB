import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (field: string) => (v: string) => setForm(f => ({ ...f, [field]: v }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.email.includes('@')) e.email = 'Enter a valid email address'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    navigate('/auth/verify-email', { state: { email: form.email } })
  }

  return (
    <div>
      <h1 className="text-4xl text-[#F5F5F5] mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
        Create your account
      </h1>
      <p className="text-[#6B6B6B] text-sm mb-8">
        Join MGTV and start streaming Caribbean culture today.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" type="text" value={form.firstName} onChange={set('firstName')}
            placeholder="First" autoComplete="given-name" error={errors.firstName} />
          <Field label="Last name" type="text" value={form.lastName} onChange={set('lastName')}
            placeholder="Last" autoComplete="family-name" error={errors.lastName} />
        </div>

        <Field label="Email address" type="email" value={form.email} onChange={set('email')}
          placeholder="you@example.com" autoComplete="email" error={errors.email} />

        <div>
          <label className="block text-[#A3A3A3] text-xs font-medium mb-1.5 tracking-wide">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={e => set('password')(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className={`w-full bg-[#1A1A1A] border rounded-xl px-4 py-3.5 text-sm text-[#F5F5F5] placeholder-[#3A3A3A] focus:outline-none focus:bg-[#1E1E1E] transition-colors pr-12 ${errors.password ? 'border-[#EF4444]/50 focus:border-[#EF4444]/70' : 'border-white/10 focus:border-[#C9A84C]/50'}`}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#A3A3A3] cursor-pointer">
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {errors.password && <p className="text-[#EF4444] text-xs mt-1">{errors.password}</p>}
          {/* Strength indicator */}
          {form.password && (
            <PasswordStrength password={form.password} />
          )}
        </div>

        <Field label="Confirm password" type="password" value={form.confirm} onChange={set('confirm')}
          placeholder="Re-enter your password" autoComplete="new-password" error={errors.confirm} />

        <p className="text-[#4A4A4A] text-xs leading-relaxed">
          By creating an account you agree to MGTV's{' '}
          <Link to="/terms" className="text-[#C9A84C] hover:text-[#E2C36A]">Terms of Use</Link>{' '}and{' '}
          <Link to="/privacy" className="text-[#C9A84C] hover:text-[#E2C36A]">Privacy Policy</Link>.
        </p>

        <Button variant="primary" size="lg" type="submit" className="w-full justify-center">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account…
            </span>
          ) : 'Create Account'}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/8 text-center">
        <p className="text-[#6B6B6B] text-sm">
          Already have an account?{' '}
          <Link to="/auth/sign-in" className="text-[#C9A84C] hover:text-[#E2C36A] transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({
  label, type, value, onChange, placeholder, autoComplete, error
}: {
  label: string; type: string; value: string
  onChange: (v: string) => void; placeholder: string; autoComplete?: string; error?: string
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
        className={`w-full bg-[#1A1A1A] border rounded-xl px-4 py-3.5 text-sm text-[#F5F5F5] placeholder-[#3A3A3A] focus:outline-none focus:bg-[#1E1E1E] transition-colors ${error ? 'border-[#EF4444]/50 focus:border-[#EF4444]/70' : 'border-white/10 focus:border-[#C9A84C]/50'}`}
      />
      {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
    </div>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  return open
    ? <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
    : <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
}

function PasswordStrength({ password }: { password: string }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colours = ['', 'bg-[#EF4444]', 'bg-[#F59E0B]', 'bg-[#3B82F6]', 'bg-[#22C55E]']
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-0.5 flex-1 rounded-full transition-colors ${i <= score ? colours[score] : 'bg-white/10'}`} />
        ))}
      </div>
      {score > 0 && <p className="text-[#6B6B6B] text-xs mt-1">{labels[score]}</p>}
    </div>
  )
}
