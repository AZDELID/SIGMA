"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Alumno } from "@/lib/types/database";

export type MarcarPorCodigoState = {
  error: string | null;
  ok?: { alumno: string; yaEstabaMarcado: boolean };
};

async function yaMarcadoHoy(
  supabase: Awaited<ReturnType<typeof createClient>>,
  alumnoId: string
) {
  const inicioDia = new Date();
  inicioDia.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("asistencias")
    .select("id", { count: "exact", head: true })
    .eq("alumno_id", alumnoId)
    .gte("marcado_en", inicioDia.toISOString());

  return (count ?? 0) > 0;
}

export async function marcarPorCodigo(
  _prevState: MarcarPorCodigoState,
  formData: FormData
): Promise<MarcarPorCodigoState> {
  const codigo = String(formData.get("codigo") ?? "").trim();

  if (!codigo) {
    return { error: null };
  }

  const supabase = await createClient();
  const { data: alumno } = await supabase
    .from("alumnos")
    .select("*")
    .eq("codigo", codigo)
    .maybeSingle<Alumno>();

  if (!alumno) {
    return { error: `No se encontró ningún alumno con el código "${codigo}".` };
  }

  const yaEstabaMarcado = await yaMarcadoHoy(supabase, alumno.id);

  const { error } = await supabase
    .from("asistencias")
    .insert({ alumno_id: alumno.id, metodo: "codigo" });

  if (error) {
    return { error: "No se pudo registrar la asistencia: " + error.message };
  }

  revalidatePath("/asistencia");
  return {
    error: null,
    ok: {
      alumno: `${alumno.nombres} ${alumno.apellidos}`,
      yaEstabaMarcado,
    },
  };
}

export async function marcarManual(alumnoId: string) {
  const supabase = await createClient();
  await supabase
    .from("asistencias")
    .insert({ alumno_id: alumnoId, metodo: "manual" });
  revalidatePath("/asistencia");
}
