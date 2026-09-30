"use client";

import type { Alert } from "@/lib/mock-data";
import { AlertTriangle, Info, XOctagon, Bell } from "lucide-react";

interface AlertPanelProps {
  alerts: Alert[];
  loading?: boolean;
}

const TYPE = {
  warning:  {
    icon: AlertTriangle,
    color: "var(--amber-600)",
    bg: "var(--amber-50)",
    border: "var(--amber-100)",
    iconBg: "rgba(245,158,11,0.08)",
  },
  info: {
    icon: Info,
    color: "var(--blue-600)",
    bg: "var(--blue-50)",
    border: "var(--blue-100)",
    iconBg: "rgba(59,130,246,0.08)",
  },
  critical: {
    icon: XOctagon,
    color: "var(--red-600)",
    bg: "var(--red-50)",
    border: "var(--red-100)",
    iconBg: "rgba(239,68,68,0.08)",
  },
};

function timeAgo(m: number): string {
  if (m < 60) return `${m}m ago`;
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
              width: 20, height: 20, fontSize: 10, fontWeight: 700,
              background: "var(--amber-50)",
              color: "var(--amber-600)",
              border: "1px solid var(--amber-100)",
            }}
          >
            {alerts.length}
          </span>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: "var(--bg-subtle)" }}>
              <div className="skeleton h-3.5 w-36 rounded mb-2" />
              <div className="skeleton h-3 w-48 rounded mb-1" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
          ))
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{ width: 44, height: 44, background: "var(--bg-subtle)" }}
            >
              <Bell size={18} style={{ color: "var(--border-strong)" }} />
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>No recent alerts</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const st = TYPE[alert.type];
            const Icon = st.icon;
            return (
              <div
                key={alert.id}
                className="flex gap-3 rounded-xl p-3"
                style={{ background: st.bg, border: `1px solid ${st.border}` }}
              >
                <div
                  className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ width: 28, height: 28, background: st.iconBg, marginTop: 1 }}
                >
                  <Icon size={13} style={{ color: st.color }} />
                </div>
                <div className="min-w-0">
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    {alert.title}
                  </p>
                  <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2, lineHeight: 1.5 }}>
                    {alert.description}
                  </p>
                  <p style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 4, fontWeight: 500 }}>
                    {timeAgo(alert.minutesAgo)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
