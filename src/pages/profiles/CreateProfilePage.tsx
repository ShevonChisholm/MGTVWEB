import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Button } from '@/components/ui/Button'

type AgeCategory = 'Adult' | 'Teen' | 'Child'
type Step = 1 | 2 | 3

const avatarColors = [
  { id: 'gold', bg: '#C9A84C', label: 'Gold' },
  { id: 'coral', bg: '#E07060', label: 'Coral' },
  { id: 'teal', bg: '#4AADA8', label: 'Teal' },
  { id: 'purple', bg: '#9B72CF', label: 'Purple' },
  { id: 'jade', bg: '#5A9E6F', label: 'Jade' },
]

const genres = [
  'Reggae', 'Dancehall', 'Soca', 'Gospel', 'R&B', 'Afrobeats',
  'Drama', 'Comedy', 'Thriller', 'Documentary', 'Romance', 'Action',
  'Sports', 'Music', 'Culture', 'News', 'Lifestyle', 'Travel',
]

const languages = ['English', 'Patois', 'French Creole', 'Spanish', 'Dutch']

const regions = ['Jamaica', 'Trinidad & Tobago', 'Barbados', 'Guyana', 'Antigua', 'St. Lucia', 'International']

export function CreateProfilePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState('')
  const [avatarColor, setAvatarColor] = useState(avatarColors[0].id)
  const [ageCategory, setAgeCategory] = useState<AgeCategory>('Adult')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [language, setLanguage] = useState('English')
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [nameError, setNameError] = useState('')

  const currentColor = avatarColors.find(c => c.id === avatarColor)!

  const toggleGenre = (g: string) =>
    setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])

  const toggleRegion = (r: string) =>
    setSelectedRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])

  const goToStep2 = () => {
    if (!name.trim()) { setNameError('Please enter a profile name.'); return }
    setNameError('')
    setStep(2)
  }

  const goToStep3 = () => setStep(3)

  const finish = () => navigate('/profiles')

  const steps = [
    { n: 1, label: 'Profile' },
    { n: 2, label: 'Interests' },
    { n: 3, label: 'Done' },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16 flex flex-col">
      {/* Header */}
      <div className="max-w-[640px] mx-auto w-full px-6 py-10 flex-1">
        {/* Back to profiles */}
        <Link to="/profiles" className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#A3A3A3] transition-colors text-sm mb-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to profiles
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-12">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step > s.n
                    ? 'bg-[#C9A84C] text-[#0A0A0A]'
                    : step === s.n
                      ? 'bg-[#C9A84C]/20 border border-[#C9A84C] text-[#C9A84C]'
                      : 'bg-[#1A1A1A] border border-white/10 text-[#4A4A4A]'
                }`}>
                  {step > s.n
                    ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                    : s.n
                  }
                </div>
                <span className={`text-xs mt-1.5 ${step === s.n ? 'text-[#C9A84C]' : 'text-[#4A4A4A]'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-3 mb-4 transition-colors ${step > s.n ? 'bg-[#C9A84C]' : 'bg-white/8'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Profile basics */}
        {step === 1 && (
          <div>
            <h1 className="text-5xl text-[#F5F5F5] mb-2 leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              Create your profile
            </h1>
            <p className="text-[#6B6B6B] text-sm mb-10">
              Personalise your MGTV experience with your own profile.
            </p>

            {/* Avatar preview */}
            <div className="flex justify-center mb-8">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)] relative"
                style={{ backgroundColor: currentColor.bg }}
              >
                <span className="text-white text-4xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {name ? name[0].toUpperCase() : '?'}
                </span>
              </div>
            </div>

            {/* Avatar colour picker */}
            <div className="flex justify-center gap-3 mb-8">
              {avatarColors.map(c => (
                <button
                  key={c.id}
                  onClick={() => setAvatarColor(c.id)}
                  title={c.label}
                  className={`w-8 h-8 rounded-full transition-all cursor-pointer ${avatarColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0A0A0A] scale-110' : 'opacity-70 hover:opacity-100'}`}
                  style={{ backgroundColor: c.bg }}
                />
              ))}
            </div>

            {/* Profile name */}
            <div className="mb-6">
              <label className="block text-[#A3A3A3] text-xs font-medium mb-1.5 tracking-wide">Profile name</label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setNameError('') }}
                placeholder="e.g. Shevon"
                maxLength={20}
                className={`w-full bg-[#141414] border rounded-xl px-4 py-3.5 text-[#F5F5F5] text-sm placeholder-[#3A3A3A] focus:outline-none focus:bg-[#1A1A1A] transition-colors ${nameError ? 'border-[#EF4444]/50' : 'border-white/10 focus:border-[#C9A84C]/50'}`}
              />
              {nameError && <p className="text-[#EF4444] text-xs mt-1">{nameError}</p>}
            </div>

            {/* Age category */}
            <div className="mb-10">
              <label className="block text-[#A3A3A3] text-xs font-medium mb-3 tracking-wide">Age category</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Adult', 'Teen', 'Child'] as AgeCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setAgeCategory(cat)}
                    className={`py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                      ageCategory === cat
                        ? 'bg-[#2A2010] border-[#C9A84C]/40 text-[#C9A84C]'
                        : 'bg-[#141414] border-white/8 text-[#A3A3A3] hover:border-white/20'
                    }`}
                  >
                    {cat}
                    <div className="text-[10px] mt-0.5 font-normal opacity-60">
                      {cat === 'Adult' ? '18+' : cat === 'Teen' ? '13–17' : 'Under 13'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full justify-center" onClick={goToStep2}>
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
          <div>
            <h1 className="text-5xl text-[#F5F5F5] mb-2 leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              Choose your interests
            </h1>
            <p className="text-[#6B6B6B] text-sm mb-8">
              Help us personalise your recommendations. Pick as many as you like.
            </p>

            {/* Language */}
            <div className="mb-8">
              <label className="block text-[#A3A3A3] text-xs font-medium mb-3 tracking-wide">Preferred language</label>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer border ${
                      language === lang
                        ? 'bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C] font-semibold'
                        : 'bg-[#141414] border-white/8 text-[#A3A3A3] hover:border-white/20'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Favourite genres */}
            <div className="mb-8">
              <label className="block text-[#A3A3A3] text-xs font-medium mb-3 tracking-wide">
                Favourite genres <span className="text-[#4A4A4A]">— select all that apply</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.map(g => (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all cursor-pointer border ${
                      selectedGenres.includes(g)
                        ? 'bg-[#2A2010] border-[#C9A84C]/50 text-[#C9A84C]'
                        : 'bg-[#141414] border-white/8 text-[#A3A3A3] hover:border-white/20'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Favourite regions */}
            <div className="mb-10">
              <label className="block text-[#A3A3A3] text-xs font-medium mb-3 tracking-wide">
                Caribbean regions <span className="text-[#4A4A4A]">— optional</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {regions.map(r => (
                  <button
                    key={r}
                    onClick={() => toggleRegion(r)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all cursor-pointer border ${
                      selectedRegions.includes(r)
                        ? 'bg-[#2A2010] border-[#C9A84C]/50 text-[#C9A84C]'
                        : 'bg-[#141414] border-white/8 text-[#A3A3A3] hover:border-white/20'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" size="lg" onClick={() => setStep(1)} className="flex-shrink-0">
                Back
              </Button>
              <Button variant="primary" size="lg" className="flex-1 justify-center" onClick={goToStep3}>
                Continue
              </Button>
            </div>
            <button onClick={goToStep3} className="w-full text-center text-[#4A4A4A] text-sm mt-4 hover:text-[#6B6B6B] transition-colors cursor-pointer">
              Skip for now
            </button>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div className="text-center">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(201,168,76,0.25)]"
                style={{ backgroundColor: currentColor.bg }}
              >
                <span className="text-white text-4xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {name[0]?.toUpperCase() ?? '?'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-5xl text-[#F5F5F5] leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                {name || 'Your Profile'}
              </h1>
            </div>
            <p className="text-[#6B6B6B] text-sm mb-1">{ageCategory} · {language}</p>
            {selectedGenres.length > 0 && (
              <p className="text-[#4A4A4A] text-xs mb-8">{selectedGenres.slice(0, 4).join(' · ')}{selectedGenres.length > 4 ? ` +${selectedGenres.length - 4} more` : ''}</p>
            )}

            {/* Summary card */}
            <div className="bg-[#141414] border border-[#C9A84C]/15 rounded-2xl p-6 mb-8 text-left space-y-3">
              {[
                { label: 'Name', value: name || '—' },
                { label: 'Age category', value: ageCategory },
                { label: 'Language', value: language },
                { label: 'Genres', value: selectedGenres.length > 0 ? selectedGenres.slice(0, 3).join(', ') + (selectedGenres.length > 3 ? ` +${selectedGenres.length - 3}` : '') : 'All content' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center text-sm">
                  <span className="text-[#6B6B6B]">{row.label}</span>
                  <span className="text-[#F5F5F5]">{row.value}</span>
                </div>
              ))}
            </div>

            <Button variant="primary" size="lg" className="w-full justify-center mb-3" onClick={finish}>
              Start Watching
            </Button>
            <button onClick={() => setStep(2)} className="text-[#6B6B6B] text-sm hover:text-[#A3A3A3] transition-colors cursor-pointer">
              ← Edit preferences
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
