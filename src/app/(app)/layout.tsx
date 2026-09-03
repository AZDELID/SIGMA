import Image from "next/image";
import Link from "next/link";
import { logout } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/asistencia", label: "Asistencia" },
  { href: "/alumnos", label: "Alumnos" },
  { href: "/pagos", label: "Pagos" },
  { href: "/ciclos", label: "Ciclos" },
];

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-sky-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-1">
            <Link href="/" className="mr-4 flex items-center gap-2">
              <Image src="/logo.png" alt="SIGMA" width={32} height={32} />
              <span className="text-sm font-semibold text-blue-900">
                SIGMA
              </span>
            </Link>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm text-blue-600 hover:bg-sky-100 hover:text-blue-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-blue-600 hover:text-blue-900"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
