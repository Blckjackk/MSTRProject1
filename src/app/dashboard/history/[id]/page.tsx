"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { apiJson, API_URL } from "@/lib/api";

interface Metric { max: number; average: number; min: number; }
interface Stats { voltage: Metric | null; current: Metric | null; power: Metric | null; energy_cumulative_mwh: number; peak_power_density_mw_m2: number | null; duration_voltage_above_threshold_seconds: number; duration_seconds: number; peak_power_elapsed_seconds: number | null; }
interface Session { id: number; substrate_name: string; substrate_id: number; replicate: number; status: string; ph: number | null; temperature_c: number | null; volume_ml: number | null; anode_area_cm2: number | null; load_resistor_ohm: number | null; interval_seconds: number; voltage_threshold_v: number; notes: string | null; started_at: string; ended_at: string | null; stats: Stats; }
interface Reading { elapsed_seconds: number; voltage_v: number; current_ma: number; power_mw: number; }

const value = (number: number | null | undefined, digits = 2) => number === null || number === undefined ? "-" : number.toFixed(digits);

export default function SessionDetailPage() {
  const params = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void Promise.all([apiJson<Session>(`/api/sessions/${params.id}`), apiJson<{ points: Reading[] }>(`/api/sessions/${params.id}/readings?max_points=1000`)]).then(([sessionData, readingData]) => { setSession(sessionData); setReadings(readingData.points); }).catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Gagal memuat detail sesi")).finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [params.id]);

  if (loading) return <div className="max-w-screen-xl mx-auto card p-8"><div className="skeleton h-5 w-48 rounded" /></div>;
  if (error || !session) return <div className="max-w-screen-xl mx-auto space-y-4"><Link href="/dashboard/history" className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--emerald-600)" }}><ArrowLeft size={15} /> Kembali</Link><div className="card p-5 text-sm" style={{ color: "var(--red-600)", background: "var(--red-50)" }}>{error ?? "Sesi tidak ditemukan"}</div></div>;

  const chartData = readings.map((reading) => ({ hour: reading.elapsed_seconds / 3600, voltage: reading.voltage_v, current: reading.current_ma, power: reading.power_mw }));
  const statCards = [
    ["Tegangan", session.stats.voltage, "V"], ["Arus", session.stats.current, "mA"], ["Daya", session.stats.power, "mW"],
  ] as const;
  return (
    <div className="page-shell">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><Link href="/dashboard/history" className="inline-flex items-center gap-2 text-sm mb-3" style={{ color: "var(--emerald-600)" }}><ArrowLeft size={15} /> Riwayat sesi</Link><h1 className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>{session.substrate_name} · Replikasi {session.replicate}</h1><p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Sesi #{session.id} · {session.status}</p></div><a href={`${API_URL}/api/sessions/${session.id}/export.csv`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--emerald-600)" }}><Download size={15} /> Ekspor CSV</a></div>
      <div className="card p-5"><p className="card-title mb-4">Metadata sesi</p><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">{[["Substrat", session.substrate_name], ["Replikasi", session.replicate], ["Mulai", new Date(session.started_at).toLocaleString("id-ID")], ["Selesai", session.ended_at ? new Date(session.ended_at).toLocaleString("id-ID") : "-"], ["pH", value(session.ph)], ["Suhu", session.temperature_c === null ? "-" : `${value(session.temperature_c)} °C`], ["Luas anoda", session.anode_area_cm2 === null ? "-" : `${value(session.anode_area_cm2)} cm²`], ["Ambang tegangan", `${value(session.voltage_threshold_v, 3)} V`]].map(([label, data]) => <div key={String(label)}><p className="section-label mb-1">{label}</p><p style={{ color: "var(--text-primary)" }}>{data}</p></div>)}</div>{session.notes && <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>{session.notes}</p>}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{statCards.map(([label, metric, unit]) => <div key={label} className="card p-5"><p className="section-label mb-3">{label}</p><div className="grid grid-cols-3 gap-2 text-center"><div><p className="text-xs" style={{ color: "var(--text-muted)" }}>Max</p><p className="mono font-semibold">{value(metric?.max)}<small> {unit}</small></p></div><div><p className="text-xs" style={{ color: "var(--text-muted)" }}>Rata-rata</p><p className="mono font-semibold">{value(metric?.average)}<small> {unit}</small></p></div><div><p className="text-xs" style={{ color: "var(--text-muted)" }}>Min</p><p className="mono font-semibold">{value(metric?.min)}<small> {unit}</small></p></div></div></div>)}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[["Energi kumulatif", `${value(session.stats.energy_cumulative_mwh, 3)} mWh`], ["Kepadatan daya puncak", `${value(session.stats.peak_power_density_mw_m2, 2)} mW/m²`], ["Durasi di atas ambang", `${value(session.stats.duration_voltage_above_threshold_seconds, 1)} s`], ["Durasi total", `${value(session.stats.duration_seconds, 1)} s`]].map(([label, data]) => <div key={label} className="card p-4"><p className="section-label mb-2">{label}</p><p className="mono font-semibold text-lg">{data}</p></div>)}</div>
      <div className="card p-5"><p className="card-title mb-1">Kurva V / I / P</p><p className="card-subtitle mb-4">Sumbu waktu dalam jam sejak sesi dimulai</p><div style={{ height: 320 }}>{chartData.length === 0 ? <div className="h-full flex items-center justify-center text-sm" style={{ color: "var(--text-muted)" }}>Belum ada pembacaan.</div> : <ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 4" stroke="var(--border)" vertical={false} /><XAxis dataKey="hour" tickFormatter={(hour) => `${Number(hour).toFixed(1)}j`} tick={{ fontSize: 10, fill: "var(--text-muted)" }} /><YAxis yAxisId="left" tick={{ fontSize: 10, fill: "var(--text-muted)" }} /><YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "var(--text-muted)" }} /><Tooltip labelFormatter={(hour) => `${Number(hour).toFixed(3)} jam`} /><Legend /><Line yAxisId="left" dataKey="voltage" name="Tegangan (V)" stroke="var(--blue-500)" dot={false} isAnimationActive={false} /><Line yAxisId="right" dataKey="current" name="Arus (mA)" stroke="var(--emerald-500)" dot={false} isAnimationActive={false} /><Line yAxisId="right" dataKey="power" name="Daya (mW)" stroke="var(--violet-500)" dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer>}</div></div>
    </div>
  );
}