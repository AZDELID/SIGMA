import { createClient } from "@/lib/supabase/server";
import type { Ciclo } from "@/lib/types/database";
import { CicloForm } from "./ciclo-form";
import { cerrarCiclo } from "./actions";

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
        <h1 className="text-lg font-semibold text-blue-900">Ciclos</h1>
        <p className="text-sm text-blue-600">
          Los planes/periodos en los que se matriculan los alumnos.
        </p>
      </div>

      <CicloForm />

      <div className="overflow-hidden rounded-lg border border-sky-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-sky-50 text-left text-xs font-medium uppercase text-blue-600">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Inicio</th>
              <th className="px-4 py-2">Fin</th>
              <th className="px-4 py-2">Monto por defecto</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100">
            {ciclos?.map((ciclo) => (
              <tr key={ciclo.id}>
                <td className="px-4 py-2 font-medium text-blue-900">
                  {ciclo.nombre}
                </td>
                <td className="px-4 py-2 text-blue-600">
                  {ciclo.fecha_inicio}
                </td>
                <td className="px-4 py-2 text-blue-600">{ciclo.fecha_fin}</td>
                <td className="px-4 py-2 text-blue-600">
                  S/ {ciclo.monto_default.toFixed(2)}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={
                      ciclo.activo
                        ? "rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700"
                        : "rounded-full bg-sky-100 px-2 py-0.5 text-xs text-blue-600"
                    }
                  >
                    {ciclo.activo ? "Activo" : "Cerrado"}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  {ciclo.activo && (
                    <form
                      action={async () => {
                        "use server";
                        await cerrarCiclo(ciclo.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs text-blue-600 hover:text-blue-900"
                      >
                        Cerrar
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {ciclos?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-blue-400">
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
