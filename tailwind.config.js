/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}