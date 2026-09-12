import { useState, useRef, useEffect, useCallback } from 'react'

interface VideoPlayerProps {
  title: string
  thumbnail?: string
  onEnded?: () => void
}

export function VideoPlayer({ title, thumbnail, onEnded }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [muted, setMuted] = useState(false)
  const [quality, setQuality] = useState('1080p')
  const [showControls, setShowControls] = useState(true)
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const totalDuration = 5400 // 90 min in seconds for simulation

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setShowControls(true)
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false)
    }, 3000)
  }, [playing])

  useEffect(() => {
    if (!playing) { setShowControls(true); return }
    const interval = setInterval(() => {
      setElapsed(e => {
        const next = e + 1
        setProgress((next / totalDuration) * 100)
        if (next >= totalDuration) {
          setPlaying(false)
          onEnded?.()
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [playing, onEnded])

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    const newElapsed = Math.floor(pct * totalDuration)
    setElapsed(newElapsed)
    setProgress(pct * 100)
  }

  const qualities = ['4K', '1080p', '720p', '480p']

  return (
    <div
      className="relative w-full bg-black aspect-video group select-none"
      onMouseMove={scheduleHide}
      onClick={() => { setPlaying(p => !p); scheduleHide() }}
    >
      {/* Poster / background */}
      {thumbnail && (
        <img
          src={thumbnail}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${playing ? 'opacity-20' : 'opacity-60'}`}
        />
      )}

      {/* Play state overlay */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#C9A84C]/90 flex items-center justify-center shadow-2xl">
            <svg className="w-8 h-8 text-[#0A0A0A] ml-1.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Playing animation */}
      {playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      {/* Title top left */}
      <div className={`absolute top-4 left-5 transition-opacity duration-200 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-white text-sm font-medium drop-shadow-lg">{title}</p>
      </div>

      {/* Bottom controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-200 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-t from-black/90 to-transparent px-4 pb-4 pt-12">
          {/* Progress bar */}
          <div
            className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer relative group/bar"
            onClick={seekTo}
          >
            <div
              className="h-full bg-[#C9A84C] rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#C9A84C] opacity-0 group-hover/bar:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={() => setPlaying(p => !p)}
              className="text-white hover:text-[#C9A84C] transition-colors cursor-pointer"
            >
              {playing
                ? <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                : <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              }
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/vol">
              <button
                onClick={() => setMuted(m => !m)}
                className="text-white hover:text-[#C9A84C] transition-colors cursor-pointer"
              >
                {muted || volume === 0
                  ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
                  : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                }
              </button>
              <input
                type="range" min={0} max={100} value={muted ? 0 : volume}
                onChange={e => { setVolume(Number(e.target.value)); setMuted(false) }}
                className="w-16 h-1 accent-[#C9A84C] cursor-pointer opacity-0 group-hover/vol:opacity-100 transition-opacity"
              />
            </div>

            {/* Time */}
            <span className="text-white/70 text-xs tabular-nums">
              {formatTime(elapsed)} / {formatTime(totalDuration)}
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Quality */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowQualityMenu(q => !q) }}
                className="text-white/70 hover:text-white text-xs px-2 py-0.5 border border-white/30 rounded cursor-pointer transition-colors"
              >
                {quality}
              </button>
              {showQualityMenu && (
                <div className="absolute bottom-8 right-0 bg-[#1A1A1A] border border-white/10 rounded-lg overflow-hidden min-w-[80px]">
                  {qualities.map(q => (
                    <button
                      key={q}
                      onClick={(e) => { e.stopPropagation(); setQuality(q); setShowQualityMenu(false) }}
                      className={`w-full px-4 py-2 text-xs text-left cursor-pointer transition-colors ${q === quality ? 'text-[#C9A84C] bg-[#2A2010]' : 'text-white/70 hover:bg-white/5'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button className="text-white hover:text-[#C9A84C] transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
