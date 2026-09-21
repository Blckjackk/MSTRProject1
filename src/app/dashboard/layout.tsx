"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMockRealtime } from "@/hooks/useMockRealtime";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { latest, isConnected } = useMockRealtime();

  return (
    <DashboardLayout
      isConnected={isConnected}
      lastSync={latest?.timestamp}
    >
      {children}
    </DashboardLayout>
  );
}
