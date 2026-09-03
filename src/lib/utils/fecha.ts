// Perú usa UTC-5 todo el año (sin horario de verano). El servidor donde
// corre Next.js normalmente usa UTC, así que "medianoche del servidor"
// no coincide con "medianoche en Lima" — estos helpers calculan los
// límites de día/mes en hora de Lima sin depender de la zona horaria
// del proceso de Node.
const OFFSET_LIMA_HORAS = 5;

function comoFechaLima(referencia: Date): Date {
  return new Date(referencia.getTime() - OFFSET_LIMA_HORAS * 60 * 60 * 1000);
}

/** Instante (UTC) que corresponde a las 00:00 de hoy en Lima. */
export function inicioDiaLima(referencia = new Date()): Date {
  const limaShift = comoFechaLima(referencia);
  return new Date(
    Date.UTC(
      limaShift.getUTCFullYear(),
      limaShift.getUTCMonth(),
      limaShift.getUTCDate(),
      OFFSET_LIMA_HORAS,
      0,
      0,
      0
    )
  );
}

/** Instante (UTC) que corresponde al día 1 del mes actual, 00:00 en Lima. */
export function inicioMesLima(referencia = new Date()): Date {
  const limaShift = comoFechaLima(referencia);
  return new Date(
    Date.UTC(
      limaShift.getUTCFullYear(),
      limaShift.getUTCMonth(),
      1,
      OFFSET_LIMA_HORAS,
      0,
      0,
      0
    )
  );
}

/** Fecha de hoy en Lima, como "YYYY-MM-DD" (para comparar contra columnas `date`). */
export function hoyLima(referencia = new Date()): string {
  return comoFechaLima(referencia).toISOString().slice(0, 10);
}

/** Instante (UTC) de las 00:00 en Lima para una fecha "YYYY-MM-DD" dada (no depende de "ahora"). */
export function inicioDiaLimaDeFecha(fechaISO: string): Date {
  const [anio, mes, dia] = fechaISO.split("-").map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia, OFFSET_LIMA_HORAS, 0, 0, 0));
}
