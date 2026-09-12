import { type ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
}

const variants: Record<Variant, string> = {
  primary: 'bg-[#C9A84C] text-[#0A0A0A] font-semibold hover:bg-[#E2C36A] shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]',
  outline: 'border border-[#F5F5F5]/60 text-[#F5F5F5] hover:border-[#F5F5F5] hover:bg-[#F5F5F5]/10',
  ghost: 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#1E1E1E]',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

export function Button({ children, variant = 'primary', size = 'md', onClick, className = '', type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md font-medium transition-all duration-150 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
