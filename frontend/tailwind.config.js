/** @type {import('tailwindcss').Config} */
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
        nav_height: '60px',
      }
    },
  },
  plugins: [],
};