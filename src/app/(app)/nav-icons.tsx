type IconProps = { className?: string };

const shared = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function InicioIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function AsistenciaIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.3 2.4 2.4 4.6-4.9" />
    </svg>
  );
}

export function AlumnosIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c.7-3 2.8-4.5 5.5-4.5s4.8 1.5 5.5 4.5" />
      <circle cx="17" cy="9.5" r="2.3" />
      <path d="M15.5 14.6c2.1.3 3.6 1.7 4.1 4.1" />
    </svg>
  );
}

export function PagosIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <rect x="3" y="6" width="18" height="12" rx="1.8" />
      <path d="M3 10h18" />
      <path d="M6.5 14.3h3" />
    </svg>
  );
}

export function CiclosIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M20 11a8 8 0 1 0-2.6 6.2" />
      <path d="M20 5.5V11h-5.5" />
    </svg>
  );
}

export function NotasIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <rect x="5.5" y="3.5" width="13" height="17" rx="1.8" />
      <path d="M9 8h6M9 12h6M9 16h3.5" />
    </svg>
  );
}
