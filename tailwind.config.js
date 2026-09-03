/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#660000',
        'brand-red': '#B30000',
        gold: '#D4AF37',
        'surface-dark': '#120202',
        'text-light': '#FFFFFF',
      },
      fontFamily: {
        marker: ['"Permanent Marker"', 'cursive'],
        sans: ['Montserrat', 'Inter', 'sans-serif'],
        cursive: ['Caveat', 'cursive'],
      }
    },
  },
  plugins: [],
}
