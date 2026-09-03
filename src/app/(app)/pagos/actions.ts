"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MetodoPago } from "@/lib/types/database";

export type PagoFormState = { error: string | null; ok?: boolean };

const METODOS_VALIDOS: MetodoPago[] = [
  "efectivo",
  "yape",
  "plin",
  "transferencia",
  "otro",
];

export async function registrarPago(
  _prevState: PagoFormState,
  formData: FormData
): Promise<PagoFormState> {
  const matricula_id = String(formData.get("matricula_id") ?? "");
  const montoRaw = String(formData.get("monto") ?? "");
  const monto = Number(montoRaw);
  const metodo_pago = String(formData.get("metodo_pago") ?? "efectivo") as MetodoPago;
  const numero_comprobante = String(formData.get("numero_comprobante") ?? "").trim();
  const observacion = String(formData.get("observacion") ?? "").trim();

  if (!matricula_id) {
    return { error: "Selecciona la matrícula a la que corresponde el pago." };
  }
  if (!montoRaw || Number.isNaN(monto) || monto <= 0) {
    return { error: "Indica un monto de pago válido." };
  }
  if (!METODOS_VALIDOS.includes(metodo_pago)) {
    return { error: "Método de pago inválido." };
  }

  const supabase = await createClient();

  const { data: matricula } = await supabase
    .from("matriculas_resumen")
    .select("alumno_id, saldo_pendiente")
    .eq("matricula_id", matricula_id)
    .maybeSingle<{ alumno_id: string; saldo_pendiente: number }>();

  if (matricula && monto > matricula.saldo_pendiente + 0.005) {
    return {
      error: `El monto supera el saldo pendiente (S/ ${matricula.saldo_pendiente.toFixed(2)}).`,
    };
  }

  const { error } = await supabase.from("pagos").insert({
    matricula_id,
    monto,
    metodo_pago,
    numero_comprobante: numero_comprobante || null,
    observacion: observacion || null,
  });

  if (error) {
    return { error: "No se pudo registrar el pago: " + error.message };
  }

  revalidatePath("/pagos");
  if (matricula) {
    revalidatePath(`/alumnos/${matricula.alumno_id}`);
  }
  return { error: null, ok: true };
}
