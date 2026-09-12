import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'

type ProfileType = 'adult' | 'teen' | 'child'

interface Profile {
  id: string
  name: string
  type: ProfileType
  color: string
  initials: string
  isMain?: boolean
}

const initialProfiles: Profile[] = [
  { id: 'p1', name: 'Alex', type: 'adult', color: '#C9A84C', initials: 'A', isMain: true },
  { id: 'p2', name: 'Jordan', type: 'teen', color: '#4A9ADE', initials: 'J' },
]

const avatarColors = ['#C9A84C', '#4A9ADE', '#DE4A6A', '#4ADE80', '#9B4ADE']

export function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)
  const [selected, setSelected] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<ProfileType>('adult')
  const [newColor, setNewColor] = useState(avatarColors[1])

  const maxProfiles = 5
  const canAdd = profiles.length < maxProfiles

  const handleAdd = () => {
    if (!newName.trim()) return
    const p: Profile = {
      id: `p${Date.now()}`,
      name: newName.trim(),
      type: newType,
      color: newColor,
      initials: newName.trim()[0].toUpperCase(),
    }
    setProfiles(prev => [...prev, p])
    setNewName('')
    setNewType('adult')
    setNewColor(avatarColors[1])
    setAdding(false)
  }

  const handleDelete = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id))
    setEditing(null)
  }

  const typeLabel: Record<ProfileType, string> = { adult: 'Adult', teen: 'Teen', child: 'Child' }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16 flex flex-col items-center justify-center px-6 py-16">
      <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.25em] uppercase mb-3">MGTV</p>
      <h1 className="text-4xl md:text-6xl text-[#F5F5F5] text-center mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
        Who's Watching?
      </h1>
      <p className="text-[#6B6B6B] text-sm text-center mb-12">Select a profile to continue.</p>

      <div className="flex flex-wrap gap-6 justify-center mb-12">
        {profiles.map(profile => (
          <div
            key={profile.id}
            className="relative group flex flex-col items-center gap-3 cursor-pointer"
            onClick={() => setSelected(profile.id)}
          >
            <div
              className={`w-24 h-24 md:w-28 md:h-28 rounded-xl flex items-center justify-center transition-all duration-200 ${
                selected === profile.id ? 'ring-4 ring-[#C9A84C] scale-105' : 'ring-2 ring-transparent group-hover:ring-white/30 group-hover:scale-105'
              }`}
              style={{ background: `linear-gradient(135deg, ${profile.color}40, ${profile.color}20)`, borderColor: profile.color }}
            >
              <span
                className="text-4xl font-bold"
                style={{ color: profile.color, fontFamily: 'Bebas Neue, sans-serif' }}
              >
                {profile.initials}
              </span>
            </div>
            <p className="text-[#F5F5F5] text-sm font-medium">{profile.name}</p>
            <p className="text-[#6B6B6B] text-xs -mt-1">{typeLabel[profile.type]}{profile.isMain ? ' · Main' : ''}</p>

            {/* Edit button on hover */}
            <button
              onClick={e => { e.stopPropagation(); setEditing(profile.id) }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1E1E1E] border border-white/20 text-[#A3A3A3] hover:text-[#F5F5F5] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
              </svg>
            </button>
          </div>
        ))}

        {/* Add profile — links to dedicated guided creation flow */}
        {canAdd && !adding && (
          <Link to="/profiles/create" className="flex flex-col items-center gap-3 group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl border-2 border-dashed border-white/20 group-hover:border-[#C9A84C]/50 flex items-center justify-center transition-colors">
              <svg className="w-8 h-8 text-[#3A3A3A] group-hover:text-[#C9A84C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-[#6B6B6B] text-sm group-hover:text-[#C9A84C] transition-colors">Add Profile</p>
          </Link>
        )}
      </div>

      {selected && (
        <Button variant="primary" size="lg" onClick={() => setSelected(null)}>
          Continue as {profiles.find(p => p.id === selected)?.name}
        </Button>
      )}

      <p className="text-[#6B6B6B] text-xs mt-6">
        {profiles.length} of {maxProfiles} profiles used
      </p>

      {/* Add profile modal */}
      {adding && (
        <Modal title="Create Profile" onClose={() => setAdding(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[#A3A3A3] text-xs font-medium mb-1.5 tracking-wide">Name</label>
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Profile name"
                maxLength={20}
                className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#A3A3A3] text-xs font-medium mb-1.5 tracking-wide">Profile Type</label>
              <div className="flex gap-2">
                {(['adult', 'teen', 'child'] as ProfileType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      newType === t ? 'bg-[#C9A84C] text-[#0A0A0A]' : 'bg-[#1E1E1E] text-[#A3A3A3] border border-white/10 hover:text-[#F5F5F5]'
                    }`}
                  >
                    {typeLabel[t]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[#A3A3A3] text-xs font-medium mb-2 tracking-wide">Avatar Color</label>
              <div className="flex gap-2">
                {avatarColors.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${newColor === c ? 'scale-125 ring-2 ring-white/50' : 'hover:scale-110'}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="primary" size="md" onClick={handleAdd}>Create Profile</Button>
              <Button variant="ghost" size="md" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit profile modal */}
      {editing && (() => {
        const profile = profiles.find(p => p.id === editing)!
        return (
          <Modal title={`Edit — ${profile.name}`} onClose={() => setEditing(null)}>
            <div className="space-y-4">
              <div>
                <label className="block text-[#A3A3A3] text-xs font-medium mb-1.5 tracking-wide">Name</label>
                <input
                  type="text"
                  defaultValue={profile.name}
                  className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="primary" size="md" onClick={() => setEditing(null)}>Save</Button>
                {!profile.isMain && (
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="text-red-400 text-sm hover:underline cursor-pointer px-4"
                  >
                    Delete Profile
                  </button>
                )}
              </div>
            </div>
          </Modal>
        )
      })()}
    </div>
  )
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-sm bg-[#141414] rounded-2xl border border-white/10 p-6 relative">
        <div className="h-1 absolute top-0 left-0 right-0 rounded-t-2xl bg-gradient-to-r from-[#C9A84C] to-[#E2C36A]" />
        <button onClick={onClose} className="absolute top-4 right-4 text-[#6B6B6B] hover:text-[#F5F5F5] cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-xl text-[#F5F5F5] mb-5" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{title}</h3>
        {children}
      </div>
    </div>
  )
}
