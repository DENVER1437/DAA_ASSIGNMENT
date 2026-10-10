/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#08090B',
        charcoal: {
          950: '#0B0C0E',
          900: '#111216',
          850: '#15161B',
          800: '#18191F',
          700: '#22242C',
          600: '#2F313B',
          500: '#424553',
        },
        crimson: {
          bright: '#FF3B47',
          DEFAULT: '#C62832',
          light: '#E5383B',
          muted: '#843C43',
          dark: '#581C20',
          deep: '#300C0F',
        },
        surface: {
          DEFAULT: '#111216',
          elevated: '#18191F',
          border: 'rgba(255, 255, 255, 0.07)',
          'border-crimson': 'rgba(198, 40, 50, 0.3)',
        },
        offwhite: '#F2F2F3',
        coolgray: '#A1A1AA',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        }
      }
    },
  },
  plugins: [],
}
