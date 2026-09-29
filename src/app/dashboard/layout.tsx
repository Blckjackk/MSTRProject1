"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { LiveDataProvider, useLiveData } from "@/hooks/useLiveData";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiveDataProvider>
      <DashboardShell>{children}</DashboardShell>
    </LiveDataProvider>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { latest, isConnected } = useLiveData();

  return (
    <DashboardLayout isConnected={isConnected} lastSync={latest?.timestamp}>
      {children}
    </DashboardLayout>
  );
}
