// Inlined at build time. Set VITE_BACKEND_URL in CI/Render for a custom API host.
const localBackendUrl = 'http://localhost:4000';
const prodBackendUrl = 'https://sweet-home-online-store.onrender.com';

const isLocalHost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|0\.0\.0\.0|::1|192\.168\.|10\.|172\.|.*\.local|.*\.test)$/.test(window.location.hostname);
const isNonProdHost = typeof window !== 'undefined' && !['sweet-home-online-store.onrender.com', 'www.sweet-home-online-store.onrender.com'].includes(window.location.hostname);

export const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV || isLocalHost || isNonProdHost ? localBackendUrl : prodBackendUrl);
