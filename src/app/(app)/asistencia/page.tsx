import { createClient } from "@/lib/supabase/server";
import type { Alumno, TipoAsistencia } from "@/lib/types/database";
import { inicioDiaLima } from "@/lib/utils/fecha";
import { CodigoForm } from "./codigo-form";
import { MarcarManualBoton } from "./marcar-manual-boton";
import { TipoSelector } from "./tipo-selector";
import {
  ETIQUETA_TIPO_ASISTENCIA as ETIQUETA,
  COLOR_TIPO_ASISTENCIA as COLOR_TIPO,
} from "@/lib/utils/asistencia-labels";

type AsistenciaHoy = {
  id: string;
  marcado_en: string;
  metodo: "codigo" | "manual";
  tipo: TipoAsistencia;
  alumnos: { nombres: string; apellidos: string; codigo: string };
};

const TIPOS_VALIDOS: TipoAsistencia[] = ["entrada", "salida", "permiso"];

export default async function AsistenciaPage({
  searchParams,
}: PageProps<"/asistencia">) {
  const { buscar, tipo: tipoParam } = await searchParams;
  const query = typeof buscar === "string" ? buscar.trim() : "";
  const tipo: TipoAsistencia =
    typeof tipoParam === "string" &&
    TIPOS_VALIDOS.includes(tipoParam as TipoAsistencia)
      ? (tipoParam as TipoAsistencia)
      : "entrada";

  const supabase = await createClient();

  const [{ data: alumnosEncontrados }, { data: asistenciasHoy }] =
    await Promise.all([
      query
        ? supabase
            .from("alumnos")
            .select("*")
            .eq("activo", true)
            .or(
              `nombres.ilike.%${query}%,apellidos.ilike.%${query}%,dni.ilike.%${query}%`
            )
            .limit(10)
            .returns<Alumno[]>()
        : Promise.resolve({ data: [] as Alumno[] }),
      supabase
        .from("asistencias")
        .select("id, marcado_en, metodo, tipo, alumnos!inner(nombres, apellidos, codigo)")
        .gte("marcado_en", inicioDiaLima().toISOString())
        .order("marcado_en", { ascending: false })
        .returns<AsistenciaHoy[]>(),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-brand-900">Asistencia</h1>
        <p className="text-sm text-brand-600">
          Elige qué vas a registrar, luego escanea el carnet o búscalo manualmente.
        </p>
      </div>

      <TipoSelector tipoActual={tipo} query={query} />

      <CodigoForm tipo={tipo} />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-900">
          Búsqueda manual
        </h2>
        <form className="flex gap-2">
          <input type="hidden" name="tipo" value={tipo} />
          <input
            type="search"
            name="buscar"
            defaultValue={query}
            placeholder="Buscar por nombre, apellido o DNI..."
            className="w-full max-w-md rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
          />
          <button
            type="submit"
            className="rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-brand-700 hover:bg-brand-100"
          >
            Buscar
          </button>
        </form>

        {query && (
          <div className="overflow-hidden rounded-lg border border-brand-200 bg-white shadow-sm shadow-brand-900/5">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-brand-100">
                {alumnosEncontrados?.map((alumno) => (
                  <tr key={alumno.id} className="transition-colors hover:bg-brand-50">
                    <td className="px-4 py-2 font-mono text-xs text-brand-600">
                      {alumno.codigo}
                    </td>
                    <td className="px-4 py-2 font-medium text-brand-900">
                      {alumno.apellidos}, {alumno.nombres}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <MarcarManualBoton
                        alumnoId={alumno.id}
                        nombreCompleto={`${alumno.nombres} ${alumno.apellidos}`}
                        telefonoApoderado={alumno.telefono_apoderado}
                        tieneWhatsapp={alumno.tiene_whatsapp}
                        tipo={tipo}
                      />
                    </td>
                  </tr>
                ))}
                {alumnosEncontrados?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-brand-400">
                      No se encontraron alumnos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-900">
          Asistencias de hoy ({asistenciasHoy?.length ?? 0})
        </h2>
        <div className="overflow-hidden rounded-lg border border-brand-200 bg-white shadow-sm shadow-brand-900/5">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-left text-[11px] font-semibold uppercase tracking-wider text-brand-700">
              <tr>
                <th className="px-4 py-2">Hora</th>
                <th className="px-4 py-2">Alumno</th>
                <th className="px-4 py-2">Código</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Método</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {asistenciasHoy?.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-brand-50">
                  <td className="px-4 py-2 text-brand-600">
                    {new Date(a.marcado_en).toLocaleTimeString("es-PE", {
                      timeZone: "America/Lima",
                    })}
                  </td>
                  <td className="px-4 py-2 text-brand-900">
                    {a.alumnos.apellidos}, {a.alumnos.nombres}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-brand-600">
                    {a.alumnos.codigo}
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
              {asistenciasHoy?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-brand-400">
                    Todavía no hay asistencias marcadas hoy.
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
