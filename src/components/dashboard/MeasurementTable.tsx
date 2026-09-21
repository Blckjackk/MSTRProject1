"use client";

import type { Measurement } from "@/lib/mock-data";
import {
  formatVoltage, formatCurrentMA, formatPowerMW, formatEnergyWh, formatTime,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MeasurementTableProps {
  data: Measurement[];
  loading?: boolean;
}

function StatusBadge({ status }: { status: Measurement["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
        status === "normal"   && "badge-normal",
        status === "warning"  && "badge-warning",
        status === "critical" && "badge-critical"
      )}
      style={{ fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{
          background:
            status === "normal"   ? "var(--emerald-500)"
            : status === "warning" ? "var(--amber-500)"
            : "var(--red-500)",
        }}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const COL_HEADERS = ["Time", "Voltage", "Current", "Power", "Energy", "Status"] as const;
const SKELETON_ROWS = 6;

export default function MeasurementTable({ data, loading = false }: MeasurementTableProps) {
  const rows = [...data].reverse().slice(0, 10);

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <p className="card-title">Latest Measurements</p>
          <p className="card-subtitle">Most recent 10 readings from the MSTR array</p>
        </div>
        <span className="section-label">
          {rows.length} entries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)" }}>
              {COL_HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left section-label"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    {[72, 52, 56, 56, 60, 56].map((w, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="skeleton h-3.5 rounded" style={{ width: w }} />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.length === 0
              ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center" style={{ color: "var(--text-muted)", fontSize: 13 }}>
                    No measurements yet
                  </td>
                </tr>
              )
              : rows.map((m, i) => (
                  <tr
                    key={m.timestamp + i}
                    style={{ borderBottom: "1px solid var(--border)" }}
                    className="transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-subtle)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                  >
                    <td className="px-4 py-3 mono" style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {formatTime(m.timestamp)}
                    </td>
                    <td className="px-4 py-3 mono font-medium" style={{ fontSize: 12, color: "var(--blue-600)", whiteSpace: "nowrap" }}>
                      {formatVoltage(m.voltage)} V
                    </td>
                    <td className="px-4 py-3 mono font-medium" style={{ fontSize: 12, color: "var(--emerald-600)", whiteSpace: "nowrap" }}>
                      {formatCurrentMA(m.current)} mA
                    </td>
                    <td className="px-4 py-3 mono font-medium" style={{ fontSize: 12, color: "var(--violet-600)", whiteSpace: "nowrap" }}>
                      {formatPowerMW(m.power)} mW
                    </td>
                    <td className="px-4 py-3 mono" style={{ fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                      {formatEnergyWh(m.energy)} Wh
                    </td>
                    <td className="px-4 py-3" style={{ whiteSpace: "nowrap" }}>
                      <StatusBadge status={m.status} />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
