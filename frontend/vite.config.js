import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      src: path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx", ".json"],
  },
  server: {
    host: "0.0.0.0",
    port: 4173,
    proxy: {
      "/api": {
        target: "https://api.sweethome-store.com",
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      strict: false,
      allow: [".."],
    },
    hmr: {
      overlay: true,
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom", "react-hot-toast"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "react-hot-toast"],
  },
});
