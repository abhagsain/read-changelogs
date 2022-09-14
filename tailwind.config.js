/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d1117",
        secondary: "#30363d",
        accent: "#4085F7",
      },
    },
  },
  darkMode: "class",
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
