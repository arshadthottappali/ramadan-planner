/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF7',
        'cream-dark': '#F4F1EA',
        primary: '#1A4D2E', // Deep Green
        secondary: '#D4AF37', // Gold
        accent: '#E8F5E9', // Light Green
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Amiri', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
