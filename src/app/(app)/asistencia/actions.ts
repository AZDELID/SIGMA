"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Alumno } from "@/lib/types/database";
import { hoyLima } from "@/lib/utils/fecha";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export type MarcarPorCodigoState = {
  error: string | null;
  ok?: {
    alumno: string;
    telefonoApoderado: string | null;
    tieneWhatsapp: boolean;
    yaEstabaMarcado: boolean;
    entradaEn: string;
  };
};

async function registroDeHoy(supabase: Supabase, alumnoId: string) {
  const { data } = await supabase
    .from("asistencias")
    .select("id, entrada_en, salida_en, permiso")
    .eq("alumno_id", alumnoId)
    .eq("fecha", hoyLima())
    .maybeSingle();
  return data;
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

  if (!alumno.activo) {
    return { error: `${alumno.nombres} ${alumno.apellidos} está dado de baja.` };
  }

  const existente = await registroDeHoy(supabase, alumno.id);

  if (existente?.entrada_en) {
    return {
      error: null,
      ok: {
        alumno: `${alumno.nombres} ${alumno.apellidos}`,
        telefonoApoderado: alumno.telefono_apoderado,
        tieneWhatsapp: alumno.tiene_whatsapp,
        yaEstabaMarcado: true,
        entradaEn: existente.entrada_en,
      },
    };
  }

  const entradaEn = new Date().toISOString();
  const { error } = await supabase.from("asistencias").upsert(
    {
      alumno_id: alumno.id,
      fecha: hoyLima(),
      entrada_en: entradaEn,
      entrada_metodo: "codigo",
    },
    { onConflict: "alumno_id,fecha" }
  );

  if (error) {
    return { error: "No se pudo registrar la asistencia: " + error.message };
  }

  revalidatePath("/asistencia");
  return {
    error: null,
    ok: {
      alumno: `${alumno.nombres} ${alumno.apellidos}`,
      telefonoApoderado: alumno.telefono_apoderado,
      tieneWhatsapp: alumno.tiene_whatsapp,
      yaEstabaMarcado: false,
      entradaEn,
    },
  };
}

export async function marcarEntradaManual(alumnoId: string) {
  const supabase = await createClient();
  const existente = await registroDeHoy(supabase, alumnoId);

  if (existente?.entrada_en) return;

  await supabase.from("asistencias").upsert(
    {
      alumno_id: alumnoId,
      fecha: hoyLima(),
      entrada_en: new Date().toISOString(),
      entrada_metodo: "manual",
    },
    { onConflict: "alumno_id,fecha" }
  );
  revalidatePath("/asistencia");
}

export async function marcarSalida(alumnoId: string) {
  const supabase = await createClient();
  const existente = await registroDeHoy(supabase, alumnoId);

  // Salida y permiso son mutuamente excluyentes por registro: si ya hay
  // permiso marcado hoy, no se marca salida también.
  if (existente?.salida_en || existente?.permiso) return;

  await supabase.from("asistencias").upsert(
    {
      alumno_id: alumnoId,
      fecha: hoyLima(),
      salida_en: new Date().toISOString(),
      salida_metodo: "manual",
    },
    { onConflict: "alumno_id,fecha" }
  );
  revalidatePath("/asistencia");
}

export async function marcarPermiso(alumnoId: string) {
  const supabase = await createClient();
  const existente = await registroDeHoy(supabase, alumnoId);

  if (existente?.permiso || existente?.salida_en) return;

  await supabase.from("asistencias").upsert(
    {
      alumno_id: alumnoId,
      fecha: hoyLima(),
      permiso: true,
      permiso_en: new Date().toISOString(),
      permiso_metodo: "manual",
    },
    { onConflict: "alumno_id,fecha" }
  );
  revalidatePath("/asistencia");
}

export async function buscarAlumnosActivos(query: string): Promise<Alumno[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("alumnos")
    .select("*")
    .eq("activo", true)
    .or(`nombres.ilike.%${q}%,apellidos.ilike.%${q}%,dni.ilike.%${q}%`)
    .order("apellidos", { ascending: true })
    .limit(8)
    .returns<Alumno[]>();

  return data ?? [];
}

export async function eliminarAsistencia(id: string) {
  const supabase = await createClient();
  await supabase.from("asistencias").delete().eq("id", id);
  revalidatePath("/asistencia");
}
