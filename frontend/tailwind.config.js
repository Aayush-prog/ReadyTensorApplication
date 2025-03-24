/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "320px",
      md: "425px",
      lg: "768px",
      xl: "1024px",
      "2xl": "1440px",
    },
    fontFamily: {
      sans: ['"Roboto"', "sans-serif"],
    },
    extend: {
      colors: {
        blue: "#23A6F0",
        green: "#63C132",
        primary: "#2C2A4A",
        white: "#FFFFFF",
        grey: "#D9D9D9",
        red: "#E44A24",
      },
    },
  },
  plugins: [],
};
