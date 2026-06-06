/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Tajawal', 'sans-serif'],
        english: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          dark: '#5B52E8',
          light: '#8B84FF',
        },
        secondary: {
          DEFAULT: '#00D9A5',
          dark: '#00B88A',
          light: '#33E6B8',
        },
        gold: {
          DEFAULT: '#FFD700',
          dark: '#E6C200',
          light: '#FFED4A',
        },
        accent: '#FF6B6B',
        surface: {
          DEFAULT: '#1E293B',
          light: '#FFFFFF',
        },
        background: {
          DEFAULT: '#0F172A',
          light: '#F8F9FA',
        },
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(108,99,255,0.4)',
        'glow-green': '0 0 20px rgba(0,217,165,0.4)',
        'glow-gold': '0 0 20px rgba(255,215,0,0.3)',
        card: '0 4px 24px rgba(0,0,0,0.12)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'typewriter': 'typewriter 3s steps(40,end) 1s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(108,99,255,0)' },
          '50%': { boxShadow: '0 0 30px rgba(108,99,255,0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
