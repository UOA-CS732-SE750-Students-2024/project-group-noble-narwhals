/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00467f",
        secondary: "#0080a7",
        openai: "#739d92",
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
        bg1: "rgba(170, 210, 242, 0.37)",
        bg2: "rgba(0, 70, 127, 0.4)",
      },
      spacing: {
        mainContent: "1280px",
        navHeight: '60px',
        createImageHeight: 'calc(100vh - 60px)',
        createImageHeight2: 'calc(100vh + 256px)',

        sideBarWidth: "230px",
        searchContentHeight: 'calc(100vh - 60px - 256px - 224px - 128px - 16px)',
        

      },
      boxShadow: {
        basic: "0 0px 10px -4px rgba(0, 0, 0, 0.3)",
      },
      fontFamily: {
        bungee: ["Bungee-Regular", "sans-serif"],
      },
      animation: {
        'spin-slow': 'spin 1s ease infinite',  
      },
      keyframes: {
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
};
