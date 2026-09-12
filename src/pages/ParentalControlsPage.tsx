import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'

type Rating = 'G' | 'PG' | 'PG-13' | 'TV-14' | 'TV-MA'

const ratings: Rating[] = ['G', 'PG', 'PG-13', 'TV-14', 'TV-MA']
const ratingDesc: Record<Rating, string> = {
  'G': 'General audiences — all ages',
  'PG': 'Parental guidance suggested',
  'PG-13': 'Parents strongly cautioned — may be unsuitable under 13',
  'TV-14': 'Parents strongly cautioned — suitable 14+',
  'TV-MA': 'Mature audiences only — 17+',
}

export function ParentalControlsPage() {
  const [maxRating, setMaxRating] = useState<Rating>('TV-14')
  const [requirePin, setRequirePin] = useState(true)
  const [viewingLimit, setViewingLimit] = useState(false)
  const [limitHours, setLimitHours] = useState(2)
  const [purchasePin, setPurchasePin] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-[900px] mx-auto px-8 md:px-16 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/account" className="text-[#6B6B6B] hover:text-[#C9A84C] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-4xl text-[#F5F5F5]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Parental Controls</h1>
            <p className="text-[#6B6B6B] text-sm">Manage content restrictions and viewing limits.</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Content Rating */}
          <Card title="Content Rating Limit" icon="🔒">
            <p className="text-[#6B6B6B] text-sm mb-4">Only show content rated up to:</p>
            <div className="space-y-2">
              {ratings.map(r => (
                <button
                  key={r}
                  onClick={() => setMaxRating(r)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all cursor-pointer ${
                    maxRating === r
                      ? 'bg-[#2A2010] border border-[#C9A84C]/40'
                      : 'bg-[#1A1A1A] border border-transparent hover:border-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    maxRating === r ? 'bg-[#C9A84C] text-[#0A0A0A]' : 'bg-[#2A2A2A] text-[#6B6B6B]'
                  }`}>
                    {r}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${maxRating === r ? 'text-[#C9A84C]' : 'text-[#F5F5F5]'}`}>{r}</p>
                    <p className="text-[#6B6B6B] text-xs">{ratingDesc[r]}</p>
                  </div>
                  {maxRating === r && (
                    <svg className="w-4 h-4 text-[#C9A84C] ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* PIN Protection */}
          <Card title="PIN Protection" icon="🔑">
            <Toggle
              label="Require PIN to change parental settings"
              description="A 4-digit PIN must be entered to modify these controls."
              checked={requirePin}
              onToggle={() => setRequirePin(v => !v)}
            />
            {requirePin && (
              <div className="mt-4 pt-4 border-t border-white/8">
                <label className="block text-[#A3A3A3] text-xs font-medium mb-2 tracking-wide">Your PIN</label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map(i => (
                    <input
                      key={i}
                      type="password"
                      maxLength={1}
                      placeholder="•"
                      className="w-12 h-12 bg-[#1E1E1E] border border-white/10 rounded-lg text-center text-lg text-[#F5F5F5] focus:outline-none focus:border-[#C9A84C]/50"
                    />
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Viewing Time */}
          <Card title="Viewing Time Limits" icon="⏱">
            <Toggle
              label="Enable daily viewing limit"
              description="Restrict how many hours per day a profile can watch."
              checked={viewingLimit}
              onToggle={() => setViewingLimit(v => !v)}
            />
            {viewingLimit && (
              <div className="mt-4 pt-4 border-t border-white/8">
                <label className="block text-[#A3A3A3] text-xs font-medium mb-2 tracking-wide">Daily limit: {limitHours}h</label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={limitHours}
                  onChange={e => setLimitHours(Number(e.target.value))}
                  className="w-full accent-[#C9A84C]"
                />
                <div className="flex justify-between text-[#6B6B6B] text-xs mt-1">
                  <span>1 hour</span><span>8 hours</span>
                </div>
              </div>
            )}
          </Card>

          {/* Purchase Restrictions */}
          <Card title="Purchase Restrictions" icon="💳">
            <Toggle
              label="Require PIN for purchases"
              description="Prevent unauthorised subscription changes or upgrades."
              checked={purchasePin}
              onToggle={() => setPurchasePin(v => !v)}
            />
          </Card>

          {/* Profile restrictions note */}
          <div className="bg-[#141414] rounded-2xl border border-white/8 p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2A2010] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[#F5F5F5] text-sm font-medium">Per-profile restrictions</p>
                <p className="text-[#6B6B6B] text-xs mt-1 leading-relaxed">
                  Child and Teen profiles automatically apply stricter content restrictions. You can manage individual profile settings from the{' '}
                  <Link to="/profiles" className="text-[#C9A84C] hover:underline">Profiles page</Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-4 pt-2">
            <Button variant="primary" size="lg" onClick={handleSave}>
              {saved ? '✓ Saved' : 'Save Settings'}
            </Button>
            <Link to="/account">
              <Button variant="ghost" size="lg">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#141414] rounded-2xl border border-white/8 p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">{icon}</span>
        <h2 className="text-lg text-[#F5F5F5] font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Toggle({ label, description, checked, onToggle }: { label: string; description: string; checked: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[#F5F5F5] text-sm font-medium">{label}</p>
        <p className="text-[#6B6B6B] text-xs mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 mt-0.5 ${checked ? 'bg-[#C9A84C]' : 'bg-[#3A3A3A]'}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}
