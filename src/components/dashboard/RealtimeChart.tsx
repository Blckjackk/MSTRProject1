"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { Measurement } from "@/lib/data-models";

interface RealtimeChartProps {
  history: Measurement[];
  loading?: boolean;
}

function formatElapsed(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return hours > 0
    ? `${hours}j ${String(minutes).padStart(2, "0")}m`
    : `${minutes}m ${String(remainder).padStart(2, "0")}s`;
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-center" style={{ color: "var(--text-muted)", fontSize: 13 }}>
      Belum ada pembacaan untuk sesi aktif.
    </div>
  );
}

export default function RealtimeChart({ history, loading = false }: RealtimeChartProps) {
  const data = history.map((measurement) => ({
    elapsed: measurement.elapsedSeconds ?? 0,
    voltage: measurement.voltage,
    current: measurement.current * 1000,
    power: measurement.power * 1000,
  }));

  return (
    <div className="card p-6 sm:p-7">
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-2">
          <span className="card-title">Real-Time Output</span>
          <span className="section-label" style={{ color: "var(--text-muted)" }}>V / I / P</span>
        </div>
        <p className="card-subtitle">Waktu berjalan sesi, bukan waktu jam dinding</p>
      </div>

      <div style={{ height: 260 }}>
        {loading ? (
          <div className="skeleton w-full rounded-lg" style={{ height: "100%" }} />
        ) : data.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 4" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="elapsed"
                tickFormatter={formatElapsed}
                tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                tickLine={false}
                axisLine={false}
                label={{ value: "Elapsed time", position: "insideBottom", offset: -2, fontSize: 10, fill: "var(--text-muted)" }}
              />
              <YAxis
                yAxisId="voltage"
                orientation="left"
                domain={[0, "auto"]}
                tick={{ fontSize: 10, fill: "var(--blue-600)", fontFamily: "JetBrains Mono" }}
                tickLine={false}
                axisLine={false}
                width={38}
              />
              <YAxis
                yAxisId="current-power"
                orientation="right"
                domain={[0, "auto"]}
                tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                tickLine={false}
                axisLine={false}
                width={42}
              />
              <Tooltip
                labelFormatter={(value) => formatElapsed(Number(value))}
                formatter={(value, name) => [Number(value).toFixed(2), name === "voltage" ? "V" : name === "current" ? "mA" : "mW"]}
                contentStyle={{ border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg-surface)" }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Line yAxisId="voltage" type="monotone" dataKey="voltage" name="Tegangan (V)" stroke="var(--blue-500)" strokeWidth={1.8} dot={false} isAnimationActive={false} />
              <Line yAxisId="current-power" type="monotone" dataKey="current" name="Arus (mA)" stroke="var(--emerald-500)" strokeWidth={1.8} dot={false} isAnimationActive={false} />
              <Line yAxisId="current-power" type="monotone" dataKey="power" name="Daya (mW)" stroke="var(--violet-500)" strokeWidth={1.8} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}