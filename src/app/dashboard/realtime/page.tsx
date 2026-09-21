"use client";

import { useMockRealtime } from "@/hooks/useMockRealtime";
import RealtimeChart from "@/components/dashboard/RealtimeChart";
import MeasurementTable from "@/components/dashboard/MeasurementTable";
import MetricCard from "@/components/dashboard/MetricCard";
import { formatVoltage, formatCurrentMA, formatPowerMW } from "@/lib/utils";
import { Zap, Activity, BatteryCharging } from "lucide-react";

export default function RealtimePage() {
  const { latest, history, isConnected } = useMockRealtime();
  const loading = !latest;

  const voltage  = latest?.voltage  ?? 0;
  const currentA = latest?.current  ?? 0;
  const powerW   = latest?.power    ?? 0;

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>
            Real-Time Monitoring
          </h1>
          <p className="mt-1" style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Live electrical measurements from the MSTR array.
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            background: isConnected ? "var(--emerald-50)" : "var(--red-50)",
            border: `1px solid ${isConnected ? "var(--emerald-100)" : "var(--red-100)"}`,
          }}
        >
          <div className="live-dot" style={{ background: isConnected ? "var(--emerald-500)" : "var(--red-500)" }} />
          <span className="text-xs font-medium" style={{ color: isConnected ? "var(--emerald-700)" : "var(--red-600)" }}>
            {isConnected ? "Streaming" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Live metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Voltage"
          value={loading ? "—" : formatVoltage(voltage)}
          unit="V"
          icon={<Zap size={15} strokeWidth={2.5} />}
          accentColor="blue"
          loading={loading}
        />
        <MetricCard
          label="Current"
          value={loading ? "—" : formatCurrentMA(currentA)}
          unit="mA"
          icon={<Activity size={15} strokeWidth={2.5} />}
          accentColor="emerald"
          loading={loading}
        />
        <MetricCard
          label="Power"
          value={loading ? "—" : formatPowerMW(powerW)}
          unit="mW"
          icon={<BatteryCharging size={15} strokeWidth={2.5} />}
          accentColor="violet"
          loading={loading}
        />
      </div>

      {/* Full-width chart */}
      <RealtimeChart history={history} loading={loading} />

      {/* Full measurement table */}
      <MeasurementTable data={history} loading={loading} />
    </div>
  );
}
