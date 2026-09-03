"use client";

import { useSyncExternalStore } from "react";

type Preferencia = "system" | "light" | "dark";

const SIGUIENTE: Record<Preferencia, Preferencia> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const ETIQUETA: Record<Preferencia, string> = {
  system: "Tema: automático (según el sistema)",
  light: "Tema: claro",
  dark: "Tema: oscuro",
};

function SolIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5M18.4 18.4l-1.5-1.5M7.1 7.1 5.6 5.6" />
    </svg>
  );
}

function LunaIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

function AutoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3.5" y="4.5" width="17" height="12" rx="1.6" />
      <path d="M8.5 20h7M12 16.5V20" />
    </svg>
  );
}

const ICONO: Record<Preferencia, (p: { className?: string }) => React.JSX.Element> = {
  system: AutoIcon,
  light: SolIcon,
  dark: LunaIcon,
};

const CAMBIO_TEMA_EVENTO = "sigma-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CAMBIO_TEMA_EVENTO, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CAMBIO_TEMA_EVENTO, callback);
  };
}

function getSnapshot(): Preferencia {
  const guardado = localStorage.getItem("sigma-theme");
  return guardado === "light" || guardado === "dark" ? guardado : "system";
}

function getServerSnapshot(): Preferencia {
  return "system";
}

export function ThemeToggle() {
  const actual = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function aplicar(siguiente: Preferencia) {
    if (siguiente === "system") {
      localStorage.removeItem("sigma-theme");
      document.documentElement.removeAttribute("data-theme");
    } else {
      localStorage.setItem("sigma-theme", siguiente);
      document.documentElement.setAttribute("data-theme", siguiente);
    }
    window.dispatchEvent(new Event(CAMBIO_TEMA_EVENTO));
  }

  const Icono = ICONO[actual];

  return (
    <button
      type="button"
      onClick={() => aplicar(SIGUIENTE[actual])}
      title={ETIQUETA[actual]}
      aria-label={ETIQUETA[actual]}
      className="rounded-md p-1.5 text-brand-600 hover:bg-brand-100 hover:text-brand-ink"
    >
      <Icono className="h-5 w-5" />
    </button>
  );
}
