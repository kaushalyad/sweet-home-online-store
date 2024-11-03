// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 8px rgba(139, 92, 246, 0.4)", // Soft purple glow around text
      },
      screens: {
        small_mobile: "350px",
        mobile: "420px",
        tablet: "768px",
        desktop: "1350px",
        large_desktop: "1500px",
      },
    },
  },
  plugins: [],
};
