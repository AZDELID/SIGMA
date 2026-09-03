"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { marcarPorCodigo, type MarcarPorCodigoState } from "./actions";
import { QrScanner } from "./qr-scanner";
import { construirLinkAsistenciaWhatsapp } from "@/lib/utils/whatsapp";
import { ETIQUETA_TIPO_ASISTENCIA as ETIQUETA } from "@/lib/utils/asistencia-labels";
import type { TipoAsistencia } from "@/lib/types/database";

const initialState: MarcarPorCodigoState = { error: null };

export function CodigoForm({ tipo }: { tipo: TipoAsistencia }) {
  const [state, formAction, pending] = useActionState(
    marcarPorCodigo,
    initialState
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [mostrarCamara, setMostrarCamara] = useState(false);

  useEffect(() => {
    if (!pending && inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, [pending, state]);

  function marcarConCodigo(codigo: string) {
    setMostrarCamara(false);
    const fd = new FormData();
    fd.set("codigo", codigo);
    fd.set("tipo", tipo);
    formAction(fd);
  }

  return (
    <div className="rounded-lg border border-brand-200 bg-white p-4">
      <form action={formAction} className="flex gap-2">
        <input type="hidden" name="tipo" value={tipo} />
        <input
          ref={inputRef}
          name="codigo"
          autoFocus
          autoComplete="off"
          placeholder={`Escanea el carnet o escribe el código y presiona Enter (${ETIQUETA[tipo]})`}
          className="flex-1 rounded-md border border-brand-300 bg-white px-3 py-3 text-base text-black"
        />
        <button
          type="submit"
          className="rounded-md bg-brand-900 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          Marcar
        </button>
        <button
          type="button"
          onClick={() => setMostrarCamara((v) => !v)}
          className="rounded-md border border-brand-300 bg-white px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
        >
          📷 Escanear con cámara
        </button>
      </form>

      {mostrarCamara && (
        <div className="mt-3">
          <QrScanner
            onDetected={marcarConCodigo}
            onClose={() => setMostrarCamara(false)}
          />
        </div>
      )}

      {state.error && (
        <p className="mt-3 rounded-md bg-brand-red-50 px-3 py-2 text-sm text-brand-red-dark">
          {state.error}
        </p>
      )}
      {state.ok && (
        <div
          className={
            state.ok.yaEstabaMarcado
              ? "mt-3 flex flex-wrap items-center gap-2 rounded-md bg-brand-yellow-50 px-3 py-2 text-sm text-brand-yellow-dark"
              : "mt-3 flex flex-wrap items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700"
          }
        >
          <span>
            {state.ok.yaEstabaMarcado
              ? `${state.ok.alumno} — ya tenía "${ETIQUETA[state.ok.tipo]}" registrada hoy, se registró otra.`
              : `${ETIQUETA[state.ok.tipo]} registrada: ${state.ok.alumno}.`}
          </span>
          {state.ok.telefonoApoderado && (
            <a
              href={construirLinkAsistenciaWhatsapp(
                state.ok.telefonoApoderado,
                state.ok.alumno,
                state.ok.tipo
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
            >
              Enviar WhatsApp al apoderado
            </a>
          )}
        </div>
      )}
    </div>
  );
}
