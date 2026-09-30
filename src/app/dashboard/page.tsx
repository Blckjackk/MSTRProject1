"use client";

import Link from "next/link";
import { Activity, ArrowUpRight, BatteryCharging, Clock3, Gauge, Zap } from "lucide-react";
import { useLiveData } from "@/hooks/useLiveData";
import RealtimeChart from "@/components/dashboard/RealtimeChart";
import MeasurementTable from "@/components/dashboard/MeasurementTable";
import MetricCard from "@/components/dashboard/MetricCard";
import { formatCurrentMA, formatPowerMW, formatVoltage } from "@/lib/utils";

function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((value) => String(value).padStart(2, "0")).join(":");
}

function StatusBadge({ online, stale }: { online: boolean; stale: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium" style={{
        background: online ? "var(--emerald-50)" : "var(--red-50)",
        color: online ? "var(--emerald-700)" : "var(--red-600)",
        borderColor: online ? "var(--emerald-100)" : "var(--red-100)",
      }}>
        <span className="live-dot" style={{ background: online ? "var(--emerald-500)" : "var(--red-500)" }} />
        {online ? "Online" : "Offline"}
      </span>
      {stale && <span className="rounded-full border px-3 py-1.5 text-xs font-medium" style={{ background: "var(--amber-50)", color: "var(--amber-600)", borderColor: "var(--amber-100)" }}>Data lama</span>}
    </div>
  );
}

function SessionPanel({ session }: { session: NonNullable<ReturnType<typeof useLiveData>["session"]> | null }) {
  if (!session) {
    return (
      <div className="empty-panel rounded-xl border p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--emerald-50)", color: "var(--emerald-600)" }}><Activity size={19} /></div>
            <div><p className="card-title">Belum ada sesi aktif</p><p className="card-subtitle mt-1 max-w-xl">Dashboard siap digunakan. Mulai sesi pengukuran untuk mengisi kartu metrik dan grafik.</p></div>
          </div>
          <Link href="/dashboard/sessions" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--emerald-600)" }}>Kontrol sesi <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    );
  }

  const items = [["Substrat", session.substrate_name], ["Replikasi", String(session.replicate)], ["pH", session.ph === null ? "-" : session.ph.toFixed(2)], ["Suhu", session.temperature_c === null ? "-" : `${session.temperature_c.toFixed(1)} °C`], ["Resistor beban", session.load_resistor_ohm === null ? "-" : `${session.load_resistor_ohm} Ω`]];
  return <div className="card p-6 sm:p-7"><div className="mb-5 flex items-center gap-2"><span className="eyebrow"><Gauge size={13} /> Sesi aktif</span><span className="ml-auto rounded-full px-2.5 py-1 text-xs font-medium badge-normal">Mengukur</span></div><div className="grid grid-cols-2 gap-5 md:grid-cols-5">{items.map(([label, value]) => <div key={label}><p className="section-label mb-1.5">{label}</p><p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{value}</p></div>)}</div></div>;
}

export default function OverviewPage() {
  const { latest, history, energyWh, session, isConnected, dataStale, dataLastAt, loading, error } = useLiveData();
  const hasReading = Boolean(latest);
  const metricLoading = loading;

  return (
    <div className="dashboard-shell space-y-8 sm:space-y-9">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="page-title mt-2 text-2xl">Live Monitoring</h1><p className="page-subtitle">Pantau keluaran listrik dan kondisi sesi pengukuran dalam satu tampilan.</p></div>
        <div className="flex flex-col items-start gap-2 sm:items-end"><StatusBadge online={isConnected} stale={dataStale} /><span className="mono text-xs" style={{ color: "var(--text-muted)" }}>{dataLastAt ? `Data terakhir ${new Date(dataLastAt).toLocaleTimeString("id-ID")}` : "Menunggu data pertama"}</span></div>
      </header>

      {error && <div className="rounded-lg border px-4 py-3 text-sm" style={{ color: "var(--red-600)", background: "var(--red-50)", borderColor: "var(--red-100)" }}>{error}</div>}
      <SessionPanel session={session} />

      <section className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-5">
        <MetricCard label="Tegangan" value={metricLoading ? "-" : hasReading ? formatVoltage(latest?.voltage ?? 0) : "--"} unit="V" icon={<Zap size={14} />} accentColor="blue" loading={metricLoading} trendLabel={!hasReading && !metricLoading ? "Belum ada data" : undefined} />
        <MetricCard label="Arus" value={metricLoading ? "-" : hasReading ? formatCurrentMA(latest?.current ?? 0) : "--"} unit="mA" icon={<Activity size={14} />} accentColor="emerald" loading={metricLoading} trendLabel={!hasReading && !metricLoading ? "Belum ada data" : undefined} />
        <MetricCard label="Daya" value={metricLoading ? "-" : hasReading ? formatPowerMW(latest?.power ?? 0) : "--"} unit="mW" icon={<BatteryCharging size={14} />} accentColor="violet" loading={metricLoading} trendLabel={!hasReading && !metricLoading ? "Belum ada data" : undefined} />
        <MetricCard label="Energi kumulatif" value={metricLoading ? "-" : session ? (energyWh * 1000).toFixed(3) : "--"} unit="mWh" icon={<Gauge size={14} />} accentColor="amber" loading={metricLoading} trendLabel={!session && !metricLoading ? "Menunggu sesi" : undefined} />
        <MetricCard label="Waktu berjalan" value={metricLoading ? "-" : session ? formatDuration(latest?.elapsedSeconds ?? 0) : "--"} unit="jj:mm:dd" icon={<Clock3 size={14} />} accentColor="blue" loading={metricLoading} trendLabel={!session && !metricLoading ? "Menunggu sesi" : undefined} />
      </section>

      <RealtimeChart history={history} loading={metricLoading} />
      <MeasurementTable data={history} loading={metricLoading} />
    </div>
  );
}