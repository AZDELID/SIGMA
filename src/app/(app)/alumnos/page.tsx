import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Alumno } from "@/lib/types/database";

export default async function AlumnosPage({
  searchParams,
}: PageProps<"/alumnos">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const supabase = await createClient();
  let request = supabase
    .from("alumnos")
    .select("*")
    .order("apellidos", { ascending: true })
    .limit(100);

  if (query) {
    const like = `%${query}%`;
    request = request.or(
      `nombres.ilike.${like},apellidos.ilike.${like},dni.ilike.${like},codigo.ilike.${like}`
    );
  }

  const { data: alumnos } = await request.returns<Alumno[]>();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-blue-900">Alumnos</h1>
          <p className="text-sm text-blue-600">
            {alumnos?.length ?? 0} resultado(s)
          </p>
        </div>
        <Link
          href="/alumnos/nuevo"
          className="rounded-md bg-blue-900 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          + Matricular alumno
        </Link>
      </div>

      <form className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Buscar por nombre, apellido, DNI o código..."
          className="w-full max-w-md rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
        />
        <button
          type="submit"
          className="rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-blue-700 hover:bg-sky-100"
        >
          Buscar
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-sky-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-sky-50 text-left text-xs font-medium uppercase text-blue-600">
            <tr>
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">DNI</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100">
            {alumnos?.map((alumno) => (
              <tr key={alumno.id}>
                <td className="px-4 py-2 font-mono text-xs text-blue-600">
                  {alumno.codigo}
                </td>
                <td className="px-4 py-2 font-medium text-blue-900">
                  {alumno.apellidos}, {alumno.nombres}
                </td>
                <td className="px-4 py-2 text-blue-600">
                  {alumno.dni ?? "—"}
                </td>
                <td className="px-4 py-2 text-blue-600">
                  {alumno.telefono ?? "—"}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/alumnos/${alumno.id}`}
                    className="text-xs text-blue-600 hover:text-blue-900"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {alumnos?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-blue-400">
                  No se encontraron alumnos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
