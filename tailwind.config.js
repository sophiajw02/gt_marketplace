/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tech-gold': '#B3A369',
        'navy-blue': '#003057',
        'navy-hover': '#052036',
        'navy-line': '#1b4263',
        'tech-medium-gold': '#A4925A',
        'tech-dark-gold': '#857437',
        'gray-matter': ' #54585A',
        'pi-mile': '#D6DBD4',
        'diploma': '#F9F6E5',
        'buzz-gold': '#EAAA00'
      }
    },
  },
  plugins: [
  ],
}