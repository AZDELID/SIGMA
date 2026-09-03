import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Alumno, Asistencia, Ciclo, MatriculaResumen } from "@/lib/types/database";
import { MatriculaForm } from "./matricula-form";

export default async function AlumnoDetallePage({
  params,
}: PageProps<"/alumnos/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: alumno }, { data: matriculas }, { data: asistencias }, { data: ciclosActivos }] =
    await Promise.all([
      supabase.from("alumnos").select("*").eq("id", id).maybeSingle<Alumno>(),
      supabase
        .from("matriculas_resumen")
        .select("*")
        .eq("alumno_id", id)
        .order("fecha_matricula", { ascending: false })
        .returns<MatriculaResumen[]>(),
      supabase
        .from("asistencias")
        .select("*")
        .eq("alumno_id", id)
        .order("marcado_en", { ascending: false })
        .limit(10)
        .returns<Asistencia[]>(),
      supabase
        .from("ciclos")
        .select("*")
        .eq("activo", true)
        .returns<Ciclo[]>(),
    ]);

  if (!alumno) {
    notFound();
  }

  const ciclosYaMatriculados = new Set((matriculas ?? []).map((m) => m.ciclo_id));
  const ciclosDisponibles = (ciclosActivos ?? []).filter(
    (c) => !ciclosYaMatriculados.has(c.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <Link href="/alumnos" className="text-sm text-blue-600 hover:text-blue-900">
          ← Alumnos
        </Link>
        <div className="mt-1 flex items-center gap-3">
          <h1 className="text-lg font-semibold text-blue-900">
            {alumno.apellidos}, {alumno.nombres}
          </h1>
          <span className="font-mono text-xs text-blue-600">{alumno.codigo}</span>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-3 rounded-lg border border-sky-200 bg-white p-4 text-sm sm:grid-cols-2 md:grid-cols-3">
        <div>
          <span className="block text-xs text-blue-600">DNI</span>
          {alumno.dni ?? "—"}
        </div>
        <div>
          <span className="block text-xs text-blue-600">Fecha de nacimiento</span>
          {alumno.fecha_nacimiento ?? "—"}
        </div>
        <div>
          <span className="block text-xs text-blue-600">Teléfono</span>
          {alumno.telefono ?? "—"}
        </div>
        <div>
          <span className="block text-xs text-blue-600">Teléfono del apoderado</span>
          {alumno.telefono_apoderado ?? "—"}
        </div>
        <div className="sm:col-span-2">
          <span className="block text-xs text-blue-600">Dirección</span>
          {alumno.direccion ?? "—"}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-blue-900">Matrículas</h2>
        <div className="overflow-hidden rounded-lg border border-sky-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-sky-50 text-left text-xs font-medium uppercase text-blue-600">
              <tr>
                <th className="px-4 py-2">Ciclo</th>
                <th className="px-4 py-2">Monto pactado</th>
                <th className="px-4 py-2">Pagado</th>
                <th className="px-4 py-2">Saldo</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100">
              {matriculas?.map((m) => (
                <tr key={m.matricula_id}>
                  <td className="px-4 py-2 font-medium text-blue-900">
                    {m.ciclo_nombre}
                  </td>
                  <td className="px-4 py-2 text-blue-600">
                    S/ {m.monto_pactado.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-blue-600">
                    S/ {m.total_pagado.toFixed(2)}
                  </td>
                  <td
                    className={
                      m.saldo_pendiente > 0
                        ? "px-4 py-2 font-medium text-yellow-700"
                        : "px-4 py-2 font-medium text-green-700"
                    }
                  >
                    S/ {m.saldo_pendiente.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {m.saldo_pendiente > 0 && (
                      <Link
                        href={`/pagos?matricula=${m.matricula_id}`}
                        className="text-xs text-blue-600 hover:text-blue-900"
                      >
                        Registrar pago
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
              {matriculas?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-blue-400">
                    Sin matrículas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <MatriculaForm alumnoId={alumno.id} ciclosDisponibles={ciclosDisponibles} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-blue-900">
          Últimas asistencias
        </h2>
        <div className="overflow-hidden rounded-lg border border-sky-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-sky-50 text-left text-xs font-medium uppercase text-blue-600">
              <tr>
                <th className="px-4 py-2">Fecha y hora</th>
                <th className="px-4 py-2">Método</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100">
              {asistencias?.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-2 text-blue-600">
                    {new Date(a.marcado_en).toLocaleString("es-PE")}
                  </td>
                  <td className="px-4 py-2 text-blue-600">
                    {a.metodo === "codigo" ? "Código" : "Manual"}
                  </td>
                </tr>
              ))}
              {asistencias?.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-blue-400">
                    Sin registros de asistencia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
