import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Currículo com IA — Profissional em 2 Minutos",
  description: "Monte seu currículo profissional com inteligência artificial por apenas R$ 4,90",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
