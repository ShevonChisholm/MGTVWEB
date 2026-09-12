import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'

type AccountTab = 'overview' | 'personal' | 'subscription' | 'notifications' | 'security'

const tabs: { id: AccountTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'personal', label: 'Personal Info' },
  { id: 'subscription', label: 'Subscription' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
]

const mockUser = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  joined: 'March 2024',
  plan: 'MGTV+ Annual',
  nextBilling: 'March 2026',
  language: 'English',
}

export function AccountPage() {
  const [activeTab, setActiveTab] = useState<AccountTab>('overview')

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* Header */}
      <div className="border-b border-white/8">
        <div className="max-w-[1200px] mx-auto px-8 md:px-16 py-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#7A6430] flex items-center justify-center flex-shrink-0">
              <span className="text-[#0A0A0A] text-2xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                {mockUser.name[0]}
              </span>
            </div>
            <div>
              <h1 className="text-3xl text-[#F5F5F5]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{mockUser.name}</h1>
              <p className="text-[#6B6B6B] text-sm">{mockUser.email}</p>
              <p className="text-[#C9A84C] text-xs font-semibold mt-1 tracking-wider uppercase">{mockUser.plan}</p>
            </div>
            <div className="ml-auto hidden md:block">
              <Link to="/profiles">
                <Button variant="outline" size="sm">Switch Profile</Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#C9A84C] text-[#0A0A0A]'
                    : 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-8 md:px-16 py-10">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'personal' && <PersonalTab />}
        {activeTab === 'subscription' && <SubscriptionTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#141414] rounded-2xl border border-white/8 p-6 mb-5">
      <h2 className="text-lg text-[#F5F5F5] font-semibold mb-5">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, value, editable = false }: { label: string; value: string; editable?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-[#6B6B6B] text-xs uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-[#F5F5F5] text-sm">{value}</p>
      </div>
      {editable && (
        <button className="text-[#C9A84C] text-xs font-medium hover:underline cursor-pointer">Edit</button>
      )}
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <SectionCard title="Account Details">
        <Field label="Name" value={mockUser.name} editable />
        <Field label="Email" value={mockUser.email} editable />
        <Field label="Member Since" value={mockUser.joined} />
        <Field label="Language" value={mockUser.language} editable />
      </SectionCard>
      <SectionCard title="Subscription">
        <Field label="Current Plan" value={mockUser.plan} />
        <Field label="Next Billing" value={mockUser.nextBilling} />
        <div className="pt-4">
          <Button variant="outline" size="sm">Manage Subscription</Button>
        </div>
      </SectionCard>
      <SectionCard title="Profiles">
        <p className="text-[#6B6B6B] text-sm mb-4">You have 2 of 5 profiles set up.</p>
        <Link to="/profiles">
          <Button variant="outline" size="sm">Manage Profiles</Button>
        </Link>
      </SectionCard>
      <SectionCard title="Parental Controls">
        <p className="text-[#6B6B6B] text-sm mb-4">Set content restrictions for child and teen profiles.</p>
        <Link to="/parental-controls">
          <Button variant="outline" size="sm">Manage Controls</Button>
        </Link>
      </SectionCard>
    </div>
  )
}

