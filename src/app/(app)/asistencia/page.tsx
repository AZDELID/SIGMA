import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { hoyLima } from "@/lib/utils/fecha";
import { BuscarAlumnoManual } from "./buscar-alumno-manual";
import { CodigoForm } from "./codigo-form";
import { EliminarAsistenciaBoton } from "./eliminar-asistencia-boton";
import { MarcarManualBoton } from "./marcar-manual-boton";

type RegistroHoy = {
  id: string;
  alumno_id: string;
  entrada_en: string | null;
  salida_en: string | null;
  permiso: boolean;
  alumnos: {
    nombres: string;
    apellidos: string;
    codigo: string;
    telefono_apoderado: string | null;
    tiene_whatsapp: boolean;
  };
};

const VISTAS_VALIDAS = ["escaneo", "hoy"] as const;
type Vista = (typeof VISTAS_VALIDAS)[number];

function hora(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("es-PE", { timeZone: "America/Lima" });
}

export default async function AsistenciaPage({
  searchParams,
}: PageProps<"/asistencia">) {
  const { vista: vistaParam } = await searchParams;
  const vista: Vista =
    typeof vistaParam === "string" &&
    VISTAS_VALIDAS.includes(vistaParam as Vista)
      ? (vistaParam as Vista)
      : "escaneo";

  const supabase = await createClient();

  const { data: registrosHoy } = await supabase
    .from("asistencias")
    .select(
      "id, alumno_id, entrada_en, salida_en, permiso, alumnos!inner(nombres, apellidos, codigo, telefono_apoderado, tiene_whatsapp)"
    )
    .eq("fecha", hoyLima())
    .order("entrada_en", { ascending: false, nullsFirst: false })
    .returns<RegistroHoy[]>();

  const alumnosConEntradaHoy = (registrosHoy ?? [])
    .filter((r) => r.entrada_en)
    .map((r) => r.alumno_id);

  function hrefVista(v: Vista) {
    const params = new URLSearchParams();
    params.set("vista", v);
    return `/asistencia?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
<<<<<<< HEAD
        <h1 className="text-lg font-semibold text-brand-ink">Asistencia</h1>
=======
        <h1 className="text-xl font-bold text-brand-900">Asistencia</h1>
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
        <p className="text-sm text-brand-600">
          {vista === "escaneo"
            ? "Escanea el carnet para registrar la entrada."
            : "Un registro por alumno — marcar salida o permiso actualiza su registro de hoy."}
        </p>
      </div>

      <div className="inline-flex rounded-md border border-brand-300 bg-brand-surface p-1">
        <Link
          href={hrefVista("escaneo")}
          className={
            vista === "escaneo"
              ? "rounded px-4 py-1.5 text-sm font-medium bg-brand-900 text-white"
              : "rounded px-4 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-100"
          }
        >
          Escaneo
        </Link>
        <Link
          href={hrefVista("hoy")}
          className={
            vista === "hoy"
              ? "rounded px-4 py-1.5 text-sm font-medium bg-brand-900 text-white"
              : "rounded px-4 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-100"
          }
        >
          Asistencias de hoy ({registrosHoy?.length ?? 0})
        </Link>
      </div>

      {vista === "escaneo" ? (
        <section className="max-w-xl space-y-4">
          <CodigoForm />

          <details className="rounded-lg border border-brand-200 bg-brand-surface">
            <summary className="cursor-pointer select-none px-4 py-2 text-sm font-medium text-brand-700">
              ¿No tiene el carnet? Buscar manualmente
            </summary>
            <div className="border-t border-brand-100 p-4 pt-3">
              <BuscarAlumnoManual alumnosConEntradaHoy={alumnosConEntradaHoy} />
            </div>
          </details>
        </section>
      ) : (
        <section className="overflow-hidden rounded-lg border border-brand-200 bg-brand-surface">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-left text-[11px] font-semibold uppercase tracking-wider text-brand-700">
              <tr>
                <th className="px-4 py-2">Código</th>
                <th className="px-4 py-2">Alumno</th>
                <th className="px-4 py-2">Hora de entrada</th>
                <th className="px-4 py-2">Hora de salida</th>
                <th className="px-4 py-2">Permiso</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {registrosHoy?.map((r) => {
                const nombreCompleto = `${r.alumnos.nombres} ${r.alumnos.apellidos}`;
                return (
                  <tr key={r.id} className="transition-colors hover:bg-brand-50">
                    <td className="px-4 py-2 font-mono text-xs text-brand-600">
                      {r.alumnos.codigo}
                    </td>
                    <td className="px-4 py-2 text-brand-ink">{nombreCompleto}</td>
                    <td className="px-4 py-2 text-brand-600">{hora(r.entrada_en)}</td>
                    <td className="px-4 py-2 text-brand-600">{hora(r.salida_en)}</td>
                    <td className="px-4 py-2">
                      {r.permiso ? (
                        <span className="rounded-full bg-brand-yellow-100 px-2 py-0.5 text-xs text-brand-yellow-dark">
                          Sí
                        </span>
                      ) : (
                        <span className="text-brand-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-end gap-3">
                        <div className="flex gap-2">
                          <MarcarManualBoton
                            alumnoId={r.alumno_id}
                            nombreCompleto={nombreCompleto}
                            telefonoApoderado={r.alumnos.telefono_apoderado}
                            tieneWhatsapp={r.alumnos.tiene_whatsapp}
                            tipo="salida"
                            marcado={!!r.salida_en}
                            bloqueadoPor={r.permiso ? "Permiso" : undefined}
                          />
                          <MarcarManualBoton
                            alumnoId={r.alumno_id}
                            nombreCompleto={nombreCompleto}
                            telefonoApoderado={r.alumnos.telefono_apoderado}
                            tieneWhatsapp={r.alumnos.tiene_whatsapp}
                            tipo="permiso"
                            marcado={r.permiso}
                            bloqueadoPor={r.salida_en ? "Salida" : undefined}
                          />
                        </div>
                        <EliminarAsistenciaBoton id={r.id} nombreCompleto={nombreCompleto} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {registrosHoy?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-brand-400">
                    Todavía no hay asistencias marcadas hoy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
