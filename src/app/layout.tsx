import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Currículo Pro — Currículo Profissional em 2 Minutos por R$ 5,00",
  description: "Monte seu currículo profissional validado por especialistas em RH. Método testado, resultado imediato. Por apenas R$ 5,00 via Pix.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://curriculoprofissional.vercel.app"),
  openGraph: {
    title: "Currículo Pro — Profissional em 2 Minutos por R$ 5,00",
    description: "Monte seu currículo profissional validado por especialistas em RH. Método testado, resultado imediato. Por apenas R$ 5,00 via Pix.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://curriculoprofissional.vercel.app",
    siteName: "Currículo Pro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Currículo Pro — Currículo Profissional em 2 Minutos",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Currículo Pro — Profissional em 2 Minutos por R$ 5,00",
    description: "Monte seu currículo profissional validado por especialistas em RH.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,600;0,700;0,800;0,900;1,900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
