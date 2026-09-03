"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Turno } from "@/lib/types/database";

const TURNOS_VALIDOS: Turno[] = ["Mañana", "Tarde", "Noche"];

function telefonoValido(telefono: string): boolean {
  return telefono === "" || /^\d{9}$/.test(telefono);
}

function fechaNacimientoValida(fecha: string): boolean {
  if (fecha === "") return true;
  return fecha <= new Date().toISOString().slice(0, 10);
}

export type CampoAlumno =
  | "nombres"
  | "apellidos"
  | "dni"
  | "fecha_nacimiento"
  | "telefono"
  | "telefono_apoderado"
  | "turno"
  | "carrera_id"
  | "ciclo_id"
  | "monto_pactado";

export type ValoresAlumno = {
  nombres: string;
  apellidos: string;
  dni: string;
  fecha_nacimiento: string;
  telefono: string;
  telefono_apoderado: string;
  tiene_whatsapp: boolean;
  direccion: string;
  turno: string;
  monto_pactado: string;
  fecha_matricula: string;
};

function leerValores(formData: FormData): ValoresAlumno {
  return {
    nombres: String(formData.get("nombres") ?? "").trim(),
    apellidos: String(formData.get("apellidos") ?? "").trim(),
    dni: String(formData.get("dni") ?? "").trim(),
    fecha_nacimiento: String(formData.get("fecha_nacimiento") ?? ""),
    telefono: String(formData.get("telefono") ?? "").trim(),
    telefono_apoderado: String(formData.get("telefono_apoderado") ?? "").trim(),
    tiene_whatsapp: formData.get("tiene_whatsapp") === "on",
    direccion: String(formData.get("direccion") ?? "").trim(),
    turno: String(formData.get("turno") ?? ""),
    monto_pactado: String(formData.get("monto_pactado") ?? ""),
    fecha_matricula:
      String(formData.get("fecha_matricula") ?? "") ||
      new Date().toISOString().slice(0, 10),
  };
}

export type AlumnoFormState = {
  error: string | null;
  campo?: CampoAlumno;
  valores?: ValoresAlumno;
};

