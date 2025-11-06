/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        main: 'var(--color-main)',
        'card-border-light': 'var(--color-card-border-light)',
        'text-light': 'var(--color-text-light)',
        'card-dark': 'var(--color-card-dark)',
        'text-dark': 'var(--color-text-dark)',
        logout: 'var(--color-logout)',
      },
      boxShadow: {
        base: '0px 4px 4px 0px rgba(0,0,0,0.05)',
      },
      keyframes: {
        stretch: {
          '0%, 100%': { transform: 'scaleY(1)', opacity: '0.6' },
          '50%': { transform: 'scaleY(2)', opacity: '1' },
        },
      },
      animation: {
        stretch: 'stretch 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
