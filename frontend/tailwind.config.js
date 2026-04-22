/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2B4B',
          light: '#243660',
          dark: '#131F36',
        },
        gold: {
          DEFAULT: '#C4922A',
          light: '#D4A843',
          dark: '#A87820',
        },
        cream: {
          DEFAULT: '#FAF8F5',
          dark: '#F0EDE8',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
