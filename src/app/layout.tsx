import type { Metadata } from "next";
import { AppShell } from "@/shared/ui/app-shell";
import { ThemeScript } from "@/shared/theme/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vault History",
  description: "Historias para descubrir, crear y conservar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body><AppShell>{children}</AppShell></body>
    </html>
  );
}
