import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Alumno } from "@/lib/types/database";
import { generarQrDataUrl } from "@/lib/utils/qr";
import { CarnetView } from "./carnet-view";
import type { DatosCarnet } from "./carnet-card";

export default async function CarnetAlumnoPage({
  params,
}: PageProps<"/alumnos/[id]/carnet">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: alumno } = await supabase
    .from("alumnos")
    .select("*")
    .eq("id", id)
    .maybeSingle<Alumno>();

  if (!alumno) {
    notFound();
  }

  let areaNumero: number | null = null;
  if (alumno.carrera_id) {
    const { data: carrera } = await supabase
      .from("carreras")
      .select("areas!inner(orden)")
      .eq("id", alumno.carrera_id)
      .maybeSingle<{ areas: { orden: number } }>();
    areaNumero = carrera?.areas.orden ?? null;
  }

  const qrDataUrl = await generarQrDataUrl(alumno.codigo);

  const datos: DatosCarnet = {
    nombreCompleto: `${alumno.nombres} ${alumno.apellidos}`,
    codigo: alumno.codigo,
    areaNumero,
    turno: alumno.turno,
    fotoUrl: alumno.foto_url,
    qrDataUrl,
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6 print:py-0">
      <Link
        href={`/alumnos/${alumno.id}`}
        className="self-start text-sm text-brand-600 hover:text-brand-900 print:hidden"
      >
        ← Volver
      </Link>

      <CarnetView datos={datos} />
    </div>
  );
}
