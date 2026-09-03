"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { buscarAlumnosActivos } from "./actions";
import { MarcarManualBoton } from "./marcar-manual-boton";
import type { Alumno } from "@/lib/types/database";

export function BuscarAlumnoManual({
  alumnosConEntradaHoy,
}: {
  alumnosConEntradaHoy: string[];
}) {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Alumno[]>([]);
  const [seleccionado, setSeleccionado] = useState<Alumno | null>(null);
  const [buscando, startBusqueda] = useTransition();
  const marcadoHoy = useMemo(
    () => new Set(alumnosConEntradaHoy),
    [alumnosConEntradaHoy]
  );

  useEffect(() => {
    if (seleccionado) return;
    // Con menos de 2 caracteres no se busca; el desplegable ya está oculto
    // en ese caso (ver más abajo), así que no hace falta limpiar resultados.
    const q = query.trim();
    if (q.length < 2) return;

    const temporizador = setTimeout(() => {
      startBusqueda(async () => {
        setResultados(await buscarAlumnosActivos(q));
      });
    }, 250);
    return () => clearTimeout(temporizador);
  }, [query, seleccionado]);

  if (seleccionado) {
    const nombreCompleto = `${seleccionado.nombres} ${seleccionado.apellidos}`;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-md border border-brand-300 bg-brand-surface px-3 py-2">
          <div>
            <p className="text-sm font-medium text-brand-ink">
              {seleccionado.apellidos}, {seleccionado.nombres}
            </p>
            <p className="font-mono text-xs text-brand-600">{seleccionado.codigo}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSeleccionado(null);
              setQuery("");
            }}
            className="text-xs text-brand-600 hover:text-brand-ink"
          >
            Cambiar
          </button>
        </div>
        <MarcarManualBoton
          alumnoId={seleccionado.id}
          nombreCompleto={nombreCompleto}
          telefonoApoderado={seleccionado.telefono_apoderado}
          tieneWhatsapp={seleccionado.tiene_whatsapp}
          tipo="entrada"
          marcado={marcadoHoy.has(seleccionado.id)}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribe el nombre, apellido o DNI..."
        className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
      />
      {query.trim().length >= 2 && (
        <div className="mt-2 overflow-hidden rounded-lg border border-brand-200">
          {buscando ? (
            <p className="px-3 py-2 text-sm text-brand-400">Buscando…</p>
          ) : resultados.length > 0 ? (
            <ul className="divide-y divide-brand-100">
              {resultados.map((alumno) => (
                <li key={alumno.id}>
                  <button
                    type="button"
                    onClick={() => setSeleccionado(alumno)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-brand-50"
                  >
                    <span className="font-medium text-brand-ink">
                      {alumno.apellidos}, {alumno.nombres}
                    </span>
                    <span className="font-mono text-xs text-brand-600">
                      {alumno.codigo}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-2 text-sm text-brand-400">No se encontraron alumnos.</p>
          )}
        </div>
      )}
    </div>
  );
}
