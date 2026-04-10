// Inlined at build time. Set VITE_BACKEND_URL in CI/Render for a custom API host.
export const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV
    ? "http://localhost:4000"
    : "https://sweet-home-online-store.onrender.com");
