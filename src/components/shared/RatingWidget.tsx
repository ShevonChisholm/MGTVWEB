import { useState } from 'react'
import { useInteraction } from '@/context/InteractionContext'
import { useToast } from '@/context/ToastContext'

interface RatingWidgetProps {
  id: string
  label?: string
}

export function RatingWidget({ id, label = 'Rate this' }: RatingWidgetProps) {
  const { getRating, rateItem } = useInteraction()
  const { addToast } = useToast()
  const [hovered, setHovered] = useState<number | null>(null)
  const [editing, setEditing] = useState(false)

  const current = getRating(id)
  const display = hovered ?? current

  const handleRate = (rating: number) => {
    rateItem(id, rating)
    setEditing(false)
    addToast(`You rated this ${rating}/10`, 'success')
  }

  if (current !== null && !editing) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-3 py-1.5">
          <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-[#C9A84C] text-sm font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
            {current}/10
          </span>
          <span className="text-[#4A4A4A] text-xs ml-1">your rating</span>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-[#4A4A4A] hover:text-[#A3A3A3] transition-colors cursor-pointer"
          title="Edit rating"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[#4A4A4A] text-[10px] font-semibold tracking-[0.2em] uppercase">{label}</p>
      <div
        className="flex gap-1"
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            onMouseEnter={() => setHovered(n)}
            onClick={() => handleRate(n)}
            className={`w-7 h-7 text-[11px] font-bold transition-all duration-100 cursor-pointer ${
              display !== null && n <= display
                ? 'bg-[#C9A84C] text-[#0A0A0A]'
                : 'bg-[#1A1A1A] text-[#4A4A4A] hover:bg-[#C9A84C]/20 hover:text-[#C9A84C]'
            }`}
            style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}
          >
            {n}
          </button>
        ))}
      </div>
      {display && (
        <p className="text-[#6B6B6B] text-xs">
          {display <= 3 ? 'Not for me' : display <= 5 ? 'It was okay' : display <= 7 ? 'Good' : display <= 9 ? 'Great' : 'Perfect'}
        </p>
      )}
    </div>
  )
}
