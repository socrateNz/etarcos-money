interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * The Tacynt Money app mark: three ascending bars (growth) on an
 * indigo-to-violet gradient badge. Inlined as SVG (not <img src="/logo.svg">)
 * so it never causes a network request and stays crisp at any size.
 */
export function Logo({ size = 40, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label="Tacynt Money"
      className={className}
    >
      <defs>
        <linearGradient id="tacynt-logo-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="26" fill="url(#tacynt-logo-gradient)" />
      <rect x="28" y="54" width="10" height="22" rx="5" fill="#ffffff" />
      <rect x="44" y="42" width="10" height="34" rx="5" fill="#ffffff" />
      <rect x="60" y="30" width="10" height="46" rx="5" fill="#ffffff" />
    </svg>
  );
}
