import type { CampoAlumno } from "./actions";

/** Borde rojo si este campo es el que falló, el borde normal si no. */
export function claseCampo(
  campo: CampoAlumno,
  campoConError: CampoAlumno | undefined
): string {
  const base = "w-full rounded-md border bg-brand-surface px-3 py-2 text-sm text-brand-field";
  return campo === campoConError
    ? `${base} border-brand-red-300 focus:border-brand-red`
    : `${base} border-brand-300`;
}

export function MensajeCampo({
  campo,
  campoConError,
  mensaje,
}: {
  campo: CampoAlumno;
  campoConError: CampoAlumno | undefined;
  mensaje: string | null | undefined;
}) {
  if (campo !== campoConError || !mensaje) return null;
  return <p className="mt-1 text-xs text-brand-red-dark">{mensaje}</p>;
}
