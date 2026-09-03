import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  Alumno,
  NotaFinalSimulacro,
  ResultadoDetalle,
} from "@/lib/types/database";
import { PuntajesForm } from "./puntajes-form";

type SimulacroInfo = {
  id: string;
  nombre: string;
  fecha: string;
  ciclo_id: string;
  ciclos: { nombre: string };
};

type SimulacroMateriaInfo = {
  id: string;
  puntaje_maximo: number;
  materias: { id: string; nombre: string };
};

export default async function SimulacroDetallePage({
  params,
}: PageProps<"/simulacros/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: simulacro } = await supabase
    .from("simulacros")
    .select("id, nombre, fecha, ciclo_id, ciclos!inner(nombre)")
    .eq("id", id)
    .maybeSingle<SimulacroInfo>();

  if (!simulacro) {
    notFound();
  }

  const [{ data: simulacroMaterias }, { data: matriculas }, { data: resultados }, { data: notasFinales }] =
    await Promise.all([
      supabase
        .from("simulacro_materias")
        .select("id, puntaje_maximo, materias!inner(id, nombre)")
        .eq("simulacro_id", id)
        .returns<SimulacroMateriaInfo[]>(),
      supabase
        .from("matriculas")
        .select("alumnos!inner(*)")
        .eq("ciclo_id", simulacro.ciclo_id)
        .returns<{ alumnos: Alumno }[]>(),
      supabase
        .from("resultados_detalle")
        .select("*")
        .eq("simulacro_id", id)
        .returns<ResultadoDetalle[]>(),
      supabase
        .from("notas_finales_simulacro")
        .select("*")
        .eq("simulacro_id", id)
        .returns<NotaFinalSimulacro[]>(),
    ]);

  const alumnos = (matriculas ?? [])
    .map((m) => m.alumnos)
    .sort((a, b) => a.apellidos.localeCompare(b.apellidos));

  const notaPorAlumnoMateria = new Map<string, number>();
  for (const r of resultados ?? []) {
    notaPorAlumnoMateria.set(`${r.alumno_id}:${r.materia_id}`, r.nota);
  }
  const notaFinalPorAlumno = new Map<string, number>();
  for (const n of notasFinales ?? []) {
    notaFinalPorAlumno.set(n.alumno_id, n.nota_final);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/simulacros" className="text-sm text-brand-600 hover:text-brand-900">
          ← Notas
        </Link>
        <h1 className="mt-1 text-lg font-semibold text-brand-900">
          {simulacro.nombre}
        </h1>
        <p className="text-sm text-brand-600">
          {simulacro.fecha} · {simulacro.ciclos.nombre}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-900">Resumen de notas</h2>
        <div className="overflow-x-auto rounded-lg border border-brand-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-left text-xs font-medium uppercase text-brand-600">
              <tr>
                <th className="px-4 py-2">Alumno</th>
                {simulacroMaterias?.map((sm) => (
                  <th key={sm.id} className="px-4 py-2 text-center">
                    {sm.materias.nombre}
                  </th>
                ))}
                <th className="px-4 py-2 text-center">Nota final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {alumnos.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-2 font-medium text-brand-900">
                    {a.apellidos}, {a.nombres}
                  </td>
                  {simulacroMaterias?.map((sm) => {
                    const nota = notaPorAlumnoMateria.get(
                      `${a.id}:${sm.materias.id}`
                    );
                    return (
                      <td key={sm.id} className="px-4 py-2 text-center text-brand-600">
                        {nota ?? "—"}
                      </td>
                    );
                  })}
                  <td className="px-4 py-2 text-center font-medium text-brand-900">
                    {notaFinalPorAlumno.get(a.id) ?? "—"}
                  </td>
                </tr>
              ))}
              {alumnos.length === 0 && (
                <tr>
                  <td
                    colSpan={(simulacroMaterias?.length ?? 0) + 2}
                    className="px-4 py-6 text-center text-brand-400"
                  >
                    No hay alumnos matriculados en este ciclo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-900">Cargar puntajes</h2>
        <div className="space-y-2">
          {simulacroMaterias?.map((sm) => {
            const puntajesActuales: Record<string, number> = {};
            for (const r of resultados ?? []) {
              if (r.simulacro_materia_id === sm.id) {
                puntajesActuales[r.alumno_id] = r.puntaje_obtenido;
              }
            }
            return (
              <PuntajesForm
                key={sm.id}
                simulacroId={simulacro.id}
                simulacroMateriaId={sm.id}
                materiaNombre={sm.materias.nombre}
                puntajeMaximo={sm.puntaje_maximo}
                alumnos={alumnos}
                puntajesActuales={puntajesActuales}
              />
            );
          })}
          {simulacroMaterias?.length === 0 && (
            <p className="text-sm text-brand-400">
              Este simulacro no tiene materias configuradas.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
