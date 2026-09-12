import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router'

type NotifType = 'episode' | 'live' | 'release' | 'event' | 'subscription' | 'shop' | 'award'

interface Notification {
  id: string
  type: NotifType
  category: 'Shows' | 'Music' | 'Sports' | 'Events' | 'System'
  title: string
  body: string
  time: string
  timeGroup: 'Today' | 'Yesterday' | 'Earlier'
  read: boolean
  to?: string
  thumbnail?: string
}

const NOTIFS: Notification[] = [
  { id: 'n1', type: 'episode', category: 'Shows', title: 'New Episode Available', body: 'Island Chronicles S1 E3 "Salt & Gold" is now streaming.', time: '2 min ago', timeGroup: 'Today', read: false, to: '/shows/t1', thumbnail: 'https://images.unsplash.com/photo-1700720711254-602cb6b8468d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80&q=80' },
  { id: 'n2', type: 'live', category: 'Sports', title: 'Live Now', body: 'Caribbean Cup Quarter Final is streaming live right now. Score: 1–0.', time: '15 min ago', timeGroup: 'Today', read: false, to: '/sports', thumbnail: 'https://images.unsplash.com/photo-1763639700615-225fe7fdffff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80&q=80' },
  { id: 'n3', type: 'release', category: 'Music', title: 'New Album Drop', body: 'Empress Nia\'s "Golden Hour" is available to stream — 14 tracks of pure gold.', time: '1 hr ago', timeGroup: 'Today', read: false, to: '/music/artist/a1', thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80&q=80' },
  { id: 'n4', type: 'award', category: 'Shows', title: 'MGTV Awards — Voting Open', body: 'Vote for Best Reggae Artist 2025. Polls close in 48 hours.', time: '3 hr ago', timeGroup: 'Today', read: false, to: '/awards' },
  { id: 'n5', type: 'event', category: 'Events', title: 'Event Reminder', body: 'Reggae Sumfest 2025 begins in 3 days. Your tickets are confirmed.', time: '6 hr ago', timeGroup: 'Today', read: true, to: '/events/e1', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80&q=80' },
  { id: 'n6', type: 'release', category: 'Shows', title: 'New Release', body: '"Trident" is now exclusively on MGTV+ — the action thriller of the year.', time: 'Yesterday, 2:30 PM', timeGroup: 'Yesterday', read: true, to: '/movies/m7', thumbnail: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80&q=80' },
  { id: 'n7', type: 'live', category: 'Sports', title: 'World Championship Highlights', body: 'Jamaica sweeps sprint finals. Watch the full replay now.', time: 'Yesterday, 10:15 AM', timeGroup: 'Yesterday', read: true, to: '/sports' },
  { id: 'n8', type: 'subscription', category: 'System', title: 'MGTV+ Renewal Reminder', body: 'Your premium subscription renews in 7 days. Manage billing in Account settings.', time: '2 days ago', timeGroup: 'Earlier', read: true, to: '/account' },
  { id: 'n9', type: 'episode', category: 'Shows', title: 'Season Finale Tonight', body: 'Island Chronicles S1 E8 "Gold & Glory" drops at 9 PM. Set a reminder.', time: '3 days ago', timeGroup: 'Earlier', read: true, to: '/shows/t1' },
  { id: 'n10', type: 'release', category: 'Music', title: 'New Music Video', body: 'Jah Roc\'s "Kingston Flow" music video is live — featuring Shanti V.', time: '4 days ago', timeGroup: 'Earlier', read: true, to: '/music/video/mv2' },
  { id: 'n11', type: 'event', category: 'Events', title: 'VIP Masterclass — Spots Filling', body: 'Only 12 spots left for the VIP Artist Masterclass on Sep 15. Register now.', time: '5 days ago', timeGroup: 'Earlier', read: true, to: '/events/e6' },
]

const TYPE_CONFIG: Record<NotifType, { icon: React.ReactElement; color: string; dot: string }> = {
  episode: {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: 'bg-[#1A2A10] text-[#4ADE80]',
    dot: 'bg-[#4ADE80]',
  },
  live: {
    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" /></svg>,
    color: 'bg-[#2A0A0A] text-[#EF4444]',
    dot: 'bg-[#EF4444]',
  },
  release: {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
    color: 'bg-[#2A2010] text-[#C9A84C]',
    dot: 'bg-[#C9A84C]',
  },
  event: {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    color: 'bg-[#1A1A2A] text-[#818CF8]',
    dot: 'bg-[#818CF8]',
  },
  subscription: {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    color: 'bg-[#1A2A2A] text-[#22D3EE]',
    dot: 'bg-[#22D3EE]',
  },
  shop: {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    color: 'bg-[#2A1A10] text-[#FB923C]',
    dot: 'bg-[#FB923C]',
  },
  award: {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: 'bg-[#2A2010] text-[#C9A84C]',
    dot: 'bg-[#C9A84C]',
  },
}

const TABS = ['All', 'Shows', 'Music', 'Sports', 'Events', 'System'] as const
type Tab = typeof TABS[number]

const TIME_GROUPS = ['Today', 'Yesterday', 'Earlier'] as const

export function NotificationsPage() {
  const [tab, setTab] = useState<Tab>('All')
  const [notifications, setNotifications] = useState(NOTIFS)

  const filtered = tab === 'All' ? notifications : notifications.filter(n => n.category === tab)
  const unread = notifications.filter(n => !n.read).length

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* Page header */}
      <div className="border-b border-white/6">
        <div className="max-w-[860px] mx-auto px-8 md:px-16 pt-12 pb-0">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[#F5F5F5] leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3.5rem', letterSpacing: '0.05em' }}>
                Notifications
              </h1>
              {unread > 0 && (
                <p className="text-[#6B6B6B] text-sm mt-1">
                  <span className="text-[#C9A84C] font-semibold">{unread} unread</span> · {notifications.length} total
                </p>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-[#C9A84C] text-sm font-semibold hover:text-[#E2C36A] transition-colors cursor-pointer mt-4"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map(t => {
              const count = t === 'All' ? unread : notifications.filter(n => n.category === t && !n.read).length
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative flex-shrink-0 px-5 py-3.5 text-sm font-medium transition-colors cursor-pointer border-b-2 ${
                    tab === t
                      ? 'text-[#F5F5F5] border-[#C9A84C]'
                      : 'text-[#6B6B6B] border-transparent hover:text-[#A3A3A3]'
                  }`}
                >
                  {t}
                  {count > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-black rounded-sm">
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Notification list */}
      <div className="max-w-[860px] mx-auto px-8 md:px-16 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-14 h-14 rounded-full bg-[#141414] flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#3A3A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-[#4A4A4A] text-sm">No {tab !== 'All' ? tab.toLowerCase() : ''} notifications</p>
          </div>
        ) : (
          TIME_GROUPS.map(group => {
            const groupItems = filtered.filter(n => n.timeGroup === group)
            if (groupItems.length === 0) return null
            return (
              <div key={group}>
                <div className="flex items-center gap-3 py-5">
                  <span className="text-[#3A3A3A] text-[10px] font-bold tracking-[0.25em] uppercase flex-shrink-0">{group}</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="space-y-0">
                  {groupItems.map(notif => {
                    const cfg = TYPE_CONFIG[notif.type]
                    return (
                      <Link
                        key={notif.id}
                        to={notif.to ?? '/'}
                        onClick={() => markRead(notif.id)}
                        className={`flex gap-4 py-5 border-b border-white/5 hover:bg-white/2 transition-colors group -mx-4 px-4 ${!notif.read ? 'bg-[#C9A84C]/3' : ''}`}
                      >
                        {/* Left: Icon or thumbnail */}
                        <div className="flex-shrink-0 relative">
                          {notif.thumbnail ? (
                            <div className="w-12 h-12 overflow-hidden">
                              <img src={notif.thumbnail} alt="" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className={`w-10 h-10 flex items-center justify-center ${cfg.color}`}>
                              {cfg.icon}
                            </div>
                          )}
                          {/* Type indicator dot */}
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${cfg.dot} border-2 border-[#0A0A0A]`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <p className={`text-sm font-semibold leading-tight ${!notif.read ? 'text-[#F5F5F5]' : 'text-[#A3A3A3]'} group-hover:text-[#F5F5F5] transition-colors`}>
                              {notif.title}
                            </p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!notif.read && (
                                <div className="w-2 h-2 rounded-full bg-[#C9A84C] flex-shrink-0" />
                              )}
                              <span className="text-[#3A3A3A] text-[10px] whitespace-nowrap">{notif.time}</span>
                            </div>
                          </div>
                          <p className="text-[#5A5A5A] text-xs mt-1 leading-relaxed line-clamp-2 group-hover:text-[#6B6B6B] transition-colors">
                            {notif.body}
                          </p>
                          <span className="text-[#C9A84C] text-[10px] font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity mt-1 block">
                            {notif.category} →
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
