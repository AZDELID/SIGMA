"use client";

import { useState } from "react";
import { CarnetHorizontal, CarnetVertical, type DatosCarnet } from "./carnet-card";

export function CarnetView({ datos }: { datos: DatosCarnet }) {
  const [orientacion, setOrientacion] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 print:hidden">
        <div className="inline-flex rounded-md border border-brand-300 bg-brand-surface p-1">
          <button
            type="button"
            onClick={() => setOrientacion("horizontal")}
            className={
              orientacion === "horizontal"
                ? "rounded px-3 py-1.5 text-sm font-medium bg-brand-900 text-white"
                : "rounded px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-100"
            }
          >
            Horizontal
          </button>
          <button
            type="button"
            onClick={() => setOrientacion("vertical")}
            className={
              orientacion === "vertical"
                ? "rounded px-3 py-1.5 text-sm font-medium bg-brand-900 text-white"
                : "rounded px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-100"
            }
          >
            Vertical
          </button>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md bg-brand-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98]"
        >
          Imprimir
        </button>
      </div>

      <p className="max-w-80 text-center text-xs text-brand-400 print:hidden">
        Al imprimir, desactiva &quot;Ajustar a la página&quot; y usa escala
        100% para que el carnet salga a su tamaño real (8.5×5.4 cm / 5.4×8.5
        cm).
      </p>

      {orientacion === "horizontal" ? (
        <CarnetHorizontal datos={datos} />
      ) : (
        <CarnetVertical datos={datos} />
      )}
    </div>
  );
}