export async function crearAlumno(
  _prevState: AlumnoFormState,
  formData: FormData
): Promise<AlumnoFormState> {
  const v = leerValores(formData);
  const carrera_id = String(formData.get("carrera_id") ?? "");
  const foto_url = String(formData.get("foto_url") ?? "").trim();
  const ciclo_id = String(formData.get("ciclo_id") ?? "");
  const monto_pactado = Number(v.monto_pactado);

  if (!v.nombres) {
    return { error: "El nombre es obligatorio.", campo: "nombres", valores: v };
  }
  if (!v.apellidos) {
    return { error: "El apellido es obligatorio.", campo: "apellidos", valores: v };
  }
  if (!/^\d{8}$/.test(v.dni)) {
    return {
      error: "El DNI debe tener 8 dígitos (es la base del código del alumno).",
      campo: "dni",
      valores: v,
    };
  }
  if (!fechaNacimientoValida(v.fecha_nacimiento)) {
    return {
      error: "La fecha de nacimiento no puede ser posterior a hoy.",
      campo: "fecha_nacimiento",
      valores: v,
    };
  }
  if (!telefonoValido(v.telefono)) {
    return {
      error: "El teléfono del alumno debe tener 9 dígitos.",
      campo: "telefono",
      valores: v,
    };
  }
  if (!telefonoValido(v.telefono_apoderado)) {
    return {
      error: "El teléfono del apoderado debe tener 9 dígitos.",
      campo: "telefono_apoderado",
      valores: v,
    };
  }
  if (!TURNOS_VALIDOS.includes(v.turno as Turno)) {
    return { error: "Selecciona el turno.", campo: "turno", valores: v };
  }
  if (!carrera_id) {
    return {
      error: "Selecciona el área y la carrera a la que postula.",
      campo: "carrera_id",
      valores: v,
    };
  }
  if (!ciclo_id) {
    return {
      error: "Selecciona el ciclo en el que se matricula.",
      campo: "ciclo_id",
      valores: v,
    };
  }
  if (!v.monto_pactado || Number.isNaN(monto_pactado) || monto_pactado < 0) {
    return {
      error: "Indica un monto pactado válido.",
      campo: "monto_pactado",
      valores: v,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("crear_alumno_con_matricula", {
      p_nombres: v.nombres,
      p_apellidos: v.apellidos,
      p_dni: v.dni,
      p_fecha_nacimiento: v.fecha_nacimiento || null,
      p_telefono: v.telefono || null,
      p_telefono_apoderado: v.telefono_apoderado || null,
      p_tiene_whatsapp: v.tiene_whatsapp,
      p_direccion: v.direccion || null,
      p_turno: v.turno,
      p_carrera_id: carrera_id,
      p_foto_url: foto_url || null,
      p_ciclo_id: ciclo_id,
      p_monto_pactado: monto_pactado,
      p_fecha_matricula: v.fecha_matricula,
    })
    .single<{ alumno_id: string; matricula_id: string }>();

  if (error || !data) {
    const dniDuplicado = error?.code === "23505";
    return {
      error: dniDuplicado
        ? "Ya existe un alumno registrado con ese DNI."
        : "No se pudo registrar la matrícula: " + (error?.message ?? ""),
      campo: dniDuplicado ? "dni" : undefined,
      valores: v,
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

export type EditarAlumnoState = {
  error: string | null;
  campo?: CampoAlumno;
  valores?: ValoresAlumno;
};

export async function actualizarAlumno(
  alumnoId: string,
  _prevState: EditarAlumnoState,
  formData: FormData
): Promise<EditarAlumnoState> {
  const v = leerValores(formData);
  const carrera_id = String(formData.get("carrera_id") ?? "");
  const foto_url = String(formData.get("foto_url") ?? "").trim();

  if (!v.nombres) {
    return { error: "El nombre es obligatorio.", campo: "nombres", valores: v };
  }
  if (!v.apellidos) {
    return { error: "El apellido es obligatorio.", campo: "apellidos", valores: v };
  }
  if (!/^\d{8}$/.test(v.dni)) {
    return { error: "El DNI debe tener 8 dígitos.", campo: "dni", valores: v };
  }
  if (!fechaNacimientoValida(v.fecha_nacimiento)) {
    return {
      error: "La fecha de nacimiento no puede ser posterior a hoy.",
      campo: "fecha_nacimiento",
      valores: v,
    };
  }
  if (!telefonoValido(v.telefono)) {
    return {
      error: "El teléfono del alumno debe tener 9 dígitos.",
      campo: "telefono",
      valores: v,
    };
  }
  if (!telefonoValido(v.telefono_apoderado)) {
    return {
      error: "El teléfono del apoderado debe tener 9 dígitos.",
      campo: "telefono_apoderado",
      valores: v,
    };
  }
  if (!TURNOS_VALIDOS.includes(v.turno as Turno)) {
    return { error: "Selecciona el turno.", campo: "turno", valores: v };
  }
  if (!carrera_id) {
    return {
      error: "Selecciona el área y la carrera a la que postula.",
      campo: "carrera_id",
      valores: v,
    };
  }

  const supabase = await createClient();

  const { data: actual } = await supabase
    .from("alumnos")
    .select("dni, codigo, created_at, foto_url")
    .eq("id", alumnoId)
    .maybeSingle<{ dni: string; codigo: string; created_at: string; foto_url: string | null }>();

  if (!actual) {
    return { error: "No se encontró el alumno." };
  }

  const cambios: Record<string, unknown> = {
    nombres: v.nombres,
    apellidos: v.apellidos,
    dni: v.dni,
    fecha_nacimiento: v.fecha_nacimiento || null,
    telefono: v.telefono || null,
    telefono_apoderado: v.telefono_apoderado || null,
    tiene_whatsapp: v.tiene_whatsapp,
    direccion: v.direccion || null,
    turno: v.turno,
    carrera_id,
    foto_url: foto_url || actual.foto_url,
  };

  if (v.dni !== actual.dni) {
    const anioRegistro = new Date(actual.created_at).getUTCFullYear().toString().slice(-2);
    cambios.codigo = anioRegistro + v.dni;
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
      campo: dniDuplicado ? "dni" : undefined,
      valores: v,
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
