/** Simple laptop + profile illustration (Flipkart-style hero art). */
export default function FlipkartAuthIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 120"
      className={className}
      aria-hidden
    >
      <ellipse cx="100" cy="108" rx="70" ry="8" fill="rgba(255,255,255,0.15)" />
      <rect
        x="40"
        y="28"
        width="120"
        height="72"
        rx="6"
        fill="rgba(255,255,255,0.2)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />
      <rect x="52" y="40" width="96" height="48" rx="4" fill="rgba(255,255,255,0.85)" />
      <circle cx="100" cy="64" r="14" fill="#2874f0" />
      <path
        d="M100 56c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7z"
        fill="#fff"
      />
      <rect x="88" y="100" width="24" height="8" rx="2" fill="rgba(255,255,255,0.35)" />
      <circle cx="156" cy="44" r="10" fill="#ffc200" opacity="0.9" />
      <path
        d="M152 72h16v20h-16z"
        fill="rgba(255,255,255,0.35)"
        transform="rotate(-12 160 82)"
      />
    </svg>
  );
}
