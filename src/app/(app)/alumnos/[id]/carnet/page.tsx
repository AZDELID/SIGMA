import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Alumno } from "@/lib/types/database";
import { generarQrDataUrl } from "@/lib/utils/qr";
import { PrintButton } from "./print-button";

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

  const qrDataUrl = await generarQrDataUrl(alumno.codigo);

  return (
    <div className="flex flex-col items-center gap-6 py-8 print:py-0">
      <div className="flex items-center gap-3 print:hidden">
        <Link
          href={`/alumnos/${alumno.id}`}
          className="text-sm text-brand-600 hover:text-brand-900"
        >
          ← Volver
        </Link>
        <PrintButton />
      </div>

      <div className="flex w-80 flex-col items-center gap-3 rounded-xl border-2 border-brand-900 bg-white p-6 text-center shadow-sm print:shadow-none">
        <Image src="/logo.png" alt="SIGMA" width={64} height={64} />
        <p className="text-sm font-semibold text-brand-900">
          SIGMA — Carnet de alumno
        </p>

        <Image
          src={qrDataUrl}
          alt={`Código QR de ${alumno.codigo}`}
          width={200}
          height={200}
          unoptimized
        />

        <p className="text-lg font-semibold text-brand-900">
          {alumno.nombres} {alumno.apellidos}
        </p>
        <p className="font-mono text-base tracking-wider text-brand-700">
          {alumno.codigo}
        </p>
        <p className="text-xs text-brand-600">DNI {alumno.dni}</p>
      </div>
    </div>
  );
}
