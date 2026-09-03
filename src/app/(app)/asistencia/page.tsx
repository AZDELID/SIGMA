import { createClient } from "@/lib/supabase/server";
import type { Alumno } from "@/lib/types/database";
import { CodigoForm } from "./codigo-form";
import { marcarManual } from "./actions";

type AsistenciaHoy = {
  id: string;
  marcado_en: string;
  metodo: "codigo" | "manual";
  alumnos: { nombres: string; apellidos: string; codigo: string };
};

export default async function AsistenciaPage({
  searchParams,
}: PageProps<"/asistencia">) {
  const { buscar } = await searchParams;
  const query = typeof buscar === "string" ? buscar.trim() : "";

  const supabase = await createClient();

  const inicioDia = new Date();
  inicioDia.setHours(0, 0, 0, 0);

  const [{ data: alumnosEncontrados }, { data: asistenciasHoy }] =
    await Promise.all([
      query
        ? supabase
            .from("alumnos")
            .select("*")
            .or(
              `nombres.ilike.%${query}%,apellidos.ilike.%${query}%,dni.ilike.%${query}%`
            )
            .limit(10)
            .returns<Alumno[]>()
        : Promise.resolve({ data: [] as Alumno[] }),
      supabase
        .from("asistencias")
        .select("id, marcado_en, metodo, alumnos!inner(nombres, apellidos, codigo)")
        .gte("marcado_en", inicioDia.toISOString())
        .order("marcado_en", { ascending: false })
        .returns<AsistenciaHoy[]>(),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-blue-900">Asistencia</h1>
        <p className="text-sm text-blue-600">
          Escanea el carnet del alumno o búscalo manualmente.
        </p>
      </div>

      <CodigoForm />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-blue-900">
          Búsqueda manual
        </h2>
        <form className="flex gap-2">
          <input
            type="search"
            name="buscar"
            defaultValue={query}
            placeholder="Buscar por nombre, apellido o DNI..."
            className="w-full max-w-md rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
          />
          <button
            type="submit"
            className="rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-blue-700 hover:bg-sky-100"
          >
            Buscar
          </button>
        </form>

        {query && (
          <div className="overflow-hidden rounded-lg border border-sky-200 bg-white">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-sky-100">
                {alumnosEncontrados?.map((alumno) => (
                  <tr key={alumno.id}>
                    <td className="px-4 py-2 font-mono text-xs text-blue-600">
                      {alumno.codigo}
                    </td>
                    <td className="px-4 py-2 font-medium text-blue-900">
                      {alumno.apellidos}, {alumno.nombres}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <form
                        action={async () => {
                          "use server";
                          await marcarManual(alumno.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded-md bg-blue-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800"
                        >
                          Marcar asistencia
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {alumnosEncontrados?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-blue-400">
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
        <h2 className="text-sm font-semibold text-blue-900">
          Asistencias de hoy ({asistenciasHoy?.length ?? 0})
        </h2>
        <div className="overflow-hidden rounded-lg border border-sky-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-sky-50 text-left text-xs font-medium uppercase text-blue-600">
              <tr>
                <th className="px-4 py-2">Hora</th>
                <th className="px-4 py-2">Alumno</th>
                <th className="px-4 py-2">Código</th>
                <th className="px-4 py-2">Método</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100">
              {asistenciasHoy?.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-2 text-blue-600">
                    {new Date(a.marcado_en).toLocaleTimeString("es-PE")}
                  </td>
                  <td className="px-4 py-2 text-blue-900">
                    {a.alumnos.apellidos}, {a.alumnos.nombres}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-blue-600">
                    {a.alumnos.codigo}
                  </td>
                  <td className="px-4 py-2 text-blue-600">
                    {a.metodo === "codigo" ? "Código" : "Manual"}
                  </td>
                </tr>
              ))}
              {asistenciasHoy?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-blue-400">
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
