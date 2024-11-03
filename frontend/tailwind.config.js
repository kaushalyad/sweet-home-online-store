/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        small_mobile: "350px",
        mobile: "420px",
        tablet: "768px",
        desktop: "1350px",
        large_desktop: "1500px",
      },
      animation: {
        dot1: "dot 1s infinite ease-in-out",
        dot2: "dot 1s infinite ease-in-out 0.2s",
        dot3: "dot 1s infinite ease-in-out 0.4s",
        gradient: "gradient 3s ease infinite",       // New gradient animation for text
        slide: "slide 2s ease-in-out infinite",     // New slide animation for lines
      },
      keyframes: {
        dot: {
          "0%, 100%": { opacity: 0 },
          "50%": { opacity: 1 },
        },
        gradient: {                                 // Keyframes for gradient animation
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        slide: {                                    // Keyframes for slide animation
          "0%": { transform: "translateX(-10px)" },
          "50%": { transform: "translateX(10px)" },
          "100%": { transform: "translateX(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
