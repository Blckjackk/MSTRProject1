"use client";

import { useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { generateDailyEnergy } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Range = "today" | "7d" | "30d";

const RANGES: { key: Range; label: string; days: number }[] = [
  { key: "today", label: "Today",   days: 24 },
  { key: "7d",    label: "7 Days",  days: 7  },
  { key: "30d",   label: "30 Days", days: 30 },
];

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="section-label mb-0.5">{label}</p>
      <p className="mono font-semibold" style={{ fontSize: 14, color: "var(--text-primary)" }}>{value}</p>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2" style={{ minWidth: 130, boxShadow: "var(--shadow-md)" }}>
      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</p>
      <p className="mono font-semibold" style={{ fontSize: 13, color: "var(--text-primary)", marginTop: 2 }}>
        {payload[0].value.toFixed(3)}{" "}
        <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)" }}>Wh</span>
      </p>
    </div>
  );
}

export default function EnergyProductionChart() {
  const [range, setRange] = useState<Range>("7d");
  const days = RANGES.find((r) => r.key === range)!.days;
  const raw  = generateDailyEnergy(days);

  const chartData = range === "today"
    ? raw.map((d, i) => ({ ...d, date: `${String(i).padStart(2, "0")}:00` }))
    : raw;

  const totalEnergy = raw.reduce((s, d) => s + d.energy, 0);
  const avgPower    = raw.reduce((s, d) => s + d.avgPower, 0) / raw.length;
  const peakPower   = Math.max(...raw.map((d) => d.peakPower));

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <p className="card-title">Energy Production</p>
          <p className="card-subtitle">Accumulated electrical output over time</p>
        </div>

        {/* Range tabs */}
        <div
          className="flex rounded-lg p-0.5 gap-0.5"
          style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
        >
          {RANGES.map(({ key, label }) => (
            <button
              key={key}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all"
              style={
                range === key
                  ? { background: "var(--bg-surface)", color: "var(--text-primary)", boxShadow: "var(--shadow-sm)", fontWeight: 600 }
                  : { color: "var(--text-muted)" }
              }
              onClick={() => setRange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-3 gap-4 mb-5 pb-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <StatItem label="Total Energy" value={`${totalEnergy.toFixed(3)} Wh`} />
        <StatItem label="Avg Power"    value={`${avgPower.toFixed(2)} mW`}    />
        <StatItem label="Peak Power"   value={`${peakPower.toFixed(2)} mW`}   />
      </div>

      {/* Chart */}
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -14 }}>
            <defs>
              <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--emerald-500)" stopOpacity={0.12} />
                <stop offset="95%" stopColor="var(--emerald-500)" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 4" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
              tickLine={false} axisLine={false} interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
              tickLine={false} axisLine={false} width={42}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border-strong)", strokeWidth: 1, strokeDasharray: "3 3" }} />
            <Area
              type="monotone" dataKey="energy" name="energy"
              stroke="var(--emerald-500)" strokeWidth={1.75}
              fill="url(#eg)" dot={false}
              activeDot={{ r: 3.5, fill: "var(--emerald-500)", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-right" style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>
        Energy (Wh)
      </p>
    </div>
  );
}
