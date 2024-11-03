// tailwind.config.js
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
        gradient: "gradient 3s ease infinite",
        slide: "slide 2s ease-in-out infinite",
        rotate: "rotate 3s linear infinite",  // New rotate animation
      },
      keyframes: {
        dot: {
          "0%, 100%": { opacity: 0 },
          "50%": { opacity: 1 },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        slide: {
          "0%": { transform: "translateX(-10px)" },
          "50%": { transform: "translateX(10px)" },
          "100%": { transform: "translateX(-10px)" },
        },
        rotate: {                                   // New keyframes for rotation
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      boxShadow: {
        glow: "0 0 8px 4px rgba(128, 90, 213, 0.6)",  // Soft purple glow around text
      },
    },
  },
  plugins: [],
};
