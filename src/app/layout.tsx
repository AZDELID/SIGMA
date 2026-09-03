<<<<<<< HEAD
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
=======
import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
import "./globals.css";
import { ThemeInitScript } from "./theme-script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Tipografía de títulos: geométrica y técnica, en línea con el engranaje +
// Σ del logo — le da carácter propio en vez de que todo se vea con la
// misma tipografía neutra de cuerpo de texto.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Academia Pre-Universitaria SiGMA",
  description: "Sistema de gestión de la Academia Pre-Universitaria SiGMA",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SIGMA",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#3e4093",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
<<<<<<< HEAD
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
=======
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} h-full antialiased`}
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
    >
      <body className="min-h-full flex flex-col bg-brand-50 text-brand-ink">
        <ThemeInitScript />
        {children}
      </body>
    </html>
  );
}
