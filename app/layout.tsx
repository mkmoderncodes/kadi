import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kadi — Websites for Ghanaian businesses",
  description: "Create a professional online business page in minutes, no developer needed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
