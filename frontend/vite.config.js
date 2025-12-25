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
    sourcemap: false, // Disable sourcemaps in production for smaller size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React core libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI and animation libraries
          'ui-vendor': ['framer-motion', 'react-icons', 'react-loading-skeleton'],
          // Form and toast libraries
          'utils-vendor': ['react-toastify', 'react-hot-toast'],
          // Razorpay and analytics
          'analytics-vendor': ['axios']
        },
        // Generate unique filenames with content hash
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
    },
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Reduce chunk size
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'react-hot-toast',
      'framer-motion',
      'react-icons',
      'react-toastify'
    ],
  },
});
