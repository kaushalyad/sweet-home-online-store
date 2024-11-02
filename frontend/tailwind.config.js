/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      extend: {
        screens: {
          small_mobile: "350px",
          mobile: "420px",
          tablet: "768px",
          desktop: "1350px",
          large_desktop: "1500px",
        },
      },
      animation: {
        dot1: "dot 1s infinite ease-in-out",
        dot2: "dot 1s infinite ease-in-out 0.2s",
        dot3: "dot 1s infinite ease-in-out 0.4s",
      },
      keyframes: {
        dot: {
          "0%, 100%": { opacity: 0 }, // Start and end with invisible
          "50%": { opacity: 1 }, // Fully visible in the middle
        },
      },
    },
  },
  plugins: [],
};
