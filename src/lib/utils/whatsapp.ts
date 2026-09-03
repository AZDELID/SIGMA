import type { TipoAsistencia } from "@/lib/types/database";

// Perú: los celulares tienen 9 dígitos y el código de país es 51.
function normalizarTelefonoPeru(telefono: string): string {
  const soloDigitos = telefono.replace(/\D/g, "");
  if (soloDigitos.startsWith("51") && soloDigitos.length === 11) {
    return soloDigitos;
  }
  return "51" + soloDigitos;
}

const VERBO_POR_TIPO: Record<TipoAsistencia, string> = {
  entrada: "ingresó a la academia",
  salida: "salió de la academia",
  permiso: "salió con permiso de la academia",
};

/** Link de WhatsApp con el mensaje de asistencia ya escrito, listo para enviar con un clic. */
export function construirLinkAsistenciaWhatsapp(
  telefonoApoderado: string,
  nombreAlumno: string,
  tipo: TipoAsistencia
): string {
  const numero = normalizarTelefonoPeru(telefonoApoderado);
  const fecha = new Date().toLocaleDateString("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const mensaje = `${nombreAlumno} hoy ${fecha} ${VERBO_POR_TIPO[tipo]}`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
