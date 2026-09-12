interface FilterBarProps {
  filters: string[]
  active: string
  onChange: (f: string) => void
}

export function FilterBar({ filters, active, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-8 md:px-16 py-5">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer ${
            active === f
              ? 'bg-[#C9A84C] text-[#0A0A0A]'
              : 'bg-[#1E1E1E] text-[#A3A3A3] border border-white/10 hover:border-[#C9A84C]/40 hover:text-[#F5F5F5]'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
