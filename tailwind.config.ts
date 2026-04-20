import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FBF3F6',
          100: '#F5E3EB',
          200: '#E8CED8',
          300: '#D4A5B8',
          400: '#C08BA0',
          500: '#B07090',
          600: '#9A5A7D',
          700: '#7D4566',
          800: '#603350',
          900: '#4A2640',
        },
        rose: {
          gold: '#D4A5B8',
          dark: '#C08BA0',
          light: '#E8CED8',
        },
        cream: {
          DEFAULT: '#F8F2F0',
          dark: '#F0E6E2',
        },
        mauve: {
          DEFAULT: '#C9A5B5',
          dark: '#A88498',
          light: '#E0CBD5',
        },
        surface: '#FFFAF8',
        charcoal: '#3A2C2C',
        muted: '#6B5B5B',
        gold: {
          star: '#D4A574',
        },
        border: '#E8D5D5',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '20px',
        md: '12px',
        sm: '8px',
      },
      boxShadow: {
        soft: '0 10px 25px rgba(212, 165, 184, 0.08)',
        hover: '0 15px 35px rgba(212, 165, 184, 0.15)',
        glow: '0 0 20px rgba(212, 165, 184, 0.2)',
        modal: '0 25px 60px rgba(58, 44, 44, 0.15)',
      },
      maxWidth: {
        container: '1200px',
      },
      keyframes: {
        'sparkle-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'toast-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'toast-out': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'modal-in': {
          '0%': { transform: 'scale(0.95) translateY(10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'modal-out': {
          '0%': { transform: 'scale(1) translateY(0)', opacity: '1' },
          '100%': { transform: 'scale(0.95) translateY(10px)', opacity: '0' },
        },
        'fade-in-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'sparkle-pulse': 'sparkle-pulse 3s ease-in-out infinite',
        'toast-in': 'toast-in 0.4s ease-out forwards',
        'toast-out': 'toast-out 0.3s ease-in forwards',
        'modal-in': 'modal-in 0.3s ease-out forwards',
        'modal-out': 'modal-out 0.2s ease-in forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
