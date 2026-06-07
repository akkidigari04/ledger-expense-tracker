/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        ink:   { DEFAULT: '#0f0f0f', 50: '#f5f5f0', 100: '#e8e8e0' },
        sage:  { DEFAULT: '#4a7c59', light: '#6a9c79', dark: '#2d5c3a', pale: '#e8f0ea' },
        clay:  { DEFAULT: '#c0572b', light: '#e07a52', dark: '#8c3b1c', pale: '#faeee8' },
        sand:  { DEFAULT: '#e8dcc8', dark: '#c4b49a', light: '#f5f0e8' },
        cream: '#faf8f4',
      },
      animation: {
        'slide-up':   'slideUp 0.3s ease-out',
        'fade-in':    'fadeIn 0.2s ease-out',
        'scale-in':   'scaleIn 0.15s ease-out',
      },
      keyframes: {
        slideUp:  { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        scaleIn:  { from: { opacity: 0, transform: 'scale(0.96)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
