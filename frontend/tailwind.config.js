/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00467f",
        secondary: "#0080a7",
        hmblue: {
          50: "#e5f3ff",
          100: "#b2dcff",
          200: "#7fc6ff",
          300: "#4cafff",
          400: "#1998ff",
          500: "#007ee5",
          600: "#0062b2",
          700: "#00467f",
          800: "#002a4c",
          900: "#00172a",
        },
      },
      spacing: {
        mainContent: "1280px",
        navHeight: "60px",
        sideBarWidth: "230px",
      },
      boxShadow: {
        basic: "0 0px 10px -4px rgba(0, 0, 0, 0.3)",
      },
      fontFamily: {
        bungee: ["Bungee-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
