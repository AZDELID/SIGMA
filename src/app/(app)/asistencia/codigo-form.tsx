"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { marcarPorCodigo, type MarcarPorCodigoState } from "./actions";
import { QrScanner } from "./qr-scanner";
import { construirLinkAsistenciaWhatsapp } from "@/lib/utils/whatsapp";

const initialState: MarcarPorCodigoState = { error: null };

function horaLima(iso: string) {
  return new Date(iso).toLocaleTimeString("es-PE", { timeZone: "America/Lima" });
}

export function CodigoForm() {
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
    formAction(fd);
  }

  return (
    <div className="rounded-lg border border-brand-200 bg-brand-surface p-4">
      <form action={formAction} className="space-y-2">
        <input
          ref={inputRef}
          name="codigo"
          autoFocus
          autoComplete="off"
          placeholder="Escanea el carnet o escribe el código (Entrada)"
          className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-3 text-base text-brand-field"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-md bg-brand-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98]"
          >
            Marcar
          </button>
          <button
            type="button"
            onClick={() => setMostrarCamara((v) => !v)}
            className="flex-1 rounded-md border border-brand-300 bg-brand-surface px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
          >
            📷 Cámara
          </button>
        </div>
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
              : "mt-3 flex flex-wrap items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-brand-success"
          }
        >
          <span>
            {state.ok.yaEstabaMarcado
              ? `${state.ok.alumno} — ya tenía la entrada registrada hoy a las ${horaLima(state.ok.entradaEn)}`
              : `Entrada registrada: ${state.ok.alumno}.`}
          </span>
          {state.ok.telefonoApoderado && state.ok.tieneWhatsapp && (
            <a
              href={construirLinkAsistenciaWhatsapp(
                state.ok.telefonoApoderado,
                state.ok.alumno,
                "entrada"
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
