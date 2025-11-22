import { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-neo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background relative overflow-hidden',
  {
    variants: {
      variant: {
        // Manter variantes existentes para compatibilidade
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        ghost: 'hover:bg-gray-100 text-gray-700',
        // NOVAS variantes neomorphism
        neo: 'bg-gradient-to-br from-neo-surface to-white shadow-neo hover:shadow-neo-lg hover:scale-[1.02] text-neo-secondary border border-white/20',
        glass: 'glass shadow-glass hover:bg-white/20 text-neo-secondary hover:text-neo-primary',
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
