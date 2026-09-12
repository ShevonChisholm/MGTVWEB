import { useState } from 'react'
import { Link, useLocation } from 'react-router'

export function VerifyEmailPage() {
  const { state } = useLocation()
  const email = (state as { email?: string })?.email ?? 'your email'
  const [resent, setResent] = useState(false)

  const handleResend = () => {
    setResent(true)
    setTimeout(() => setResent(false), 4000)
  }

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 rounded-full bg-[#1A2010] border border-[#C9A84C]/20 flex items-center justify-center">
          <svg className="w-9 h-9 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <h1 className="text-4xl text-[#F5F5F5] mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
        Check your inbox
      </h1>
      <p className="text-[#6B6B6B] text-sm leading-relaxed mb-2 max-w-xs mx-auto">
        We've sent a verification link to
      </p>
      <p className="text-[#C9A84C] text-sm font-semibold mb-8">{email}</p>

      <p className="text-[#4A4A4A] text-xs leading-relaxed mb-8 max-w-xs mx-auto">
        Click the link in the email to verify your account and continue to MGTV. Check your spam folder if you don't see it.
      </p>

      <div className="space-y-3">
        {resent ? (
          <div className="flex items-center justify-center gap-2 py-3 bg-[#1A2A1A] border border-[#4ADE80]/20 rounded-xl text-[#4ADE80] text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
            Email resent
          </div>
        ) : (
          <button
            onClick={handleResend}
            className="w-full py-3.5 rounded-xl border border-white/10 text-[#A3A3A3] text-sm hover:text-[#F5F5F5] hover:border-white/20 transition-all cursor-pointer"
          >
            Resend verification email
          </button>
        )}

        <Link
          to="/auth/sign-in"
          className="block w-full py-3.5 rounded-xl text-center text-[#6B6B6B] text-sm hover:text-[#A3A3A3] transition-colors"
        >
          ← Back to sign in
        </Link>
      </div>
    </div>
  )
}
