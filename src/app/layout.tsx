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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300..700;1,14..32,300..700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
