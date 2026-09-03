"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Alumno, TipoAsistencia } from "@/lib/types/database";
import { inicioDiaLima } from "@/lib/utils/fecha";

const TIPOS_VALIDOS: TipoAsistencia[] = ["entrada", "salida", "permiso"];

function esTipoValido(valor: string): valor is TipoAsistencia {
  return TIPOS_VALIDOS.includes(valor as TipoAsistencia);
}

export type MarcarPorCodigoState = {
  error: string | null;
  ok?: {
    alumno: string;
    tipo: TipoAsistencia;
    telefonoApoderado: string | null;
    tieneWhatsapp: boolean;
    yaEstabaMarcado: boolean;
  };
};

async function yaMarcadoHoy(
  supabase: Awaited<ReturnType<typeof createClient>>,
  alumnoId: string,
  tipo: TipoAsistencia
) {
  const { count } = await supabase
    .from("asistencias")
    .select("id", { count: "exact", head: true })
    .eq("alumno_id", alumnoId)
    .eq("tipo", tipo)
    .gte("marcado_en", inicioDiaLima().toISOString());

  return (count ?? 0) > 0;
}

export async function marcarPorCodigo(
  _prevState: MarcarPorCodigoState,
  formData: FormData
): Promise<MarcarPorCodigoState> {
  const codigo = String(formData.get("codigo") ?? "").trim();
  const tipoRaw = String(formData.get("tipo") ?? "entrada");
  const tipo: TipoAsistencia = esTipoValido(tipoRaw) ? tipoRaw : "entrada";

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

  if (!alumno.activo) {
    return { error: `${alumno.nombres} ${alumno.apellidos} está dado de baja.` };
  }

  const yaEstabaMarcado = await yaMarcadoHoy(supabase, alumno.id, tipo);

  const { error } = await supabase
    .from("asistencias")
    .insert({ alumno_id: alumno.id, metodo: "codigo", tipo });

  if (error) {
    return { error: "No se pudo registrar la asistencia: " + error.message };
  }

  revalidatePath("/asistencia");
  return {
    error: null,
    ok: {
      alumno: `${alumno.nombres} ${alumno.apellidos}`,
      tipo,
      telefonoApoderado: alumno.telefono_apoderado,
      tieneWhatsapp: alumno.tiene_whatsapp,
      yaEstabaMarcado,
    },
  };
}

export async function marcarManual(alumnoId: string, tipo: TipoAsistencia) {
  const supabase = await createClient();
  await supabase
    .from("asistencias")
    .insert({ alumno_id: alumnoId, metodo: "manual", tipo });
  revalidatePath("/asistencia");
}
