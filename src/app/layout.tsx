import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MSTR Energy Monitor",
  description:
    "Professional dashboard for monitoring electrical output from Microbial Solar/Soil (MSTR) systems — voltage, current, and energy generation in real time.",
  keywords: ["MSTR", "energy monitor", "microbial solar", "IoT dashboard", "voltage", "current"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
