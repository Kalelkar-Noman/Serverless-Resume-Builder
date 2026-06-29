/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          base: 'var(--brand-base)',
          card: 'var(--brand-card)',
          'card-hover': 'var(--brand-card-hover)',
          accent: 'var(--brand-accent)',
          main: 'var(--brand-main)',
          muted: 'var(--brand-muted)',
          border: 'var(--brand-border)',
        },
      },
    },
  },
  plugins: [],
};
