import Image from "next/image";
import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { BottomNav } from "./bottom-nav";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-brand-surface pt-[env(safe-area-inset-top)] print:hidden">
        <div className="franja-marca h-1" />
        <div className="border-b border-brand-200">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <nav className="flex items-center gap-1">
              <Link href="/" className="mr-4 flex items-center gap-2">
                <Image src="/logo.png" alt="SIGMA" width={32} height={32} />
                <span className="text-sm font-semibold text-brand-ink">
                  SIGMA
                </span>
              </Link>
              <div className="hidden items-center gap-1 sm:flex">
                <NavLinks />
              </div>
            </nav>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm text-brand-600 hover:text-brand-ink"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-24 sm:pb-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
