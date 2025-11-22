import { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-neo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background relative overflow-hidden',
  {
    variants: {
      variant: {
        // Manter variantes existentes para compatibilidade
        default: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
        ghost: 'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300',
        // NOVAS variantes neomorphism
        neo: 'bg-gradient-to-br from-neo-surface to-white shadow-neo hover:shadow-neo-lg hover:scale-[1.02] text-neo-secondary border border-white/20 dark:from-neo-surface dark:to-gray-700 dark:border-gray-600 dark:text-neo-secondary',
        glass: 'glass shadow-glass hover:bg-white/20 text-neo-secondary hover:text-neo-primary dark:shadow-glass-dark dark:hover:bg-gray-800/50',
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
