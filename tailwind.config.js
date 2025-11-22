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
        'neo': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'neo-inset': 'inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff',
        'neo-sm': '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
        'neo-lg': '12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      colors: {
        'neo-bg': '#e6ebf0',
        'neo-surface': '#f0f4f8',
        'neo-primary': '#4a90e2',
        'neo-secondary': '#7b8ca6',
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
}
