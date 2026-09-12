import { useState, useEffect } from 'react'

interface FilterSection {
  label: string
  options: string[]
}

interface FilterSidebarProps {
  sections?: FilterSection[]
  filters?: string[]
  active: string
  onChange: (f: string) => void
  title?: string
}

export function FilterSidebar({ sections, filters, active, onChange, title = 'Filter' }: FilterSidebarProps) {
  const [open, setOpen] = useState(false)

  const normalisedSections: FilterSection[] = sections ?? [
    { label: title, options: filters ?? [] },
  ]

  // Lock body scroll while panel is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleSelect = (option: string) => {
    onChange(option)
    setOpen(false)
  }

  const totalOptions = normalisedSections.flatMap(s => s.options)
  const defaultOption = totalOptions[0] ?? 'All'
  const isFiltered = active !== defaultOption && active !== 'All'

  return (
    <>
      {/* Trigger button — inline, above the content grid */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2.5 text-[#A3A3A3] text-sm font-medium cursor-pointer group transition-colors duration-150 hover:text-[#F5F5F5]"
        aria-label="Open filters"
      >
        {/* Filter icon */}
        <svg className="w-4 h-4 transition-colors" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M7 9.5h10M11 14.5h2" />
        </svg>
        <span>Filters</span>
        {isFiltered && (
          <span className="flex items-center justify-center w-4 h-4 bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-black rounded-sm">
            1
          </span>
        )}
        {isFiltered && (
          <span className="text-[#C9A84C] text-xs font-semibold">· {active}</span>
        )}
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      {/* Sliding panel */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col bg-[#0D0D0D] w-72 max-w-[88vw] transition-transform duration-300 ease-[cubic-bezier(0.32,0,0.67,0)] ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ willChange: 'transform' }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 pt-8 pb-6 border-b border-white/6">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M7 9.5h10M11 14.5h2" />
            </svg>
            <span className="text-[#F5F5F5] text-sm font-semibold tracking-wide">Filters</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 flex items-center justify-center text-[#4A4A4A] hover:text-[#F5F5F5] transition-colors cursor-pointer"
            aria-label="Close filters"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter sections — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {normalisedSections.map(section => (
            <div key={section.label}>
              <p className="text-[#4A4A4A] text-[9px] font-black tracking-[0.25em] uppercase mb-3">
                {section.label}
              </p>
              <ul className="space-y-px">
                {section.options.map(option => {
                  const isActive = active === option
                  return (
                    <li key={option}>
                      <button
                        onClick={() => handleSelect(option)}
                        className={`w-full text-left py-2.5 px-3 text-sm transition-all duration-150 cursor-pointer flex items-center justify-between group ${
                          isActive
                            ? 'text-[#C9A84C] bg-[#C9A84C]/8'
                            : 'text-[#6B6B6B] hover:text-[#D4D4D4] hover:bg-white/3'
                        }`}
                      >
                        <span>{option}</span>
                        {isActive && (
                          <svg className="w-3.5 h-3.5 text-[#C9A84C] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                          </svg>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Clear button — only when filtered */}
        {isFiltered && (
          <div className="px-6 pb-8 pt-4 border-t border-white/6">
            <button
              onClick={() => handleSelect(defaultOption)}
              className="w-full py-3 text-sm text-[#6B6B6B] hover:text-[#A3A3A3] transition-colors cursor-pointer text-center"
            >
              Clear filter
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
