"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", prefijos: ["/"] },
  { href: "/asistencia", label: "Asistencia", prefijos: ["/asistencia"] },
  { href: "/alumnos", label: "Alumnos", prefijos: ["/alumnos"] },
  { href: "/pagos", label: "Pagos", prefijos: ["/pagos"] },
  { href: "/ciclos", label: "Ciclos", prefijos: ["/ciclos"] },
  {
    href: "/simulacros",
    label: "Notas",
    prefijos: ["/simulacros", "/materias"],
  },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const activo = item.prefijos.some((p) =>
          p === "/" ? pathname === "/" : pathname.startsWith(p)
        );
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              activo
                ? "rounded-md bg-brand-900 px-3 py-1.5 text-sm font-medium text-white"
                : "rounded-md px-3 py-1.5 text-sm text-brand-600 hover:bg-brand-100 hover:text-brand-900"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
