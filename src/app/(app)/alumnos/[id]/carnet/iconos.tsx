// Íconos simples en SVG, dibujados a mano — sin depender de una librería
// de íconos solo para 6 símbolos que se usan únicamente en el carnet.
type IconoProps = { className?: string };

export function IconoPersona({ className }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8v1H4v-1z" />
    </svg>
  );
}

export function IconoEngranaje({ className }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm9 3.5c0-.6-.05-1.1-.13-1.6l1.9-1.5-1.9-3.3-2.3.6a7.7 7.7 0 0 0-1.4-.8l-.4-2.4H9.2l-.4 2.4c-.5.2-1 .5-1.4.8l-2.3-.6-1.9 3.3 1.9 1.5c-.08.5-.13 1-.13 1.6s.05 1.1.13 1.6l-1.9 1.5 1.9 3.3 2.3-.6c.4.3.9.6 1.4.8l.4 2.4h5.6l.4-2.4c.5-.2 1-.5 1.4-.8l2.3.6 1.9-3.3-1.9-1.5c.08-.5.13-1 .13-1.6z" />
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

export function IconoCalendario({ className }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

export function IconoBirrete({ className }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3 1 8l11 5 9-4.1V16h2V8L12 3z" />
      <path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5l-6 2.7-6-2.7z" />
    </svg>
  );
}

export function IconoLibro({ className }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13z" />
      <path d="M20 5.5C20 4.7 19.3 4 18.5 4H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13z" />
    </svg>
  );
}
