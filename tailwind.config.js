/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: { 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7' },
        pqc: { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
        surface: {
          base: '#020617',
          raised: '#0f172a',
          overlay: '#1e293b',
          border: '#334155',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
};
