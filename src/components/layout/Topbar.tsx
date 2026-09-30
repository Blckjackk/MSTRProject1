"use client";

import { useState, useEffect } from "react";
import { Bell, Menu, Wifi, WifiOff, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

interface TopbarProps {
  onMenuClick?: () => void;
  isConnected?: boolean;
  lastSync?: string;
}

const PAGE_LABELS: Record<string, string> = {
  "/dashboard":            "Overview",
  "/dashboard/realtime":   "Real-Time Monitor",
  "/dashboard/history":    "Energy History",
  "/dashboard/cells":      "MSTR Cells",
  "/dashboard/analytics":  "Analytics",
  "/dashboard/status":     "System Status",
  "/dashboard/settings":   "Settings",
};

export default function Topbar({ onMenuClick, isConnected = true, lastSync }: TopbarProps) {
  const [syncTime, setSyncTime] = useState("—");
  const pathname = usePathname();
  const pageLabel = PAGE_LABELS[pathname] ?? "Dashboard";

  useEffect(() => {
    const fmt = (iso: string) =>
      new Date(iso).toLocaleTimeString("en-GB", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      });
    setSyncTime(lastSync ? fmt(lastSync) : fmt(new Date().toISOString()));
  }, [lastSync]);

  return (
    <header
      className="topbar-glass flex items-center justify-between px-5 sticky top-0 z-20"
      style={{
        height: "var(--topbar-h)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-2.5">
        <button
          className="icon-btn lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={17} />
        </button>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-1.5" style={{ color: "var(--text-muted)", fontSize: 12 }}>
          <span style={{ fontWeight: 500, color: "var(--text-muted)" }}>MSTR</span>
          <ChevronRight size={12} strokeWidth={2} />
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{pageLabel}</span>
        </div>
        <span className="sm:hidden font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
          MSTR
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Last sync */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "var(--bg-subtle)" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Sync</span>
          <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>
            {syncTime}
          </span>
        </div>

        {/* Connection status pill */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: isConnected ? "var(--emerald-50)" : "var(--red-50)",
            border: `1px solid ${isConnected ? "var(--emerald-100)" : "var(--red-100)"}`,
          }}
        >
          {isConnected ? (
            <Wifi size={12} style={{ color: "var(--emerald-600)" }} />
          ) : (
            <WifiOff size={12} style={{ color: "var(--red-600)" }} />
          )}
          <span
            className="hidden sm:inline text-xs font-semibold"
            style={{ color: isConnected ? "var(--emerald-700)" : "var(--red-600)" }}
          >
            {isConnected ? "Live" : "Offline"}
          </span>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={16} />
          </button>
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--amber-500)", boxShadow: "0 0 0 1.5px white" }}
          />
        </div>

        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full text-xs font-bold select-none"
          style={{
            width: 30, height: 30,
            background: "linear-gradient(135deg, var(--emerald-500), var(--emerald-700))",
            color: "#fff",
            flexShrink: 0,
            letterSpacing: "0.05em",
            boxShadow: "0 2px 6px rgba(5,150,105,0.35)",
          }}
        >
          ME
        </div>
      </div>
    </header>
  );
}
