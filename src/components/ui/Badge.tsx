type BadgeVariant = "premium" | "free" | "new" | "live" | "exclusive"

interface BadgeProps {
  variant: BadgeVariant
  className?: string
}

const styles: Record<BadgeVariant, string> = {
  premium: "bg-[#C9A84C] text-[#0A0A0A] font-bold",
  free: "bg-[#1E1E1E] text-[#A3A3A3] border border-[#3A3A3A]",
  new: "bg-bg-elevated text-text-secondary border border-text-muted/30",
  live: "bg-bg-elevated text-gold border border-gold/30",
  exclusive: "bg-[#2A2010] text-[#C9A84C] border border-[#C9A84C]/40",
}

const labels: Record<BadgeVariant, string> = {
  premium: "MGTV+",
  free: "FREE",
  new: "Sample",
  live: "Live demo",
  exclusive: "MGTV+",
}

export function Badge({ variant, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs tracking-wide rounded ${styles[variant]} ${className}`}
    >
      {labels[variant]}
    </span>
  )
}
