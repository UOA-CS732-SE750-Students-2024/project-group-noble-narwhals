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
        mainContent: "1280px",
        navHeight: '60px',
      },
      boxShadow: {
        'basic': '0 0px 10px -4px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        bungee: ['Bungee-Regular', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
