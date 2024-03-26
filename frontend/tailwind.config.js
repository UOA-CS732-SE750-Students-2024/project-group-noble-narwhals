/** @type {import('tailwindcss').Config} */
const { NAV_HEIGHT } = require('./src/utils/constants');
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00467f",
        secondary: "#0080a7",
      },
      spacing: {
        main_content: "1280px",
        nav_height: `${NAV_HEIGHT}px`,
      }
    },
  },
  plugins: [],
};
