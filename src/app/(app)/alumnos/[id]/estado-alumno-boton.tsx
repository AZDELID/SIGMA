"use client";

import { useTransition } from "react";
import { darDeBajaAlumno, reactivarAlumno } from "../actions";

export function EstadoAlumnoBoton({
  alumnoId,
  activo,
  nombreCompleto,
}: {
  alumnoId: string;
  activo: boolean;
  nombreCompleto: string;
}) {
  const [pending, startTransition] = useTransition();

  if (activo) {
    return (
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          const confirmado = window.confirm(
            `¿Dar de baja a ${nombreCompleto}? No podrá marcar asistencia ni matricularse en nuevos ciclos hasta que lo reactives.`
          );
          if (confirmado) {
            startTransition(() => darDeBajaAlumno(alumnoId));
          }
        }}
        className="rounded-md border border-brand-red-300 bg-brand-surface px-3 py-1.5 text-sm text-brand-red-dark hover:bg-brand-red-50 disabled:opacity-50"
      >
        {pending ? "Procesando..." : "Dar de baja"}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => reactivarAlumno(alumnoId))}
      className="rounded-md border border-green-300 bg-brand-surface px-3 py-1.5 text-sm text-brand-success hover:bg-green-50 disabled:opacity-50"
    >
      {pending ? "Procesando..." : "Reactivar"}
    </button>
  );
}
