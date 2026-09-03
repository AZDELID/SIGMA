import type { TipoAsistencia } from "@/lib/types/database";

export const ETIQUETA_TIPO_ASISTENCIA: Record<TipoAsistencia, string> = {
  entrada: "Entrada",
  salida: "Salida",
  permiso: "Permiso",
};

export const COLOR_TIPO_ASISTENCIA: Record<TipoAsistencia, string> = {
  entrada: "bg-green-100 text-green-700",
  salida: "bg-brand-100 text-brand-700",
  permiso: "bg-brand-yellow-100 text-brand-yellow-dark",
};
