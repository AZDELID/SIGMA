import { createClient } from "@/lib/supabase/server";
import type { Materia } from "@/lib/types/database";
import { MateriaForm } from "./materia-form";

export default async function MateriasPage() {
  const supabase = await createClient();
  const { data: materias } = await supabase
    .from("materias")
    .select("*")
    .order("nombre", { ascending: true })
    .returns<Materia[]>();

  return (
    <div className="space-y-6">
      <div>
<<<<<<< HEAD
        <h1 className="text-lg font-semibold text-brand-ink">Materias</h1>
=======
        <h1 className="text-xl font-bold text-brand-900">Materias</h1>
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
        <p className="text-sm text-brand-600">
          Cursos que se evalúan en los simulacros (Aritmética, Álgebra, Lenguaje...).
        </p>
      </div>

      <MateriaForm />

      <div className="overflow-hidden rounded-lg border border-brand-200 bg-brand-surface">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-brand-100">
            {materias?.map((m) => (
              <tr key={m.id} className="transition-colors hover:bg-brand-50">
                <td className="px-4 py-2 font-medium text-brand-ink">{m.nombre}</td>
              </tr>
            ))}
            {materias?.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-brand-400">
                  Todavía no hay materias registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
