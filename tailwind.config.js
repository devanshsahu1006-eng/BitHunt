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
        doom: {
          950: '#020504',
          900: '#040b08',
          850: '#06130e',
          800: '#0a1d16',
          750: '#0d271e',
          700: '#113327',
          600: '#174737',
          500: '#1e614b',
          400: '#278365',
          300: '#10b981',
          200: '#34d399',
          100: '#6ee7b7',
          50: '#a7f3d0',
          plasma: '#00ff88',
          electric: '#00ffcc',
          acid: '#39ff14',
          gold: '#eab308',
        },
        metallic: {
          950: '#06080a',
          900: '#0b0f12',
          800: '#12171c',
          700: '#1e252d',
          600: '#2c3540',
          500: '#475569',
          400: '#64748b',
          300: '#94a3b8',
          200: '#cbd5e1',
          100: '#f1f5f9',
        }
      },
      fontFamily: {
        inscriptional: ['Cinzel', 'Marcellus', 'Georgia', 'serif'],
        cinematic: ['Cinzel', 'Marcellus', 'serif'],
        marcellus: ['Marcellus', 'Cinzel', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'doom-sm': '0 0 10px rgba(0, 255, 136, 0.25)',
        'doom': '0 0 20px rgba(0, 255, 136, 0.45)',
        'doom-lg': '0 0 45px rgba(0, 255, 136, 0.65)',
        'doom-inset': 'inset 0 0 20px rgba(0, 255, 136, 0.3)',
        'metallic': '0 10px 30px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(0, 255, 136, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 35px rgba(0, 255, 136, 0.85))' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      }
    },
  },
  plugins: [],
}
