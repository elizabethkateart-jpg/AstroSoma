import type { Metadata } from "next";
import { Cormorant_Garamond, Karla } from "next/font/google";
import "./globals.css";

// Serif ornamentada tipo "carta astral" — referencia visual del usuario (2026-09-06):
// wheel de zodiaco sol/luna, tipografía elegante de alto contraste. Reemplaza a Fraunces
// manteniendo el mismo rol (--font-fraunces) para no tocar todo el kit de landing.
const cormorant = Cormorant_Garamond({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "AstroSoma — Tu carta natal, traducida a tu cuerpo",
  description:
    "El Escaneo Somático te muestra dónde acumulas el dolor de tu duelo o estrés diario, y te da el ejercicio de 3 minutos para soltarlo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${karla.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
