"use client";

import type { SystemComponent } from "@/lib/mock-data";
import { CheckCircle2, AlertTriangle, XCircle, Radio } from "lucide-react";

interface SystemStatusProps {
  components: SystemComponent[];
  loading?: boolean;
}

type Level = "ok" | "warn" | "error";

const levelOf = (s: SystemComponent["status"]): Level =>
  s === "warning" ? "warn" : s === "offline" ? "error" : "ok";

const LEVEL = {
  ok:   { icon: CheckCircle2, color: "var(--emerald-600)", bg: "var(--emerald-50)" },
  warn: { icon: AlertTriangle, color: "var(--amber-600)",   bg: "var(--amber-50)"   },
  error:{ icon: XCircle,       color: "var(--red-600)",     bg: "var(--red-50)"     },
};

const STATUS_LABEL: Record<SystemComponent["status"], string> = {
  connected: "Connected",
  online:    "Online",
  normal:    "Normal",
  stable:    "Stable",
  warning:   "Warning",
  offline:   "Offline",
};

export default function SystemStatus({ components, loading = false }: SystemStatusProps) {
  return (
    <div className="card p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Radio size={14} style={{ color: "var(--emerald-500)" }} />
        <p className="card-title">System Status</p>
        {!loading && (
          <span className="ml-auto section-label">
            {components.filter((c) => c.status !== "offline").length}/{components.length} online
          </span>
        )}
      </div>

      <div className="flex-1 space-y-1">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="skeleton h-3.5 w-32 rounded" />
                <div className="skeleton h-5 w-20 rounded-full" />
              </div>
            ))
          : components.map((c, i) => {
              const lvl = levelOf(c.status);
              const st = LEVEL[lvl];
              const Icon = st.icon;
              const isLast = i === components.length - 1;

              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-2.5"
                  style={!isLast ? { borderBottom: "1px solid var(--border)" } : undefined}
                >
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.label}</p>
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: st.bg }}
                  >
                    <Icon size={10} style={{ color: st.color }} />
                    <span style={{ fontSize: 11, fontWeight: 500, color: st.color }}>
                      {STATUS_LABEL[c.status]}
                    </span>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
