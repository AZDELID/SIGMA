"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AlumnoFormState = { error: string | null };

export async function crearAlumno(
  _prevState: AlumnoFormState,
  formData: FormData
): Promise<AlumnoFormState> {
  const nombres = String(formData.get("nombres") ?? "").trim();
  const apellidos = String(formData.get("apellidos") ?? "").trim();
  const dni = String(formData.get("dni") ?? "").trim();
  const fecha_nacimiento = String(formData.get("fecha_nacimiento") ?? "");
  const telefono = String(formData.get("telefono") ?? "").trim();
  const telefono_apoderado = String(
    formData.get("telefono_apoderado") ?? ""
  ).trim();
  const direccion = String(formData.get("direccion") ?? "").trim();
  const ciclo_id = String(formData.get("ciclo_id") ?? "");
  const montoRaw = String(formData.get("monto_pactado") ?? "");
  const monto_pactado = Number(montoRaw);
  const fecha_matricula =
    String(formData.get("fecha_matricula") ?? "") ||
    new Date().toISOString().slice(0, 10);

  if (!nombres || !apellidos) {
    return { error: "Nombres y apellidos son obligatorios." };
  }
  if (!/^\d{8}$/.test(dni)) {
    return { error: "El DNI debe tener 8 dígitos (es la base del código del alumno)." };
  }
  if (!ciclo_id) {
    return { error: "Selecciona el ciclo en el que se matricula." };
  }
  if (!montoRaw || Number.isNaN(monto_pactado) || monto_pactado < 0) {
    return { error: "Indica un monto pactado válido." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("crear_alumno_con_matricula", {
      p_nombres: nombres,
      p_apellidos: apellidos,
      p_dni: dni,
      p_fecha_nacimiento: fecha_nacimiento || null,
      p_telefono: telefono || null,
      p_telefono_apoderado: telefono_apoderado || null,
      p_direccion: direccion || null,
      p_ciclo_id: ciclo_id,
      p_monto_pactado: monto_pactado,
      p_fecha_matricula: fecha_matricula,
    })
    .single<{ alumno_id: string; matricula_id: string }>();

  if (error || !data) {
    const dniDuplicado = error?.code === "23505";
    return {
      error: dniDuplicado
        ? "Ya existe un alumno registrado con ese DNI."
        : "No se pudo registrar la matrícula: " + (error?.message ?? ""),
    };
  }

  revalidatePath("/alumnos");
  redirect(`/alumnos/${data.alumno_id}`);
}

export type MatriculaFormState = { error: string | null };

export async function crearMatricula(
  alumnoId: string,
  _prevState: MatriculaFormState,
  formData: FormData
): Promise<MatriculaFormState> {
  const ciclo_id = String(formData.get("ciclo_id") ?? "");
  const montoRaw = String(formData.get("monto_pactado") ?? "");
  const monto_pactado = Number(montoRaw);

  if (!ciclo_id) {
    return { error: "Selecciona un ciclo." };
  }
  if (!montoRaw || Number.isNaN(monto_pactado) || monto_pactado < 0) {
    return { error: "Indica un monto pactado válido." };
  }

  const supabase = await createClient();

  const { data: alumno } = await supabase
    .from("alumnos")
    .select("activo")
    .eq("id", alumnoId)
    .maybeSingle<{ activo: boolean }>();

  if (alumno && !alumno.activo) {
    return { error: "Este alumno está dado de baja. Reactívalo antes de matricularlo." };
  }

  const { error } = await supabase.from("matriculas").insert({
    alumno_id: alumnoId,
    ciclo_id,
    monto_pactado,
  });

  if (error) {
    const duplicada = error.code === "23505";
    return {
      error: duplicada
        ? "Este alumno ya está matriculado en ese ciclo."
        : "No se pudo registrar la matrícula: " + error.message,
    };
  }

  revalidatePath(`/alumnos/${alumnoId}`);
  return { error: null };
}

export type EditarAlumnoState = { error: string | null };

export async function actualizarAlumno(
  alumnoId: string,
  _prevState: EditarAlumnoState,
  formData: FormData
): Promise<EditarAlumnoState> {
  const nombres = String(formData.get("nombres") ?? "").trim();
  const apellidos = String(formData.get("apellidos") ?? "").trim();
  const dni = String(formData.get("dni") ?? "").trim();
  const fecha_nacimiento = String(formData.get("fecha_nacimiento") ?? "");
  const telefono = String(formData.get("telefono") ?? "").trim();
  const telefono_apoderado = String(
    formData.get("telefono_apoderado") ?? ""
  ).trim();
  const direccion = String(formData.get("direccion") ?? "").trim();

  if (!nombres || !apellidos) {
    return { error: "Nombres y apellidos son obligatorios." };
  }
  if (!/^\d{8}$/.test(dni)) {
    return { error: "El DNI debe tener 8 dígitos." };
  }

  const supabase = await createClient();

  const { data: actual } = await supabase
    .from("alumnos")
    .select("dni, codigo, created_at")
    .eq("id", alumnoId)
    .maybeSingle<{ dni: string; codigo: string; created_at: string }>();

  if (!actual) {
    return { error: "No se encontró el alumno." };
  }

  const cambios: Record<string, unknown> = {
    nombres,
    apellidos,
    dni,
    fecha_nacimiento: fecha_nacimiento || null,
    telefono: telefono || null,
    telefono_apoderado: telefono_apoderado || null,
    direccion: direccion || null,
  };

  if (dni !== actual.dni) {
    const anioRegistro = new Date(actual.created_at).getUTCFullYear().toString().slice(-2);
    cambios.codigo = anioRegistro + dni;
  }

  const { error } = await supabase
    .from("alumnos")
    .update(cambios)
    .eq("id", alumnoId);

  if (error) {
    const dniDuplicado = error.code === "23505";
    return {
      error: dniDuplicado
        ? "Ya existe un alumno registrado con ese DNI."
        : "No se pudo guardar: " + error.message,
    };
  }

  revalidatePath(`/alumnos/${alumnoId}`);
  revalidatePath("/alumnos");
  redirect(`/alumnos/${alumnoId}`);
}

export async function darDeBajaAlumno(alumnoId: string) {
  const supabase = await createClient();
  await supabase.from("alumnos").update({ activo: false }).eq("id", alumnoId);
  revalidatePath(`/alumnos/${alumnoId}`);
  revalidatePath("/alumnos");
}

export async function reactivarAlumno(alumnoId: string) {
  const supabase = await createClient();
  await supabase.from("alumnos").update({ activo: true }).eq("id", alumnoId);
  revalidatePath(`/alumnos/${alumnoId}`);
  revalidatePath("/alumnos");
}
