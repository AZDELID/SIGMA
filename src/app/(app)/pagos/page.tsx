import { createClient } from "@/lib/supabase/server";
import type { MatriculaResumen } from "@/lib/types/database";
import { PagoForm } from "./pago-form";

type PagoConDetalle = {
  id: string;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
  numero_comprobante: string | null;
  matriculas: {
    alumnos: { nombres: string; apellidos: string };
    ciclos: { nombre: string };
  };
};

export default async function PagosPage({
  searchParams,
}: PageProps<"/pagos">) {
  const { matricula } = await searchParams;
  const matriculaPreseleccionada =
    typeof matricula === "string" ? matricula : undefined;

  const supabase = await createClient();

  const [{ data: pendientes }, { data: pagosRecientes }] = await Promise.all([
    supabase
      .from("matriculas_resumen")
      .select("*")
      .gt("saldo_pendiente", 0)
      .order("alumno_apellidos", { ascending: true })
      .returns<MatriculaResumen[]>(),
    supabase
      .from("pagos")
      .select(
        "id, monto, fecha_pago, metodo_pago, numero_comprobante, matriculas!inner(alumnos!inner(nombres, apellidos), ciclos!inner(nombre))"
      )
      .order("created_at", { ascending: false })
      .limit(15)
      .returns<PagoConDetalle[]>(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-blue-900">Pagos</h1>
        <p className="text-sm text-blue-600">
          Registra abonos contra la matrícula de un alumno.
        </p>
      </div>

      <PagoForm
        matriculas={pendientes ?? []}
        matriculaPreseleccionada={matriculaPreseleccionada}
      />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-blue-900">
          Últimos pagos registrados
        </h2>
        <div className="overflow-hidden rounded-lg border border-sky-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-sky-50 text-left text-xs font-medium uppercase text-blue-600">
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Alumno</th>
                <th className="px-4 py-2">Ciclo</th>
                <th className="px-4 py-2">Monto</th>
                <th className="px-4 py-2">Método</th>
                <th className="px-4 py-2">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100">
              {pagosRecientes?.map((pago) => (
                <tr key={pago.id}>
                  <td className="px-4 py-2 text-blue-600">{pago.fecha_pago}</td>
                  <td className="px-4 py-2 text-blue-900">
                    {pago.matriculas.alumnos.apellidos}, {pago.matriculas.alumnos.nombres}
                  </td>
                  <td className="px-4 py-2 text-blue-600">
                    {pago.matriculas.ciclos.nombre}
                  </td>
                  <td className="px-4 py-2 font-medium text-blue-900">
                    S/ {Number(pago.monto).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-blue-600 capitalize">
                    {pago.metodo_pago}
                  </td>
                  <td className="px-4 py-2 text-blue-600">
                    {pago.numero_comprobante ?? "—"}
                  </td>
                </tr>
              ))}
              {pagosRecientes?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-blue-400">
                    Sin pagos registrados todavía.
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
