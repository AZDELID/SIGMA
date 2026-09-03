"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type MateriaFormState = { error: string | null };

export async function crearMateria(
  _prevState: MateriaFormState,
  formData: FormData
): Promise<MateriaFormState> {
  const nombre = String(formData.get("nombre") ?? "").trim();

  if (!nombre) {
    return { error: "El nombre de la materia es obligatorio." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("materias").insert({ nombre });

  if (error) {
    const duplicada = error.code === "23505";
    return {
      error: duplicada
        ? "Ya existe una materia con ese nombre."
        : "No se pudo crear la materia: " + error.message,
    };
  }

  revalidatePath("/materias");
  return { error: null };
}
