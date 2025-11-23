/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-neo': 'linear-gradient(145deg, #f0f4f8, #d1d9e6)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      },
      boxShadow: {
        'neo': '8px 8px 16px var(--neo-shadow-dark), -8px -8px 16px var(--neo-shadow-light)',
        'neo-glow': 'var(--neo-glow-primary), 8px 8px 16px var(--neo-shadow-dark), -8px -8px 16px var(--neo-shadow-light)',
        'neo-glow-secondary': 'var(--neo-glow-secondary), 8px 8px 16px var(--neo-shadow-dark), -8px -8px 16px var(--neo-shadow-light)',
        'neo-inset': 'inset 8px 8px 16px var(--neo-shadow-dark), inset -8px -8px 16px var(--neo-shadow-light)',
        'neo-sm': '4px 4px 8px var(--neo-shadow-dark), -4px -4px 8px var(--neo-shadow-light)',
        'neo-lg': '12px 12px 24px var(--neo-shadow-dark), -12px -12px 24px var(--neo-shadow-light)',
        'glass-neon': '0 8px 32px rgba(0, 0, 0, 0.8), var(--neo-glow-primary)',
        'glass-neon-strong': '0 12px 40px rgba(0, 0, 0, 0.9), var(--neo-glow-primary)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      colors: {
        // Neon Dark Theme Colors
        'neo-bg': '#0a0a0f',
        'neo-surface': '#1a1a2e',
        'neo-primary': '#00ffff',
        'neo-secondary': '#ff00ff',
        'neo-accent': '#00ff88',
        'neo-pink': '#ff0080',
        // Universal colors (now always dark neon)
        'neo-bg-var': 'var(--neo-bg)',
        'neo-surface-var': 'var(--neo-surface)',
        'neo-primary-var': 'var(--neo-primary)',
        'neo-secondary-var': 'var(--neo-secondary)',
      },
      transitionProperty: {
        'neo': 'all',
      },
      transitionDuration: {
        'neo': '300ms',
      },
      transitionTimingFunction: {
        'neo': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
  safelist: [
    // Ensure these classes are not purged
    'glass',
    'glass-strong',
    'shadow-neo',
    'shadow-neo-lg',
    'shadow-glass',
    'shadow-glass-dark',
    'text-neo-primary',
    'text-neo-secondary',
    'bg-neo-surface',
    'bg-neo-bg',
    'transition-neo',
    'hover:scale-105',
    'hover:scale-[1.02]',
    'opacity-0',
    'opacity-100',
    'scale-95',
    'scale-100'
  ]
}
