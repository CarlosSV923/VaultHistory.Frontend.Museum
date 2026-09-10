import type { Metadata } from "next";
import { AppShell } from "@/shared/ui/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vault History",
  description: "Historias para descubrir, crear y conservar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body><AppShell>{children}</AppShell></body>
    </html>
  );
}
