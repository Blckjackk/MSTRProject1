"use client";

import type { Alert } from "@/lib/mock-data";
import { AlertTriangle, Info, XOctagon, Bell } from "lucide-react";

interface AlertPanelProps {
  alerts: Alert[];
  loading?: boolean;
}

const TYPE = {
  warning:  { icon: AlertTriangle, color: "var(--amber-600)", bg: "var(--amber-50)",  border: "var(--amber-100)" },
  info:     { icon: Info,          color: "var(--blue-600)",  bg: "var(--blue-50)",   border: "var(--blue-100)"  },
  critical: { icon: XOctagon,      color: "var(--red-600)",   bg: "var(--red-50)",    border: "var(--red-100)"   },
};

function timeAgo(m: number): string {
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m ago` : `${h}h ago`;
}

export default function AlertPanel({ alerts, loading = false }: AlertPanelProps) {
  return (
    <div className="card p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Bell size={14} style={{ color: "var(--text-muted)" }} />
        <p className="card-title">Recent Alerts</p>
        {!loading && alerts.length > 0 && (
          <span
            className="ml-auto flex items-center justify-center rounded-full mono"
            style={{
              width: 18, height: 18, fontSize: 10, fontWeight: 700,
              background: "var(--amber-50)", color: "var(--amber-600)",
              border: "1px solid var(--amber-100)",
            }}
          >
            {alerts.length}
          </span>
        )}
      </div>

      <div className="flex-1 space-y-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg p-3" style={{ background: "var(--bg-subtle)" }}>
              <div className="skeleton h-3.5 w-36 rounded mb-2" />
              <div className="skeleton h-3 w-48 rounded mb-1" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
          ))
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Bell size={22} style={{ color: "var(--border-strong)" }} />
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No recent alerts</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const st = TYPE[alert.type];
            const Icon = st.icon;
            return (
              <div
                key={alert.id}
                className="flex gap-2.5 rounded-lg p-3"
                style={{ background: st.bg, border: `1px solid ${st.border}` }}
              >
                <Icon size={13} style={{ color: st.color, flexShrink: 0, marginTop: 1 }} />
                <div className="min-w-0">
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{alert.title}</p>
                  <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 1 }}>{alert.description}</p>
                  <p style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 3 }}>{timeAgo(alert.minutesAgo)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
