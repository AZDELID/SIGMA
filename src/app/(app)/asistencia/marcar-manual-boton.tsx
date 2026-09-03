"use client";

import { useTransition } from "react";
import { marcarEntradaManual, marcarPermiso, marcarSalida } from "./actions";
import { construirLinkAsistenciaWhatsapp } from "@/lib/utils/whatsapp";

const ACCION = {
  entrada: marcarEntradaManual,
  salida: marcarSalida,
  permiso: marcarPermiso,
} as const;
const ETIQUETA: Record<"entrada" | "salida" | "permiso", string> = {
  entrada: "Entrada",
  salida: "Salida",
  permiso: "Permiso",
};

export function MarcarManualBoton({
  alumnoId,
  nombreCompleto,
  telefonoApoderado,
  tieneWhatsapp,
  tipo,
  marcado,
  bloqueadoPor,
}: {
  alumnoId: string;
  nombreCompleto: string;
  telefonoApoderado: string | null;
  tieneWhatsapp: boolean;
  tipo: "entrada" | "salida" | "permiso";
  /** Salida y permiso son mutuamente excluyentes por registro: solo uno de
   * los dos se marca por alumno y día. No aplica a "entrada". */
  marcado: boolean;
  bloqueadoPor?: string;
}) {
  const [pending, startTransition] = useTransition();

  // marcado viene del registro del día en el servidor (recalculado tras cada
  // revalidatePath), no de estado local: así, si el alumno aparece varias
  // veces en la vista, todas sus instancias quedan consistentes entre sí.
  if (marcado) {
    return (
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-brand-success">
          {ETIQUETA[tipo]} registrada
        </span>
        {telefonoApoderado && tieneWhatsapp && (
          <a
            href={construirLinkAsistenciaWhatsapp(
              telefonoApoderado,
              nombreCompleto,
              tipo
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
          >
            Enviar WhatsApp
          </a>
        )}
      </div>
    );
  }

  if (bloqueadoPor) {
    return (
      <span
        title={`Ya se registró ${bloqueadoPor.toLowerCase()} hoy; no se puede marcar ${ETIQUETA[tipo].toLowerCase()} también.`}
        className="cursor-not-allowed rounded-md border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-400"
      >
        {`Marcar ${ETIQUETA[tipo].toLowerCase()}`}
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await ACCION[tipo](alumnoId);
        });
      }}
      className="rounded-md bg-brand-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
    >
      {pending ? "Marcando..." : `Marcar ${ETIQUETA[tipo].toLowerCase()}`}
    </button>
  );
}
