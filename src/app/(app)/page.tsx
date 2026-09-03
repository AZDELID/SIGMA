import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { MatriculaResumen } from "@/lib/types/database";

export default async function InicioPage() {
  const supabase = await createClient();

  const inicioDia = new Date();
  inicioDia.setHours(0, 0, 0, 0);

  const [
    { count: totalAlumnos },
    { count: asistenciasHoy },
    { data: matriculasConSaldo },
  ] = await Promise.all([
    supabase
      .from("alumnos")
      .select("id", { count: "exact", head: true })
      .eq("activo", true),
    supabase
      .from("asistencias")
      .select("id", { count: "exact", head: true })
      .gte("marcado_en", inicioDia.toISOString()),
    supabase
      .from("matriculas_resumen")
      .select("*")
      .gt("saldo_pendiente", 0)
      .returns<MatriculaResumen[]>(),
  ]);

  const deudaTotal = (matriculasConSaldo ?? []).reduce(
    (acc, m) => acc + m.saldo_pendiente,
    0
  );

  const tarjetas = [
    { label: "Alumnos activos", valor: totalAlumnos ?? 0, href: "/alumnos" },
    { label: "Asistencias hoy", valor: asistenciasHoy ?? 0, href: "/asistencia" },
    {
      label: "Alumnos con saldo pendiente",
      valor: matriculasConSaldo?.length ?? 0,
      href: "/pagos",
    },
    {
      label: "Deuda total pendiente",
      valor: `S/ ${deudaTotal.toFixed(2)}`,
      href: "/pagos",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-blue-900">Inicio</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {tarjetas.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="rounded-lg border border-sky-200 bg-white p-4 hover:border-blue-300"
          >
            <p className="text-xs text-blue-600">{t.label}</p>
            <p className="mt-1 text-2xl font-semibold text-blue-900">
              {t.valor}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
