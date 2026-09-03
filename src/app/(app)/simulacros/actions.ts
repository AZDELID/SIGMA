"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SimulacroFormState = { error: string | null };

type MateriaSeleccionada = { materia_id: string; puntaje_maximo: number };

export async function crearSimulacro(
  _prevState: SimulacroFormState,
  formData: FormData
): Promise<SimulacroFormState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const fecha =
    String(formData.get("fecha") ?? "") || new Date().toISOString().slice(0, 10);
  const ciclo_id = String(formData.get("ciclo_id") ?? "");
  const materiasRaw = String(formData.get("materias") ?? "[]");

  if (!nombre) {
    return { error: "El nombre del simulacro es obligatorio." };
  }
  if (!ciclo_id) {
    return { error: "Selecciona el ciclo." };
  }

  let materias: MateriaSeleccionada[];
  try {
    materias = JSON.parse(materiasRaw);
  } catch {
    return { error: "Datos de materias inválidos." };
  }

  if (!Array.isArray(materias) || materias.length === 0) {
    return { error: "Selecciona al menos una materia y su puntaje máximo." };
  }
  for (const m of materias) {
    if (
      !m.materia_id ||
      typeof m.puntaje_maximo !== "number" ||
      Number.isNaN(m.puntaje_maximo) ||
      m.puntaje_maximo <= 0
    ) {
      return { error: "Cada materia seleccionada necesita un puntaje máximo válido." };
    }
    if (m.puntaje_maximo > 20) {
      return { error: "El puntaje máximo de una materia no puede pasar de 20." };
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("crear_simulacro_con_materias", {
    p_nombre: nombre,
    p_fecha: fecha,
    p_ciclo_id: ciclo_id,
    p_materias: materias,
  });

  if (error || !data) {
    return { error: "No se pudo crear el simulacro: " + (error?.message ?? "") };
  }

  revalidatePath("/simulacros");
  redirect(`/simulacros/${data}`);
}

export type GuardarPuntajesState = { error: string | null; ok?: boolean };

export async function guardarPuntajes(
  simulacroId: string,
  simulacroMateriaId: string,
  puntajeMaximo: number,
  _prevState: GuardarPuntajesState,
  formData: FormData
): Promise<GuardarPuntajesState> {
  const entradas: {
    simulacro_materia_id: string;
    alumno_id: string;
    puntaje_obtenido: number;
    updated_at: string;
  }[] = [];

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("puntaje_")) continue;
    const alumnoId = key.slice("puntaje_".length);
    const raw = String(value).trim();
    if (raw === "") continue;

    const puntaje = Number(raw);
    if (Number.isNaN(puntaje) || puntaje < 0) {
      return { error: "Uno de los puntajes ingresados no es un número válido." };
    }
    if (puntaje > puntajeMaximo) {
      return {
        error: `Ningún puntaje puede superar el máximo de esta materia (${puntajeMaximo}).`,
      };
    }

    entradas.push({
      simulacro_materia_id: simulacroMateriaId,
      alumno_id: alumnoId,
      puntaje_obtenido: puntaje,
      updated_at: new Date().toISOString(),
    });
  }

  if (entradas.length === 0) {
    return { error: "No ingresaste ningún puntaje." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("resultados")
    .upsert(entradas, { onConflict: "simulacro_materia_id,alumno_id" });

  if (error) {
    return { error: "No se pudo guardar: " + error.message };
  }

  revalidatePath(`/simulacros/${simulacroId}`);
  return { error: null, ok: true };
}
