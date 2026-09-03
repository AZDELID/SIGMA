import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Alumno, Ciclo, MatriculaResumen } from "@/lib/types/database";
import {
  hoyLima,
  inicioDiaLima,
  inicioDiaLimaDeFecha,
  inicioMesLima,
} from "@/lib/utils/fecha";

type PagoReciente = {
  id: string;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
  matriculas: {
    alumnos: { nombres: string; apellidos: string };
    ciclos: { nombre: string };
  };
};

export default async function InicioPage({
  searchParams,
}: PageProps<"/">) {
  const { fecha: fechaParam } = await searchParams;
  const fechaConsulta =
    typeof fechaParam === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fechaParam)
      ? fechaParam
      : hoyLima();

  const supabase = await createClient();

  const hoy = hoyLima();
  const inicioMes = inicioMesLima().toISOString().slice(0, 10);
  const inicioDiaConsulta = inicioDiaLimaDeFecha(fechaConsulta);
  const finDiaConsulta = new Date(inicioDiaConsulta.getTime() + 24 * 60 * 60 * 1000);

  const [
    { count: alumnosActivos },
    { count: asistenciasHoy },
    { data: matriculas },
    { data: ciclosActivos },
    { data: pagosDelMes },
    { data: ultimosPagos },
    { data: alumnosActivosLista },
    { data: asistenciasDelDia },
  ] = await Promise.all([
    supabase
      .from("alumnos")
      .select("id", { count: "exact", head: true })
      .eq("activo", true),
    supabase
      .from("asistencias")
      .select("id", { count: "exact", head: true })
      .eq("tipo", "entrada")
      .gte("marcado_en", inicioDiaLima().toISOString()),
    supabase.from("matriculas_resumen").select("*").returns<MatriculaResumen[]>(),
    supabase
      .from("ciclos")
      .select("*")
      .eq("activo", true)
      .order("fecha_inicio", { ascending: false })
      .returns<Ciclo[]>(),
    supabase
      .from("pagos")
      .select("monto, fecha_pago")
      .gte("fecha_pago", inicioMes)
      .returns<{ monto: number; fecha_pago: string }[]>(),
    supabase
      .from("pagos")
      .select(
        "id, monto, fecha_pago, metodo_pago, matriculas!inner(alumnos!inner(nombres, apellidos), ciclos!inner(nombre))"
      )
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<PagoReciente[]>(),
    supabase
      .from("alumnos")
      .select("*")
      .eq("activo", true)
      .order("apellidos", { ascending: true })
      .returns<Alumno[]>(),
    supabase
      .from("asistencias")
      .select("alumno_id")
      .eq("tipo", "entrada")
      .gte("marcado_en", inicioDiaConsulta.toISOString())
      .lt("marcado_en", finDiaConsulta.toISOString())
      .returns<{ alumno_id: string }[]>(),
  ]);

  const idsPresentes = new Set((asistenciasDelDia ?? []).map((a) => a.alumno_id));
  const asistieronEseDia = (alumnosActivosLista ?? []).filter((a) =>
    idsPresentes.has(a.id)
  );
  const faltaronEseDia = (alumnosActivosLista ?? []).filter(
    (a) => !idsPresentes.has(a.id)
  );

  const todasMatriculas = matriculas ?? [];
  const conSaldo = todasMatriculas.filter((m) => m.saldo_pendiente > 0);
  const deudaTotal = conSaldo.reduce((acc, m) => acc + m.saldo_pendiente, 0);

  const cobradoMes = (pagosDelMes ?? []).reduce((acc, p) => acc + p.monto, 0);
  const cobradoHoy = (pagosDelMes ?? [])
    .filter((p) => p.fecha_pago === hoy)
    .reduce((acc, p) => acc + p.monto, 0);

  const topDeudores = [...conSaldo]
    .sort((a, b) => b.saldo_pendiente - a.saldo_pendiente)
    .slice(0, 5);

  const ultimasMatriculas = [...todasMatriculas]
    .sort((a, b) => (a.fecha_matricula < b.fecha_matricula ? 1 : -1))
    .slice(0, 5);

  const matriculadosPorCiclo = new Map<string, number>();
  for (const m of todasMatriculas) {
    matriculadosPorCiclo.set(
      m.ciclo_id,
      (matriculadosPorCiclo.get(m.ciclo_id) ?? 0) + 1
    );
  }

  const tarjetas = [
    { label: "Alumnos activos", valor: alumnosActivos ?? 0, href: "/alumnos" },
    { label: "Asistencias hoy", valor: asistenciasHoy ?? 0, href: "/asistencia" },
    {
      label: "Cobrado hoy",
      valor: `S/ ${cobradoHoy.toFixed(2)}`,
      href: "/pagos",
    },
    {
      label: "Cobrado este mes",
      valor: `S/ ${cobradoMes.toFixed(2)}`,
      href: "/pagos",
    },
    {
      label: "Alumnos con saldo pendiente",
      valor: conSaldo.length,
      href: "/pagos",
    },
    {
      label: "Deuda total pendiente",
      valor: `S/ ${deudaTotal.toFixed(2)}`,
      href: "/pagos",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-brand-900">Inicio</h1>
        <p className="text-sm text-brand-600">
          Resumen del día — {new Date().toLocaleDateString("es-PE", {
            timeZone: "America/Lima",
            dateStyle: "long",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {tarjetas.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="rounded-lg border border-brand-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
          >
            <p className="text-xs text-brand-600">{t.label}</p>
            <p className="mt-1 text-2xl font-semibold text-brand-900">
              {t.valor}
            </p>
          </Link>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-sm font-semibold text-brand-900">
            Asistencia por fecha
          </h2>
          <form className="flex items-end gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-600">
                Fecha
              </label>
              <input
                type="date"
                name="fecha"
                defaultValue={fechaConsulta}
                max={hoy}
                className="rounded-md border border-brand-300 bg-white px-3 py-1.5 text-sm text-black"
              />
            </div>
            <button
              type="submit"
              className="rounded-md border border-brand-300 bg-white px-3 py-1.5 text-sm text-brand-700 hover:bg-brand-100"
            >
              Ver
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-brand-200 bg-white p-4">
            <p className="text-xs text-brand-600">Asistieron el {fechaConsulta}</p>
            <p className="mt-1 text-2xl font-semibold text-green-700">
              {asistieronEseDia.length}
              <span className="ml-1 text-sm font-normal text-brand-600">
                / {alumnosActivosLista?.length ?? 0}
              </span>
            </p>
          </div>
          <div className="rounded-lg border border-brand-200 bg-white p-4">
            <p className="text-xs text-brand-600">Faltaron el {fechaConsulta}</p>
            <p className="mt-1 text-2xl font-semibold text-brand-red-dark">
              {faltaronEseDia.length}
              <span className="ml-1 text-sm font-normal text-brand-600">
                / {alumnosActivosLista?.length ?? 0}
              </span>
            </p>
          </div>
        </div>

        {faltaronEseDia.length > 0 && (
          <details className="rounded-lg border border-brand-200 bg-white">
            <summary className="cursor-pointer select-none px-4 py-2 text-sm font-medium text-brand-900">
              Ver quiénes faltaron ({faltaronEseDia.length})
            </summary>
            <ul className="divide-y divide-brand-100 border-t border-brand-100">
              {faltaronEseDia.map((a) => (
                <li key={a.id} className="px-4 py-2 text-sm">
                  <Link
                    href={`/alumnos/${a.id}`}
                    className="text-brand-700 hover:text-brand-900 hover:underline"
                  >
                    {a.apellidos}, {a.nombres}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-900">Ciclos activos</h2>
        {ciclosActivos && ciclosActivos.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {ciclosActivos.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-brand-200 bg-white p-4"
              >
                <p className="font-medium text-brand-900">{c.nombre}</p>
                <p className="text-xs text-brand-600">
                  {c.fecha_inicio} — {c.fecha_fin}
                </p>
                <p className="mt-2 text-sm text-brand-700">
                  {matriculadosPorCiclo.get(c.id) ?? 0} matriculado(s)
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-brand-yellow-200 bg-brand-yellow-50 p-4 text-sm text-brand-yellow-dark">
            No hay ciclos activos.{" "}
            <Link href="/ciclos" className="underline">
              Crea uno
            </Link>{" "}
            para poder matricular alumnos.
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-brand-900">
            Alumnos con mayor deuda
          </h2>
          <div className="overflow-hidden rounded-lg border border-brand-200 bg-white">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-brand-100">
                {topDeudores.map((m) => (
                  <tr key={m.matricula_id}>
                    <td className="px-4 py-2">
                      <p className="font-medium text-brand-900">
                        {m.alumno_apellidos}, {m.alumno_nombres}
                      </p>
                      <p className="text-xs text-brand-600">{m.ciclo_nombre}</p>
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-brand-yellow-dark">
                      S/ {m.saldo_pendiente.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/pagos?matricula=${m.matricula_id}`}
                        className="text-xs text-brand-600 hover:text-brand-900"
                      >
                        Cobrar
                      </Link>
                    </td>
                  </tr>
                ))}
                {topDeudores.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-brand-400">
                      Nadie tiene saldo pendiente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-brand-900">
            Últimos pagos
          </h2>
          <div className="overflow-hidden rounded-lg border border-brand-200 bg-white">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-brand-100">
                {ultimosPagos?.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2">
                      <p className="font-medium text-brand-900">
                        {p.matriculas.alumnos.apellidos},{" "}
                        {p.matriculas.alumnos.nombres}
                      </p>
                      <p className="text-xs text-brand-600">
                        {p.matriculas.ciclos.nombre} · {p.fecha_pago}
                      </p>
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-green-700">
                      S/ {Number(p.monto).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {ultimosPagos?.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-brand-400">
                      Sin pagos registrados todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-900">
          Últimas matrículas
        </h2>
        <div className="overflow-hidden rounded-lg border border-brand-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-left text-xs font-medium uppercase text-brand-600">
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Alumno</th>
                <th className="px-4 py-2">Ciclo</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {ultimasMatriculas.map((m) => (
                <tr key={m.matricula_id}>
                  <td className="px-4 py-2 text-brand-600">
                    {m.fecha_matricula}
                  </td>
                  <td className="px-4 py-2 font-medium text-brand-900">
                    {m.alumno_apellidos}, {m.alumno_nombres}
                  </td>
                  <td className="px-4 py-2 text-brand-600">{m.ciclo_nombre}</td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/alumnos/${m.alumno_id}`}
                      className="text-xs text-brand-600 hover:text-brand-900"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
              {ultimasMatriculas.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-brand-400">
                    Todavía no hay matrículas.
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
