import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MegaPhotoTool by RoeschStudio - Herramienta Gratuita de Mejora de Fotos",
  description: "Herramienta gratuita de mejora de fotos de producto para Megazone y Megafood. Creada por Christopher Roesch. Elimina fondos, mejora iluminación y redimensiona imágenes - 100% gratis.",
  keywords: ["MegaPhotoTool", "RoeschStudio", "Megazone", "Megafood", "Christopher Roesch", "mejora de fotos", "eliminación de fondo", "producto"],
  authors: [{ name: "Christopher Roesch - RoeschStudio" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "MegaPhotoTool by RoeschStudio",
    description: "Herramienta gratuita de mejora de fotos para Megazone y Megafood",
    url: "https://megaphototool.com",
    siteName: "MegaPhotoTool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MegaPhotoTool by RoeschStudio",
    description: "Herramienta gratuita de mejora de fotos para Megazone y Megafood",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
