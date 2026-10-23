import { createElement, type InputHTMLAttributes, type Ref } from 'react'

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  return createElement('input', { ...props, className: `rounded-lg border border-text-muted/40 bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-gold ${className}` })
}
