"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { esRutaActiva, NAV_ITEMS } from "./nav-links";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 border-t border-brand-200 bg-brand-surface pb-[env(safe-area-inset-bottom)] sm:hidden print:hidden"
      aria-label="Navegación principal"
    >
      <div className="grid grid-cols-6">
        {NAV_ITEMS.map((item) => {
          const activo = esRutaActiva(pathname, item.prefijos);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] leading-tight ${
                activo ? "text-brand-ink" : "text-brand-500"
              }`}
              aria-current={activo ? "page" : undefined}
            >
              <item.Icon className={`h-5 w-5 ${activo ? "text-brand-ink" : "text-brand-500"}`} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
