import { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-neo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background relative overflow-hidden',
  {
    variants: {
      variant: {
        // Manter variantes existentes para compatibilidade
        default: 'bg-neo-primary text-black hover:bg-neo-primary/80 border border-neo-primary/50',
        outline: 'border border-neo-secondary bg-neo-surface text-neo-secondary hover:bg-neo-surface/80 hover:text-neo-secondary/80',
        ghost: 'hover:bg-neo-surface/50 text-neo-secondary hover:text-neo-secondary/80',
        // Neon theme variants
        neo: 'bg-gradient-to-br from-neo-surface to-black/50 border border-neo-primary/50 shadow-neo-glow hover:shadow-neo-glow text-neo-primary hover:text-white transition-all duration-300 hover:scale-105',
        glass: 'glass-neon shadow-glass-neon hover:border-neo-secondary/60 hover:shadow-neo-glow-secondary text-white hover:text-neo-secondary',
      },
      size: {
        default: 'h-12 py-3 px-6',
        sm: 'h-10 px-4 rounded-lg',
        lg: 'h-14 px-8 rounded-xl text-base',
      },
    },
    defaultVariants: {
      variant: 'neo', // Mudar default para neo
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}
