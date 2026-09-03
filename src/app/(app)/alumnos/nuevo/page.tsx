import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Area, Carrera, Ciclo } from "@/lib/types/database";
import { AlumnoForm } from "./alumno-form";

export default async function NuevoAlumnoPage() {
  const supabase = await createClient();
  const [{ data: ciclos }, { data: areas }, { data: carreras }] =
    await Promise.all([
      supabase
        .from("ciclos")
        .select("*")
        .eq("activo", true)
        .order("fecha_inicio", { ascending: false })
        .returns<Ciclo[]>(),
      supabase.from("areas").select("*").order("orden").returns<Area[]>(),
      supabase.from("carreras").select("*").order("nombre").returns<Carrera[]>(),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/alumnos"
          className="text-sm text-brand-600 hover:text-brand-900"
        >
          ← Alumnos
        </Link>
        <h1 className="mt-1 text-xl font-bold text-brand-900">
          Nueva matrícula
        </h1>
      </div>

      {ciclos && ciclos.length > 0 ? (
        <AlumnoForm ciclos={ciclos} areas={areas ?? []} carreras={carreras ?? []} />
      ) : (
        <p className="rounded-lg border border-brand-yellow-200 bg-brand-yellow-50 p-4 text-sm text-brand-yellow-dark">
          No hay ciclos activos. Crea un ciclo antes de matricular alumnos en{" "}
          <Link href="/ciclos" className="underline">
            Ciclos
          </Link>
          .
        </p>
      )}
    </div>
  );
}
