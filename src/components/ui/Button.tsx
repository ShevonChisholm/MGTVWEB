import { type ButtonHTMLAttributes, type Ref } from 'react'
import { Link, type LinkProps } from 'react-router'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
  variant?: Variant
  size?: Size
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

const base = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-300 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed'

export function Button({ children, variant = 'primary', size = 'md', className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

export function ButtonLink({ variant = 'primary', size = 'md', className = '', ...props }: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link {...props} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} />
}
