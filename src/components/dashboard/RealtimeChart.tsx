"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { Measurement } from "@/lib/mock-data";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Tab = "voltage" | "current" | "power";

interface ChartPoint {
  time: string;
  voltage: number;
  current: number; // mA
  power: number;   // mW
}

interface RealtimeChartProps {
  history: Measurement[];
  loading?: boolean;
}

const TAB_CONFIG: Record<Tab, {
  label: string;
  dataKey: keyof ChartPoint;
  unit: string;
  color: string;
  domain: [number | "auto", number | "auto"];
}> = {
  voltage: { label: "Voltage", dataKey: "voltage", unit: "V",  color: "var(--blue-500)",   domain: [0, 1.6] },
  current: { label: "Current", dataKey: "current", unit: "mA", color: "var(--emerald-500)", domain: [0, 55]  },
  power:   { label: "Power",   dataKey: "power",   unit: "mW", color: "var(--violet-500)", domain: [0, 80]  },
};

function CustomTooltip({ active, payload, label, unit }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  unit: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2" style={{ minWidth: 110, boxShadow: "var(--shadow-md)" }}>
      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</p>
      <p className="mono font-semibold" style={{ fontSize: 13, color: "var(--text-primary)", marginTop: 2 }}>
        {payload[0].value.toFixed(3)}{" "}
        <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)" }}>{unit}</span>
      </p>
    </div>
  );
}

export default function RealtimeChart({ history, loading = false }: RealtimeChartProps) {
  const [activeTab, setActiveTab] = useState<Tab>("voltage");
  const cfg = TAB_CONFIG[activeTab];

  const data: ChartPoint[] = history.map((m) => ({
    time:    formatTime(m.timestamp),
    voltage: m.voltage,
    current: parseFloat((m.current * 1000).toFixed(3)),
    power:   parseFloat((m.power   * 1000).toFixed(3)),
  }));

  if (loading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-4 w-48 rounded mb-5" />
        <div className="skeleton w-full rounded-lg" style={{ height: 240 }} />
      </div>
    );
  }

  const lastReading = data.length > 0 ? data[data.length - 1].time : "—";

  return (
    <div className="card p-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="card-title">Real-Time Output</span>
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
              style={{ background: "var(--emerald-50)", border: "1px solid var(--emerald-100)" }}
            >
              <div className="live-dot" />
              <span style={{ fontSize: 10, fontWeight: 600, color: "var(--emerald-600)", letterSpacing: "0.06em" }}>
                LIVE
              </span>
            </div>
          </div>
          <p className="card-subtitle mt-1">
            Last reading: <span className="mono">{lastReading}</span>
            &nbsp;·&nbsp;2 s interval
          </p>
        </div>

        {/* ── Tabs ── */}
        <div
          className="flex rounded-lg p-0.5 gap-0.5"
          style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
        >
          {(Object.keys(TAB_CONFIG) as Tab[]).map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                className="px-3 py-1 rounded-md text-xs font-medium transition-all"
                style={
                  active
                    ? { background: "var(--bg-surface)", color: TAB_CONFIG[tab].color, boxShadow: "var(--shadow-sm)", fontWeight: 600 }
                    : { color: "var(--text-muted)" }
                }
                onClick={() => setActiveTab(tab)}
              >
                {TAB_CONFIG[tab].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Chart ── */}
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -14 }}>
            <CartesianGrid strokeDasharray="3 4" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={cfg.domain}
              tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
              width={42}
            />
            <Tooltip
              content={<CustomTooltip unit={cfg.unit} />}
              cursor={{ stroke: "var(--border-strong)", strokeWidth: 1, strokeDasharray: "3 3" }}
            />
            <Line
              type="monotone"
              dataKey={cfg.dataKey as string}
              stroke={cfg.color}
              strokeWidth={1.75}
              dot={false}
              activeDot={{ r: 3.5, fill: cfg.color, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Footer label ── */}
      <p className="text-right" style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>
        {cfg.label} ({cfg.unit})
      </p>
    </div>
  );
}
