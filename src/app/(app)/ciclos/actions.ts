"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CicloFormState = { error: string | null };

export async function crearCiclo(
  _prevState: CicloFormState,
  formData: FormData
): Promise<CicloFormState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const fecha_inicio = String(formData.get("fecha_inicio") ?? "");
  const fecha_fin = String(formData.get("fecha_fin") ?? "");
  const montoRaw = String(formData.get("monto_default") ?? "");
  const monto_default = Number(montoRaw);

  if (!nombre) {
    return { error: "El nombre del ciclo es obligatorio." };
  }
  if (!fecha_inicio || !fecha_fin) {
    return { error: "Indica fecha de inicio y fin." };
  }
  if (fecha_fin < fecha_inicio) {
    return { error: "La fecha de fin no puede ser anterior a la de inicio." };
  }
  if (!montoRaw || Number.isNaN(monto_default) || monto_default < 0) {
    return { error: "Indica un monto por defecto válido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("ciclos").insert({
    nombre,
    fecha_inicio,
    fecha_fin,
    monto_default,
  });

  if (error) {
    return { error: "No se pudo crear el ciclo: " + error.message };
  }

  revalidatePath("/ciclos");
  return { error: null };
}

export async function cerrarCiclo(cicloId: string) {
  const supabase = await createClient();
  await supabase.from("ciclos").update({ activo: false }).eq("id", cicloId);
  revalidatePath("/ciclos");
}
