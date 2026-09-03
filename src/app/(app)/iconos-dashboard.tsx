// Íconos para las tarjetas del dashboard — mismo criterio que
// alumnos/[id]/carnet/iconos.tsx (SVG a mano, sin librería), pero en un
// archivo aparte para no tocar el del carnet ya aprobado.
type IconoProps = { className?: string };

export function IconoPersona({ className }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8v1H4v-1z" />
    </svg>
  );
}

export function IconoReloj({ className }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconoMoneda({ className }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path
        d="M9.5 15c0 1.1 1.1 2 2.5 2s2.5-.7 2.5-1.8c0-2.4-5-1-5-3.4C9.5 10.7 10.6 10 12 10s2.5.9 2.5 2"
        strokeLinecap="round"
      />
      <path d="M12 8v1.2M12 14.8V16" strokeLinecap="round" />
    </svg>
  );
}

export function IconoAlerta({ className }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 4 2.5 20h19L12 4z" strokeLinejoin="round" />
      <path d="M12 10.5v4" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  );
}
