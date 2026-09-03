"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlumnosIcon,
  AsistenciaIcon,
  CiclosIcon,
  InicioIcon,
  NotasIcon,
  PagosIcon,
} from "./nav-icons";

export const NAV_ITEMS = [
  { href: "/", label: "Inicio", prefijos: ["/"], Icon: InicioIcon },
  {
    href: "/asistencia",
    label: "Asistencia",
    prefijos: ["/asistencia"],
    Icon: AsistenciaIcon,
  },
  {
    href: "/alumnos",
    label: "Alumnos",
    prefijos: ["/alumnos"],
    Icon: AlumnosIcon,
  },
  { href: "/pagos", label: "Pagos", prefijos: ["/pagos"], Icon: PagosIcon },
  {
    href: "/ciclos",
    label: "Ciclos",
    prefijos: ["/ciclos"],
    Icon: CiclosIcon,
  },
  {
    href: "/simulacros",
    label: "Notas",
    prefijos: ["/simulacros", "/materias"],
    Icon: NotasIcon,
  },
] as const;

export function esRutaActiva(pathname: string, prefijos: readonly string[]) {
  return prefijos.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)));
}

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const activo = esRutaActiva(pathname, item.prefijos);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              activo
                ? "rounded-md bg-brand-900 px-3 py-1.5 text-sm font-medium text-white"
                : "rounded-md px-3 py-1.5 text-sm text-brand-600 hover:bg-brand-100 hover:text-brand-ink"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
