interface LogoIconProps {
  className?: string;
}

export function LogoIcon({ className }: LogoIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="rankEye" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="70%" stopColor="#0066cc" />
          <stop offset="100%" stopColor="#003366" />
        </radialGradient>
        <linearGradient id="rankGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffec8b" />
          <stop offset="50%" stopColor="#daa520" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <linearGradient id="rankFrame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a5560" />
          <stop offset="50%" stopColor="#2d3748" />
          <stop offset="100%" stopColor="#1a202c" />
        </linearGradient>
      </defs>

      <circle cx="16" cy="16" r="14.5" fill="url(#rankFrame)" stroke="url(#rankGold)" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="url(#rankGold)" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.8" />
      <path
        d="M5 16c3.2-5.2 7.5-8 11-8s7.8 2.8 11 8c-3.2 5.2-7.5 8-11 8S8.2 21.2 5 16z"
        fill="#0f172a"
        stroke="url(#rankGold)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="5" fill="url(#rankEye)" stroke="#00f0ff" strokeWidth="0.5" />
      <circle cx="16" cy="16" r="2.2" fill="#001a33" />
      <circle cx="14.3" cy="14.3" r="1.3" fill="#ffffff" opacity="0.8" />
      <path d="M16 2.5v2M16 27.5v2M2.5 16h2M27.5 16h2" stroke="url(#rankGold)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
