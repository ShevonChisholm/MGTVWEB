type BadgeVariant = 'premium' | 'free' | 'new' | 'live' | 'exclusive'

interface BadgeProps {
  variant: BadgeVariant
  className?: string
}

const styles: Record<BadgeVariant, string> = {
  premium: 'bg-[#C9A84C] text-[#0A0A0A] font-bold',
  free: 'bg-[#1E1E1E] text-[#A3A3A3] border border-[#3A3A3A]',
  new: 'bg-[#1E3A1E] text-[#4ADE80] border border-[#4ADE80]/30',
  live: 'bg-red-600 text-white animate-pulse',
  exclusive: 'bg-[#2A2010] text-[#C9A84C] border border-[#C9A84C]/40',
}

const labels: Record<BadgeVariant, string> = {
  premium: 'MGTV+',
  free: 'FREE',
  new: 'NEW',
  live: '● LIVE',
  exclusive: 'EXCLUSIVE',
}

export function Badge({ variant, className = '' }: BadgeProps) {
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] tracking-wider rounded ${styles[variant]} ${className}`}>
      {labels[variant]}
    </span>
  )
}
