/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // MIRA brand — deep medical navy + clinical teal accent
        brand: {
          navy:    '#0B1929',
          teal:    '#0EA5A0',
          'teal-light': '#14C4BE',
          'teal-dim':   '#0B8A86',
          slate:   '#1E3A4F',
          muted:   '#4A7A8A',
          surface: '#0F2336',
          border:  '#1D3D54',
        },
        status: {
          normal:   '#22C55E',
          warning:  '#F59E0B',
          danger:   '#EF4444',
          info:     '#3B82F6',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: '0.625rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      keyframes: {
        'pulse-teal': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'slide-up': {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
      },
      animation: {
        'pulse-teal': 'pulse-teal 2s ease-in-out infinite',
        'slide-up':   'slide-up 0.3s ease-out',
        'fade-in':    'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
