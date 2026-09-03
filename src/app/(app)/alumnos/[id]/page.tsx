import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  Alumno,
  Asistencia,
  Ciclo,
  MatriculaResumen,
  Pago,
  ResultadoDetalle,
} from "@/lib/types/database";
import { generarQrDataUrl } from "@/lib/utils/qr";
import { MatriculaForm } from "./matricula-form";
import { EstadoAlumnoBoton } from "./estado-alumno-boton";
import { PagoRow } from "./pago-row";
import {
  ETIQUETA_TIPO_ASISTENCIA as ETIQUETA,
  COLOR_TIPO_ASISTENCIA as COLOR_TIPO,
} from "@/lib/utils/asistencia-labels";

export default async function AlumnoDetallePage({
  params,
}: PageProps<"/alumnos/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: alumno },
    { data: matriculas },
    { data: asistencias },
    { data: ciclosActivos },
    { data: resultados },
  ] = await Promise.all([
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
    supabase.from("ciclos").select("*").eq("activo", true).returns<Ciclo[]>(),
    supabase
      .from("resultados_detalle")
      .select("*")
      .eq("alumno_id", id)
      .order("simulacro_fecha", { ascending: false })
      .returns<ResultadoDetalle[]>(),
  ]);

  if (!alumno) {
    notFound();
  }

  const ciclosYaMatriculados = new Set((matriculas ?? []).map((m) => m.ciclo_id));
  const ciclosDisponibles = (ciclosActivos ?? []).filter(
    (c) => !ciclosYaMatriculados.has(c.id)
  );

  const matriculaIds = (matriculas ?? []).map((m) => m.matricula_id);
  const { data: pagos } = matriculaIds.length
    ? await supabase
        .from("pagos")
        .select("*")
        .in("matricula_id", matriculaIds)
        .order("fecha_pago", { ascending: false })
        .returns<Pago[]>()
    : { data: [] as Pago[] };

  const pagosPorMatricula = new Map<string, Pago[]>();
  for (const pago of pagos ?? []) {
    const lista = pagosPorMatricula.get(pago.matricula_id) ?? [];
    lista.push(pago);
    pagosPorMatricula.set(pago.matricula_id, lista);
  }

  const qrDataUrl = await generarQrDataUrl(alumno.codigo);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/alumnos" className="text-sm text-brand-600 hover:text-brand-900">
          ← Alumnos
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold text-brand-900">
            {alumno.apellidos}, {alumno.nombres}
          </h1>
          <span className="font-mono text-xs text-brand-600">{alumno.codigo}</span>
          {!alumno.activo && (
            <span className="rounded-full bg-brand-red-100 px-2 py-0.5 text-xs text-brand-red-dark">
              Dado de baja
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Link
              href={`/alumnos/${alumno.id}/editar`}
              className="rounded-md border border-brand-300 bg-white px-3 py-1.5 text-sm text-brand-700 hover:bg-brand-100"
            >
              Editar
            </Link>
            <EstadoAlumnoBoton
              alumnoId={alumno.id}
              activo={alumno.activo}
              nombreCompleto={`${alumno.nombres} ${alumno.apellidos}`}
            />
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-4 rounded-lg border border-brand-200 bg-white p-4 sm:flex-row">
        <div className="grid flex-1 grid-cols-1 gap-3 text-sm sm:grid-cols-2 md:grid-cols-3">
          <div>
            <span className="block text-xs text-brand-600">DNI</span>
            {alumno.dni}
          </div>
          <div>
            <span className="block text-xs text-brand-600">Fecha de nacimiento</span>
            {alumno.fecha_nacimiento ?? "—"}
          </div>
          <div>
            <span className="block text-xs text-brand-600">Teléfono</span>
            {alumno.telefono ?? "—"}
          </div>
          <div>
            <span className="block text-xs text-brand-600">Teléfono del apoderado</span>
            {alumno.telefono_apoderado ?? "—"}
          </div>
          <div className="sm:col-span-2 md:col-span-3">
            <span className="block text-xs text-brand-600">Dirección</span>
            {alumno.direccion ?? "—"}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 border-t border-brand-100 pt-4 sm:w-40 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          <Image
            src={qrDataUrl}
            alt={`Código QR de ${alumno.codigo}`}
            width={128}
            height={128}
            unoptimized
          />
          <span className="font-mono text-xs text-brand-600">{alumno.codigo}</span>
          <Link
            href={`/alumnos/${alumno.id}/carnet`}
            target="_blank"
            className="text-xs text-brand-600 underline hover:text-brand-900"
          >
            Ver carnet para imprimir
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-brand-900">Matrículas</h2>

        {matriculas?.map((m) => (
          <div
            key={m.matricula_id}
            className="overflow-hidden rounded-lg border border-brand-200 bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-100 bg-brand-50 px-4 py-2">
              <p className="font-medium text-brand-900">{m.ciclo_nombre}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-brand-600">
                  Pactado S/ {m.monto_pactado.toFixed(2)}
                </span>
                <span
                  className={
                    m.saldo_pendiente > 0
                      ? "font-medium text-brand-yellow-dark"
                      : "font-medium text-green-700"
                  }
                >
                  Saldo S/ {m.saldo_pendiente.toFixed(2)}
                </span>
                {m.saldo_pendiente > 0 && (
                  <Link
                    href={`/pagos?matricula=${m.matricula_id}`}
                    className="text-xs text-brand-600 hover:text-brand-900"
                  >
                    Registrar pago
                  </Link>
                )}
              </div>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-brand-100">
                {(pagosPorMatricula.get(m.matricula_id) ?? []).map((pago) => (
                  <PagoRow key={pago.id} pago={pago} />
                ))}
                {(pagosPorMatricula.get(m.matricula_id) ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-brand-400">
                      Sin pagos registrados en este ciclo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
        {matriculas?.length === 0 && (
          <p className="rounded-lg border border-brand-200 bg-white px-4 py-6 text-center text-brand-400">
            Sin matrículas registradas.
          </p>
        )}

        {alumno.activo ? (
          <MatriculaForm alumnoId={alumno.id} ciclosDisponibles={ciclosDisponibles} />
        ) : (
          <p className="rounded-lg border border-brand-yellow-200 bg-brand-yellow-50 p-3 text-sm text-brand-yellow-dark">
            Este alumno está dado de baja — reactívalo para matricularlo en un
            nuevo ciclo.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-900">
          Últimas asistencias
        </h2>
        <div className="overflow-hidden rounded-lg border border-brand-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-left text-xs font-medium uppercase text-brand-600">
              <tr>
                <th className="px-4 py-2">Fecha y hora</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Método</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {asistencias?.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-2 text-brand-600">
                    {new Date(a.marcado_en).toLocaleString("es-PE", {
                      timeZone: "America/Lima",
                    })}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${COLOR_TIPO[a.tipo]}`}
                    >
                      {ETIQUETA[a.tipo]}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-brand-600">
                    {a.metodo === "codigo" ? "Código" : "Manual"}
                  </td>
                </tr>
              ))}
              {asistencias?.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-brand-400">
                    Sin registros de asistencia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-900">Notas</h2>
        <div className="overflow-hidden rounded-lg border border-brand-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-left text-xs font-medium uppercase text-brand-600">
              <tr>
                <th className="px-4 py-2">Simulacro</th>
                <th className="px-4 py-2">Materia</th>
                <th className="px-4 py-2 text-center">Puntaje</th>
                <th className="px-4 py-2 text-center">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {resultados?.map((r) => (
                <tr key={r.resultado_id}>
                  <td className="px-4 py-2 text-brand-900">
                    {r.simulacro_nombre}
                    <span className="ml-2 text-xs text-brand-600">
                      {r.simulacro_fecha}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-brand-600">{r.materia_nombre}</td>
                  <td className="px-4 py-2 text-center text-brand-600">
                    {r.puntaje_obtenido} / {r.puntaje_maximo}
                  </td>
                  <td className="px-4 py-2 text-center font-medium text-brand-900">
                    {r.nota}
                  </td>
                </tr>
              ))}
              {resultados?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-brand-400">
                    Sin notas registradas.
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
