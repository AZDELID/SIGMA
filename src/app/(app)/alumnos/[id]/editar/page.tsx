import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Alumno, Area, Carrera } from "@/lib/types/database";
import { EditarAlumnoForm } from "./editar-alumno-form";

export default async function EditarAlumnoPage({
  params,
}: PageProps<"/alumnos/[id]/editar">) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: alumno }, { data: areas }, { data: carreras }] =
    await Promise.all([
      supabase.from("alumnos").select("*").eq("id", id).maybeSingle<Alumno>(),
      supabase.from("areas").select("*").order("orden").returns<Area[]>(),
      supabase.from("carreras").select("*").order("nombre").returns<Carrera[]>(),
    ]);

  if (!alumno) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/alumnos/${alumno.id}`}
          className="text-sm text-brand-600 hover:text-brand-ink"
        >
          ← Volver a la ficha
        </Link>
        <h1 className="mt-1 text-lg font-semibold text-brand-ink">
          Editar alumno
        </h1>
      </div>

      <EditarAlumnoForm alumno={alumno} areas={areas ?? []} carreras={carreras ?? []} />
    </div>
  );
}
