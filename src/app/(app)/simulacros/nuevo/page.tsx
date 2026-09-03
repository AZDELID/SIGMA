import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Ciclo, Materia } from "@/lib/types/database";
import { SimulacroForm } from "./simulacro-form";

export default async function NuevoSimulacroPage() {
  const supabase = await createClient();
  const [{ data: ciclos }, { data: materias }] = await Promise.all([
    supabase
      .from("ciclos")
      .select("*")
      .eq("activo", true)
      .order("fecha_inicio", { ascending: false })
      .returns<Ciclo[]>(),
    supabase.from("materias").select("*").order("nombre").returns<Materia[]>(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/simulacros" className="text-sm text-brand-600 hover:text-brand-ink">
          ← Notas
        </Link>
<<<<<<< HEAD
        <h1 className="mt-1 text-lg font-semibold text-brand-ink">
=======
        <h1 className="mt-1 text-xl font-bold text-brand-900">
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
          Nuevo simulacro
        </h1>
      </div>

      {ciclos && ciclos.length > 0 ? (
        <SimulacroForm ciclos={ciclos} materias={materias ?? []} />
      ) : (
        <p className="rounded-lg border border-brand-yellow-200 bg-brand-yellow-50 p-4 text-sm text-brand-yellow-dark">
          No hay ciclos activos. Crea un ciclo antes de registrar un simulacro en{" "}
          <Link href="/ciclos" className="underline">
            Ciclos
          </Link>
          .
        </p>
      )}
    </div>
  );
}
