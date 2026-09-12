import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router'

interface Notification {
  id: string
  type: 'episode' | 'live' | 'release' | 'event' | 'subscription'
  title: string
  body: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  { id: 'n1', type: 'episode', title: 'New Episode', body: 'Island Chronicles S1 E3 "Salt & Gold" is now available.', time: '2m ago', read: false },
  { id: 'n2', type: 'live', title: 'Live Now', body: 'Caribbean Cup Quarter Final is streaming live.', time: '15m ago', read: false },
  { id: 'n3', type: 'release', title: 'New Release', body: 'Empress Nia\'s new album "Golden Hour" drops today.', time: '1h ago', read: false },
  { id: 'n4', type: 'event', title: 'Event Reminder', body: 'Reggae Sumfest 2025 starts in 3 days. Get your tickets now.', time: '3h ago', read: true },
  { id: 'n5', type: 'subscription', title: 'MGTV+ Renewal', body: 'Your premium subscription renews in 7 days.', time: '1d ago', read: true },
  { id: 'n6', type: 'release', title: 'New Movie', body: '"Trident" is now available exclusively on MGTV+.', time: '2d ago', read: true },
]

const typeIcon: Record<string, React.ReactElement> = {
  episode: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  live: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  release: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  event: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  subscription: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
}

const typeColor: Record<string, string> = {
  episode: 'bg-[#1A2A10] text-[#4ADE80]',
  live: 'bg-[#2A0A0A] text-[#EF4444]',
  release: 'bg-[#2A2010] text-[#C9A84C]',
  event: 'bg-[#1A1A2A] text-[#818CF8]',
  subscription: 'bg-[#1A2A2A] text-[#22D3EE]',
}

interface NotificationPanelProps {
  onClose: () => void
  onMarkAllRead: () => void
}

export function NotificationPanel({ onClose, onMarkAllRead }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const unread = mockNotifications.filter(n => !n.read).length

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 mt-2 w-[360px] bg-[#141414] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
        <div className="flex items-center gap-2">
          <h3 className="text-[#F5F5F5] text-sm font-semibold">Notifications</h3>
          {unread > 0 && (
            <span className="bg-[#C9A84C] text-[#0A0A0A] text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {unread}
            </span>
          )}
        </div>
        <button
          onClick={onMarkAllRead}
          className="text-[#6B6B6B] text-xs hover:text-[#C9A84C] transition-colors cursor-pointer"
        >
          Mark all read
        </button>
      </div>

      {/* Notification list */}
      <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
        {mockNotifications.map(notif => (
          <div
            key={notif.id}
            className={`flex gap-3 px-5 py-4 border-b border-white/5 last:border-0 transition-colors hover:bg-white/3 ${!notif.read ? 'bg-white/2' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${typeColor[notif.type]}`}>
              {typeIcon[notif.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-medium ${!notif.read ? 'text-[#F5F5F5]' : 'text-[#A3A3A3]'}`}>
                  {notif.title}
                </p>
                {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0 mt-1.5" />}
              </div>
              <p className="text-[#6B6B6B] text-xs mt-0.5 leading-relaxed">{notif.body}</p>
              <p className="text-[#3A3A3A] text-xs mt-1">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/8">
        <Link to="/notifications" onClick={onClose} className="block w-full text-center text-[#C9A84C] text-xs hover:text-[#E2C36A] transition-colors py-1">
          View all notifications
        </Link>
      </div>
    </div>
  )
}
