import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Alumno } from "@/lib/types/database";

export default async function AlumnosPage({
  searchParams,
}: PageProps<"/alumnos">) {
  const { q, todos } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const incluirBajas = todos === "1";

  const supabase = await createClient();
  let request = supabase
    .from("alumnos")
    .select("*")
    .order("apellidos", { ascending: true })
    .limit(100);

  if (!incluirBajas) {
    request = request.eq("activo", true);
  }

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
<<<<<<< HEAD
          <h1 className="text-lg font-semibold text-brand-ink">Alumnos</h1>
=======
          <h1 className="text-xl font-bold text-brand-900">Alumnos</h1>
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
          <p className="text-sm text-brand-600">
            {alumnos?.length ?? 0} resultado(s)
          </p>
        </div>
        <Link
          href="/alumnos/nuevo"
          className="rounded-md bg-brand-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98]"
        >
          + Matricular alumno
        </Link>
      </div>

      <form className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Buscar por nombre, apellido, DNI o código..."
          className="w-full max-w-md rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
        />
        <button
          type="submit"
          className="rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-700 hover:bg-brand-100"
        >
          Buscar
        </button>
        <label className="flex items-center gap-1.5 text-sm text-brand-700">
          <input type="checkbox" name="todos" value="1" defaultChecked={incluirBajas} />
          Incluir dados de baja
        </label>
      </form>

      <div className="overflow-hidden rounded-lg border border-brand-200 bg-brand-surface">
        <table className="w-full text-sm">
          <thead className="bg-brand-50 text-left text-[11px] font-semibold uppercase tracking-wider text-brand-700">
            <tr>
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">DNI</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {alumnos?.map((alumno) => (
              <tr key={alumno.id} className="transition-colors hover:bg-brand-50">
                <td className="px-4 py-2 font-mono text-xs text-brand-600">
                  {alumno.codigo}
                </td>
                <td className="px-4 py-2 font-medium text-brand-ink">
                  {alumno.apellidos}, {alumno.nombres}
                  {!alumno.activo && (
                    <span className="ml-2 rounded-full bg-brand-red-100 px-2 py-0.5 text-xs font-normal text-brand-red-dark">
                      Dado de baja
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-brand-600">{alumno.dni}</td>
                <td className="px-4 py-2 text-brand-600">
                  {alumno.telefono ?? "—"}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/alumnos/${alumno.id}`}
                    className="text-xs text-brand-600 hover:text-brand-ink"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {alumnos?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-brand-400">
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
