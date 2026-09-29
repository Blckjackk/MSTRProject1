"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  isConnected?: boolean;
  lastSync?: string;
}

export default function DashboardLayout({
  children,
  isConnected = true,
  lastSync,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="page-wrapper flex w-full">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="body-wrapper flex min-w-0 flex-1 flex-col">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          isConnected={isConnected}
          lastSync={lastSync}
        />

          <main className="dashboard-main flex-1 overflow-y-auto px-6 py-8 xl:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
