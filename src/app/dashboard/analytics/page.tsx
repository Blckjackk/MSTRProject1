"use client";

import { useMockRealtime } from "@/hooks/useMockRealtime";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AnalyticsPage() {
  const { history } = useMockRealtime();

  const scatterData = history.map((m) => ({
    voltage: parseFloat(m.voltage.toFixed(3)),
    power: parseFloat((m.power * 1000).toFixed(3)),
  }));

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div>
        <h1 className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>
          Analytics
        </h1>
        <p className="mt-1" style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Advanced data analysis and correlations for the MSTR system.
        </p>
      </div>

      {/* Voltage vs Power scatter */}
      <div className="card p-5">
        <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
          Voltage vs. Power Correlation
        </p>
        <p className="mb-5" style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Each point represents one measurement interval
        </p>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 4, right: 8, bottom: 4, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="voltage"
                name="Voltage"
                unit=" V"
                tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                tickLine={false}
                axisLine={false}
                label={{ value: "Voltage (V)", position: "insideBottom", offset: -4, fontSize: 10, fill: "var(--text-muted)" }}
              />
              <YAxis
                dataKey="power"
                name="Power"
                unit=" mW"
                tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "JetBrains Mono" }}
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3", stroke: "var(--border-strong)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="card px-3 py-2 shadow-lg">
                      <p className="mono text-xs" style={{ color: "var(--text-primary)" }}>
                        {payload[0]?.value} V &nbsp;/&nbsp; {payload[1]?.value} mW
                      </p>
                    </div>
                  );
                }}
              />
              <Scatter
                data={scatterData}
                fill="var(--blue-500)"
                fillOpacity={0.5}
                r={3}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Placeholder */}
      <div className="card p-8 text-center">
        <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
          More analytics modules coming soon
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          FFT analysis, efficiency curves, and predictive modeling.
        </p>
      </div>
    </div>
  );
}
