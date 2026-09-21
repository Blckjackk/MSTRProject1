"use client";

import { useState, useEffect } from "react";
import { Bell, Menu, Wifi, WifiOff } from "lucide-react";

interface TopbarProps {
  onMenuClick?: () => void;
  isConnected?: boolean;
  lastSync?: string;
}

export default function Topbar({ onMenuClick, isConnected = true, lastSync }: TopbarProps) {
  const [syncTime, setSyncTime] = useState("—");

  useEffect(() => {
    const fmt = (iso: string) =>
      new Date(iso).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

    setSyncTime(lastSync ? fmt(lastSync) : fmt(new Date().toISOString()));
  }, [lastSync]);

  return (
    <header
      className="flex items-center justify-between px-5 sticky top-0 z-20"
      style={{
        height: "var(--topbar-h)",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-1.5 rounded-md"
          style={{ color: "var(--text-muted)" }}
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        {/* Page breadcrumb hint — only visible on mobile where sidebar is hidden */}
        <span
          className="lg:hidden font-semibold text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          MSTR
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Last sync */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Last sync</span>
          <span
            className="mono"
            style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)" }}
          >
            {syncTime}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-4" style={{ background: "var(--border)" }} />

        {/* Connection status */}
        <div className="flex items-center gap-1.5">
          {isConnected ? (
            <Wifi size={13} style={{ color: "var(--emerald-500)" }} />
          ) : (
            <WifiOff size={13} style={{ color: "var(--red-500)" }} />
          )}
          <span
            className="text-xs font-medium hidden sm:inline"
            style={{ color: isConnected ? "var(--emerald-600)" : "var(--red-600)" }}
          >
            {isConnected ? "Online" : "Offline"}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-4" style={{ background: "var(--border)" }} />

        {/* Notification bell */}
        <button
          className="relative p-1.5 rounded-md"
          style={{ color: "var(--text-muted)" }}
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--amber-500)" }}
          />
        </button>

        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full text-xs font-bold select-none"
          style={{
            width: 30,
            height: 30,
            background: "var(--emerald-600)",
            color: "#fff",
            flexShrink: 0,
            letterSpacing: "0.05em",
          }}
        >
          ME
        </div>
      </div>
    </header>
  );
}
