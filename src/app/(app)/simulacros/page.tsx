import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type SimulacroConCiclo = {
  id: string;
  nombre: string;
  fecha: string;
  ciclos: { nombre: string };
};

export default async function SimulacrosPage() {
  const supabase = await createClient();
  const { data: simulacros } = await supabase
    .from("simulacros")
    .select("id, nombre, fecha, ciclos!inner(nombre)")
    .order("fecha", { ascending: false })
    .returns<SimulacroConCiclo[]>();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
<<<<<<< HEAD
          <h1 className="text-lg font-semibold text-brand-ink">Notas</h1>
=======
          <h1 className="text-xl font-bold text-brand-900">Notas</h1>
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
          <p className="text-sm text-brand-600">
            Simulacros y resultados por alumno.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/materias"
            className="rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-700 hover:bg-brand-100"
          >
            Materias
          </Link>
          <Link
            href="/simulacros/nuevo"
            className="rounded-md bg-brand-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98]"
          >
            + Nuevo simulacro
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-brand-200 bg-brand-surface">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 text-left text-[11px] font-semibold uppercase tracking-wider text-brand-700">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Ciclo</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {simulacros?.map((s) => (
              <tr key={s.id} className="transition-colors hover:bg-brand-50">
                <td className="px-4 py-2 font-medium text-brand-ink">{s.nombre}</td>
                <td className="px-4 py-2 text-brand-600">{s.fecha}</td>
                <td className="px-4 py-2 text-brand-600">{s.ciclos.nombre}</td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/simulacros/${s.id}`}
                    className="text-xs text-brand-600 hover:text-brand-ink"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {simulacros?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-brand-400">
                  Todavía no hay simulacros registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
