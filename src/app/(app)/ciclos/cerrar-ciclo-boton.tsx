"use client";

import { useTransition } from "react";
import { cerrarCiclo } from "./actions";

export function CerrarCicloBoton({
  cicloId,
  nombre,
}: {
  cicloId: string;
  nombre: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const confirmado = window.confirm(
          `¿Cerrar el ciclo "${nombre}"? Ya no se podrán registrar nuevas matrículas en él.`
        );
        if (confirmado) {
          startTransition(() => {
            cerrarCiclo(cicloId);
          });
        }
      }}
      className="text-xs text-brand-600 hover:text-brand-900 disabled:opacity-50"
    >
      {pending ? "Cerrando..." : "Cerrar"}
    </button>
  );
}
