"use client";

import type { MSTRCell } from "@/lib/mock-data";
import { formatVoltage, formatCurrentMA, formatPowerMW } from "@/lib/utils";

interface MSTRCellCardProps { cell: MSTRCell; }

function RadialGauge({ value, color }: { value: number; color: string }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, value) / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 52, height: 52, flexShrink: 0 }}>
      <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="26" cy="26" r={r} fill="none" stroke="var(--border)" strokeWidth="4.5" />
        <circle
          cx="26" cy="26" r={r} fill="none"
          stroke={color} strokeWidth="4.5"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute mono font-semibold"
        style={{ fontSize: 10, color: "var(--text-primary)" }}
      >
        {Math.round(value)}%
      </span>
    </div>
  );
}

const STATUS = {
  active:  { label: "Active",  badgeCls: "badge-normal",   dot: "var(--emerald-500)", gauge: "var(--emerald-500)" },
  warning: { label: "Warning", badgeCls: "badge-warning",  dot: "var(--amber-500)",   gauge: "var(--amber-500)"   },
  offline: { label: "Offline", badgeCls: "badge-critical", dot: "var(--red-500)",     gauge: "var(--red-400)"     },
};

function MetricRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</span>
      <span className="mono font-medium" style={{ fontSize: 11.5, color }}>{value}</span>
    </div>
  );
}

export default function MSTRCellCard({ cell }: MSTRCellCardProps) {
  const st = STATUS[cell.status];

  return (
    <div className="card card-hover p-4 flex flex-col gap-3.5">
      {/* Top: ID + status */}
      <div className="flex items-center justify-between">
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{cell.label}</p>
        <span
          className={`${st.badgeCls} flex items-center gap-1 px-2 py-0.5 rounded-full`}
          style={{ fontSize: 11, fontWeight: 500 }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
          {st.label}
        </span>
      </div>

      {/* Gauge + metrics */}
      <div className="flex items-center gap-3.5">
        <RadialGauge value={cell.efficiency} color={st.gauge} />
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <MetricRow label="Voltage" value={`${formatVoltage(cell.voltage)} V`}  color="var(--blue-600)"   />
          <MetricRow label="Current" value={`${formatCurrentMA(cell.current)} mA`} color="var(--emerald-600)" />
          <MetricRow label="Power"   value={`${formatPowerMW(cell.power)} mW`}   color="var(--violet-600)" />
        </div>
      </div>

      {/* Efficiency bar */}
      <div>
        <div
          className="rounded-full overflow-hidden"
          style={{ height: 3, background: "var(--bg-subtle)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${cell.efficiency}%`, background: st.gauge }}
          />
        </div>
      </div>
    </div>
  );
}
