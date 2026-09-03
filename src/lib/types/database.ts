export type Ciclo = {
  id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  monto_default: number;
  activo: boolean;
  created_at: string;
};

export type Turno = "Mañana" | "Tarde" | "Noche";

export type Alumno = {
  id: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fecha_nacimiento: string | null;
  telefono: string | null;
  telefono_apoderado: string | null;
  tiene_whatsapp: boolean;
  direccion: string | null;
  turno: Turno | null;
  carrera_id: string | null;
  foto_url: string | null;
  activo: boolean;
  created_at: string;
};

export type Area = {
  id: string;
  nombre: string;
  orden: number;
};

export type Carrera = {
  id: string;
  nombre: string;
  area_id: string;
};

export type Matricula = {
  id: string;
  alumno_id: string;
  ciclo_id: string;
  monto_pactado: number;
  fecha_matricula: string;
  created_at: string;
};

export type MetodoPago = "efectivo" | "yape" | "plin" | "transferencia" | "otro";

export type Pago = {
  id: string;
  matricula_id: string;
  monto: number;
  fecha_pago: string;
  metodo_pago: MetodoPago;
  numero_comprobante: string | null;
  observacion: string | null;
  created_at: string;
};

export type MetodoAsistencia = "codigo" | "manual";
export type TipoAsistencia = "entrada" | "salida" | "permiso";

export type Asistencia = {
  id: string;
  alumno_id: string;
  marcado_en: string;
  metodo: MetodoAsistencia;
  tipo: TipoAsistencia;
  created_at: string;
};

export type MatriculaResumen = {
  matricula_id: string;
  alumno_id: string;
  alumno_codigo: string;
  alumno_nombres: string;
  alumno_apellidos: string;
  ciclo_id: string;
  ciclo_nombre: string;
  monto_pactado: number;
  total_pagado: number;
  saldo_pendiente: number;
  fecha_matricula: string;
};

export type Materia = {
  id: string;
  nombre: string;
  created_at: string;
};

export type Simulacro = {
  id: string;
  nombre: string;
  fecha: string;
  ciclo_id: string;
  created_at: string;
};

export type SimulacroMateria = {
  id: string;
  simulacro_id: string;
  materia_id: string;
  puntaje_maximo: number;
  created_at: string;
};

export type Resultado = {
  id: string;
  simulacro_materia_id: string;
  alumno_id: string;
  puntaje_obtenido: number;
  created_at: string;
  updated_at: string;
};

export type ResultadoDetalle = {
  resultado_id: string;
  alumno_id: string;
  alumno_nombres: string;
  alumno_apellidos: string;
  simulacro_materia_id: string;
  simulacro_id: string;
  simulacro_nombre: string;
  simulacro_fecha: string;
  ciclo_id: string;
  materia_id: string;
  materia_nombre: string;
  puntaje_maximo: number;
  puntaje_obtenido: number;
  nota: number;
};

export type NotaFinalSimulacro = {
  simulacro_id: string;
  simulacro_nombre: string;
  simulacro_fecha: string;
  ciclo_id: string;
  alumno_id: string;
  alumno_nombres: string;
  alumno_apellidos: string;
  materias_rendidas: number;
  nota_final: number;
};
