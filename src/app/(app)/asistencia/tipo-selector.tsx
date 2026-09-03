import Link from "next/link";
import type { TipoAsistencia } from "@/lib/types/database";

const OPCIONES: { valor: TipoAsistencia; label: string }[] = [
  { valor: "entrada", label: "Entrada" },
  { valor: "salida", label: "Salida" },
  { valor: "permiso", label: "Permiso" },
];

export function TipoSelector({
  tipoActual,
  query,
}: {
  tipoActual: TipoAsistencia;
  query: string;
}) {
  return (
    <div className="inline-flex rounded-md border border-brand-300 bg-white p-1">
      {OPCIONES.map((op) => {
        const params = new URLSearchParams();
        params.set("tipo", op.valor);
        if (query) params.set("buscar", query);
        const activo = op.valor === tipoActual;
        return (
          <Link
            key={op.valor}
            href={`/asistencia?${params.toString()}`}
            className={
              activo
                ? "rounded px-4 py-1.5 text-sm font-medium bg-brand-900 text-white"
                : "rounded px-4 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-100"
            }
          >
            {op.label}
          </Link>
        );
      })}
    </div>
  );
}
