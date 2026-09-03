"use client";

import { useState, useTransition } from "react";
import { marcarManual } from "./actions";
import { construirLinkAsistenciaWhatsapp } from "@/lib/utils/whatsapp";
import { ETIQUETA_TIPO_ASISTENCIA as ETIQUETA } from "@/lib/utils/asistencia-labels";
import type { TipoAsistencia } from "@/lib/types/database";

export function MarcarManualBoton({
  alumnoId,
  nombreCompleto,
  telefonoApoderado,
  tieneWhatsapp,
  tipo,
}: {
  alumnoId: string;
  nombreCompleto: string;
  telefonoApoderado: string | null;
  tieneWhatsapp: boolean;
  tipo: TipoAsistencia;
}) {
  const [pending, startTransition] = useTransition();
  const [marcado, setMarcado] = useState(false);

  if (marcado) {
    return (
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-green-700">
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

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await marcarManual(alumnoId, tipo);
          setMarcado(true);
        });
      }}
      className="rounded-md bg-brand-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
    >
      {pending ? "Marcando..." : `Marcar ${ETIQUETA[tipo].toLowerCase()}`}
    </button>
  );
}
