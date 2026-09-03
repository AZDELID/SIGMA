"use client";

import { useTransition } from "react";
import { eliminarAsistencia } from "./actions";

export function EliminarAsistenciaBoton({
  id,
  nombreCompleto,
}: {
  id: string;
  nombreCompleto: string;
}) {
  const [eliminando, startEliminar] = useTransition();

  return (
    <button
      type="button"
      disabled={eliminando}
      onClick={() => {
        const confirmado = window.confirm(
          `¿Eliminar el registro de asistencia de hoy de ${nombreCompleto} (entrada, salida y permiso)? Esto no se puede deshacer.`
        );
        if (confirmado) {
          startEliminar(() => eliminarAsistencia(id));
        }
      }}
      className="text-xs text-brand-red-dark hover:text-brand-red-darker disabled:opacity-50"
    >
      {eliminando ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
