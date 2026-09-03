import Image from "next/image";
import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { NavLinks } from "./nav-links";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white print:hidden">
        <div className="franja-marca h-1" />
        <div className="border-b border-brand-200">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <nav className="flex items-center gap-1">
              <Link href="/" className="mr-4 flex items-center gap-2">
                <Image src="/logo.png" alt="SIGMA" width={32} height={32} />
                <span className="font-display text-base font-bold tracking-tight text-brand-900">
                  SIGMA
                </span>
              </Link>
              <NavLinks />
            </nav>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-brand-600 hover:text-brand-900"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
