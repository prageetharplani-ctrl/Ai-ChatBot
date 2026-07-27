import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#16171B',   // app background
          soft: '#1D1F24',      // panel background
          line: '#2A2D34',      // hairline borders
        },
        paper: '#EDEAE3',       // primary text on dark
        muted: '#8B8D97',       // secondary text
        teal: {
          DEFAULT: '#4FA98C',   // primary accent (signature)
          soft: '#3A7F69',
        },
        amber: {
          DEFAULT: '#E8A33D',   // secondary accent (highlights, streaming)
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      keyframes: {
        blink: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        blink: 'blink 1s step-start infinite',
        fadeUp: '0.25s ease-out fadeUp',
      },
    },
  },
  plugins: [],
};

export default config;
