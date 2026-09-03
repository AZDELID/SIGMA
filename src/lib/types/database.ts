export type Ciclo = {
  id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  monto_default: number;
  activo: boolean;
  created_at: string;
};

export type Alumno = {
  id: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  dni: string | null;
  fecha_nacimiento: string | null;
  telefono: string | null;
  telefono_apoderado: string | null;
  direccion: string | null;
  activo: boolean;
  created_at: string;
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

export type Asistencia = {
  id: string;
  alumno_id: string;
  marcado_en: string;
  metodo: MetodoAsistencia;
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
