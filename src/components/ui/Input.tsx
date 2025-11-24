import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={`flex h-12 w-full rounded-xl border border-neo-primary/30 bg-gradient-to-br from-neo-surface to-black/30 px-4 py-3 text-sm shadow-neo-inset ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neo-text-muted focus-visible:outline-none focus-visible:shadow-neo-glow focus-visible:ring-2 focus-visible:ring-neo-primary/50 focus-visible:border-neo-primary disabled:cursor-not-allowed disabled:opacity-50 transition-neo text-neo-text-primary ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