function PersonalTab() {
  return (
    <div className="max-w-lg">
      <SectionCard title="Personal Information">
        <div className="space-y-4">
          {[
            { label: 'Full Name', placeholder: 'Alex Morgan', type: 'text' },
            { label: 'Email Address', placeholder: 'alex.morgan@example.com', type: 'email' },
            { label: 'Date of Birth', placeholder: 'DD / MM / YYYY', type: 'text' },
            { label: 'Country', placeholder: 'Jamaica', type: 'text' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-[#A3A3A3] text-xs font-medium mb-1.5 tracking-wide">{f.label}</label>
              <input
                type={f.type}
                defaultValue={f.placeholder}
                className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
              />
            </div>
          ))}
          <div className="pt-2">
            <Button variant="primary" size="md">Save Changes</Button>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

function SubscriptionTab() {
  return (
    <div className="max-w-lg">
      <SectionCard title="Current Plan">
        <div className="bg-[#2A2010] rounded-xl p-5 border border-[#C9A84C]/20 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#C9A84C] font-bold tracking-wider text-sm uppercase">MGTV+ Annual</span>
            <span className="bg-[#C9A84C] text-[#0A0A0A] text-xs font-bold px-2 py-0.5 rounded">Active</span>
          </div>
          <p className="text-[#F5F5F5] text-2xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>$59.99 / year</p>
          <p className="text-[#6B6B6B] text-sm mt-1">Next billing: March 14, 2026</p>
        </div>
        <div className="space-y-3">
          <Button variant="outline" size="md" className="w-full justify-center">Change Plan</Button>
          <button className="text-[#6B6B6B] text-sm hover:text-red-400 transition-colors cursor-pointer w-full text-center">
            Cancel Subscription
          </button>
        </div>
      </SectionCard>
      <SectionCard title="Billing History">
        {[
          { date: 'Mar 14, 2025', amount: '$59.99', status: 'Paid' },
          { date: 'Mar 14, 2024', amount: '$59.99', status: 'Paid' },
        ].map((row, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div>
              <p className="text-[#F5F5F5] text-sm">{row.date}</p>
              <p className="text-[#6B6B6B] text-xs">MGTV+ Annual</p>
            </div>
            <div className="text-right">
              <p className="text-[#F5F5F5] text-sm font-medium">{row.amount}</p>
              <p className="text-[#4ADE80] text-xs">{row.status}</p>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  )
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    newEpisodes: true,
    liveEvents: true,
    newReleases: true,
    artistUpdates: false,
    newsletter: true,
    accountAlerts: true,
  })

  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const items = [
    { key: 'newEpisodes' as const, label: 'New Episodes', desc: 'When new episodes of your saved shows are available' },
    { key: 'liveEvents' as const, label: 'Live Events', desc: 'Reminders before live events you are interested in' },
    { key: 'newReleases' as const, label: 'New Releases', desc: 'New movies and shows added to MGTV' },
    { key: 'artistUpdates' as const, label: 'Artist Updates', desc: 'New music and content from artists you follow' },
    { key: 'newsletter' as const, label: 'Newsletter', desc: 'Weekly highlights and cultural stories from MGTV' },
    { key: 'accountAlerts' as const, label: 'Account Alerts', desc: 'Security and billing notifications' },
  ]

  return (
    <div className="max-w-lg">
      <SectionCard title="Notification Preferences">
        <div className="space-y-1">
          {items.map(item => (
            <div key={item.key} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
              <div className="pr-4">
                <p className="text-[#F5F5F5] text-sm font-medium">{item.label}</p>
                <p className="text-[#6B6B6B] text-xs mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => toggle(item.key)}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                  prefs[item.key] ? 'bg-[#C9A84C]' : 'bg-[#3A3A3A]'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  prefs[item.key] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="max-w-lg space-y-5">
      <SectionCard title="Change Password">
        <div className="space-y-4">
          {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
            <div key={label}>
              <label className="block text-[#A3A3A3] text-xs font-medium mb-1.5 tracking-wide">{label}</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
              />
            </div>
          ))}
          <Button variant="primary" size="md">Update Password</Button>
        </div>
      </SectionCard>
      <SectionCard title="Active Sessions">
        {[
          { device: 'Chrome — macOS', location: 'Kingston, Jamaica', current: true },
          { device: 'MGTV Mobile App — iOS', location: 'Kingston, Jamaica', current: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div>
              <p className="text-[#F5F5F5] text-sm font-medium flex items-center gap-2">
                {s.device}
                {s.current && <span className="text-[10px] bg-[#2A2010] text-[#C9A84C] px-1.5 py-0.5 rounded font-bold">Current</span>}
              </p>
              <p className="text-[#6B6B6B] text-xs mt-0.5">{s.location}</p>
            </div>
            {!s.current && (
              <button className="text-red-400 text-xs hover:underline cursor-pointer">Sign out</button>
            )}
          </div>
        ))}
        <div className="pt-4">
          <button className="text-red-400 text-sm hover:underline cursor-pointer">Sign out all other devices</button>
        </div>
      </SectionCard>
    </div>
  )
}
