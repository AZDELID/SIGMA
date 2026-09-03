import { createClient } from "@/lib/supabase/server";
import type { Ciclo } from "@/lib/types/database";
import { CicloForm } from "./ciclo-form";
import { CerrarCicloBoton } from "./cerrar-ciclo-boton";

export default async function CiclosPage() {
  const supabase = await createClient();
  const { data: ciclos } = await supabase
    .from("ciclos")
    .select("*")
    .order("fecha_inicio", { ascending: false })
    .returns<Ciclo[]>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-brand-900">Ciclos</h1>
        <p className="text-sm text-brand-600">
          Los planes/periodos en los que se matriculan los alumnos.
        </p>
      </div>

      <CicloForm />

      <div className="overflow-hidden rounded-lg border border-brand-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 text-left text-xs font-medium uppercase text-brand-600">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Inicio</th>
              <th className="px-4 py-2">Fin</th>
              <th className="px-4 py-2">Monto por defecto</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {ciclos?.map((ciclo) => (
              <tr key={ciclo.id}>
                <td className="px-4 py-2 font-medium text-brand-900">
                  {ciclo.nombre}
                </td>
                <td className="px-4 py-2 text-brand-600">
                  {ciclo.fecha_inicio}
                </td>
                <td className="px-4 py-2 text-brand-600">{ciclo.fecha_fin}</td>
                <td className="px-4 py-2 text-brand-600">
                  S/ {ciclo.monto_default.toFixed(2)}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={
                      ciclo.activo
                        ? "rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700"
                        : "rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-600"
                    }
                  >
                    {ciclo.activo ? "Activo" : "Cerrado"}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  {ciclo.activo && (
                    <CerrarCicloBoton cicloId={ciclo.id} nombre={ciclo.nombre} />
                  )}
                </td>
              </tr>
            ))}
            {ciclos?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-brand-400">
                  Todavía no hay ciclos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
