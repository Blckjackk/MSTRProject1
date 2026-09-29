"use client";

import { useEffect, useState } from "react";
import { Download, GitCompareArrows } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { apiJson } from "@/lib/api";

interface Session { id: number; substrate_name: string; replicate: number; status: string; started_at: string; }
interface Metric { max: number; average: number; min: number; }
interface CompareResult { session_id: number; substrate_name: string; replicate: number; readings: Array<{ elapsed_seconds: number; voltage_v: number; current_ma: number; power_mw: number }>; stats: { voltage: Metric | null; power: Metric | null; energy_cumulative_mwh: number; peak_power_density_mw_m2: number | null; duration_voltage_above_threshold_seconds: number; }; }
type MetricKey = "voltage_v" | "current_ma" | "power_mw";
const colors = ["var(--blue-500)", "var(--emerald-500)", "var(--violet-500)", "var(--amber-500)", "var(--red-500)", "var(--blue-600)"];
const format = (number: number | null | undefined, digits = 2) => number === null || number === undefined ? "-" : number.toFixed(digits);

function ComparisonChart({ results, metric, label, unit }: { results: CompareResult[]; metric: MetricKey; label: string; unit: string }) {
  const data = results.flatMap((result) => result.readings.map((reading) => ({ hour: reading.elapsed_seconds / 3600, value: reading[metric], key: `s${result.session_id}` })));
  return <div className="card p-5"><p className="card-title mb-1">{label}</p><p className="card-subtitle mb-4">{unit} · jam sejak sesi dimulai</p><div style={{ height: 250 }}><LineChartFallback data={data} results={results} /></div></div>;
}

function LineChartFallback({ data, results }: { data: Array<{ hour: number; value: number; key: string }>; results: CompareResult[] }) {
  const chartData = data.reduce<Array<Record<string, number>>>((points, item) => {
    const point = points.find((candidate) => candidate.hour === item.hour) ?? { hour: item.hour };
    point[item.key] = item.value;
    if (!points.includes(point)) points.push(point);
    return points;
  }, []).sort((left, right) => left.hour - right.hour);
  return <ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 4" stroke="var(--border)" vertical={false} /><XAxis dataKey="hour" tickFormatter={(hour) => `${Number(hour).toFixed(1)}j`} tick={{ fontSize: 10, fill: "var(--text-muted)" }} /><YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} /><Tooltip labelFormatter={(hour) => `${Number(hour).toFixed(3)} jam`} /><Legend />{results.map((result, index) => <Line key={result.session_id} dataKey={`s${result.session_id}`} name={`${result.substrate_name} · R${result.replicate}`} stroke={colors[index]} dot={false} isAnimationActive={false} />)}</LineChart></ResponsiveContainer>;
}

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [results, setResults] = useState<CompareResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { const timer = window.setTimeout(() => { void apiJson<Session[]>("/api/sessions").then(setSessions).catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Gagal memuat sesi")).finally(() => setLoading(false)); }, 0); return () => window.clearTimeout(timer); }, []);
  const toggle = (id: number) => { setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 6 ? [...current, id] : current); setResults([]); };
  const compare = async () => { if (selected.length < 2) return; setComparing(true); setError(null); try { const response = await apiJson<{ sessions: CompareResult[] }>(`/api/compare?sessions=${selected.join(",")}`); setResults(response.sessions); } catch (compareError) { setError(compareError instanceof Error ? compareError.message : "Gagal membandingkan sesi"); } finally { setComparing(false); } };
  const exportSummary = () => { const header = "session_id,substrat,replikasi,max_voltage_v,average_power_mw,peak_power_mw,energy_mwh,power_density_mw_m2,duration_stable_seconds"; const rows = results.map((result) => [result.session_id, result.substrate_name, result.replicate, result.stats.voltage?.max ?? "", result.stats.power?.average ?? "", result.stats.power?.max ?? "", result.stats.energy_cumulative_mwh, result.stats.peak_power_density_mw_m2 ?? "", result.stats.duration_voltage_above_threshold_seconds].join(",")); const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "perbandingan-sesi.csv"; anchor.click(); URL.revokeObjectURL(url); };

  return <div className="space-y-6 max-w-screen-xl mx-auto"><div><h1 className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>Perbandingan Sesi</h1><p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Pilih 2 sampai 6 sesi untuk membandingkan keluaran listriknya.</p></div>{error && <div className="rounded-lg px-4 py-3 text-sm" style={{ color: "var(--red-600)", background: "var(--red-50)" }}>{error}</div>}<div className="card p-5"><div className="flex items-center justify-between mb-4"><p className="card-title">Pilih sesi <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>({selected.length}/6)</span></p><button disabled={selected.length < 2 || comparing} onClick={() => void compare()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40" style={{ background: "var(--emerald-600)" }}><GitCompareArrows size={15} /> {comparing ? "Memuat..." : "Bandingkan"}</button></div>{loading ? <p className="text-sm" style={{ color: "var(--text-muted)" }}>Memuat sesi...</p> : sessions.length === 0 ? <p className="text-sm" style={{ color: "var(--text-muted)" }}>Belum ada sesi tersimpan.</p> : <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{sessions.map((session) => <label key={session.id} className="flex items-center gap-3 p-3 rounded-lg border text-sm" style={{ borderColor: "var(--border)" }}><input type="checkbox" checked={selected.includes(session.id)} disabled={!selected.includes(session.id) && selected.length >= 6} onChange={() => toggle(session.id)} /><span><strong>{session.substrate_name}</strong> · R{session.replicate}<small className="block" style={{ color: "var(--text-muted)" }}>Sesi #{session.id} · {session.status}</small></span></label>)}</div>}</div>{results.length > 0 && <><div className="grid grid-cols-1 lg:grid-cols-3 gap-4"><ComparisonChart results={results} metric="voltage_v" label="Tegangan" unit="V" /><ComparisonChart results={results} metric="current_ma" label="Arus" unit="mA" /><ComparisonChart results={results} metric="power_mw" label="Daya" unit="mW" /></div><div className="card overflow-x-auto"><div className="flex items-center justify-between p-5"><p className="card-title">Ringkasan per sesi</p><button onClick={exportSummary} className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--emerald-600)" }}><Download size={15} /> Ekspor CSV</button></div><table className="w-full text-sm"><thead><tr style={{ background: "var(--bg-subtle)" }}>{["Sesi", "Max V", "Rata-rata P", "Puncak P", "Energi", "Kepadatan daya", "Durasi stabil"].map((heading) => <th key={heading} className="px-4 py-3 text-left section-label whitespace-nowrap">{heading}</th>)}</tr></thead><tbody>{results.map((result) => <tr key={result.session_id} className="border-t" style={{ borderColor: "var(--border)" }}><td className="px-4 py-3 whitespace-nowrap">{result.substrate_name} · R{result.replicate}</td><td className="px-4 py-3 mono">{format(result.stats.voltage?.max)} V</td><td className="px-4 py-3 mono">{format(result.stats.power?.average)} mW</td><td className="px-4 py-3 mono">{format(result.stats.power?.max)} mW</td><td className="px-4 py-3 mono">{format(result.stats.energy_cumulative_mwh, 3)} mWh</td><td className="px-4 py-3 mono">{format(result.stats.peak_power_density_mw_m2)} mW/m²</td><td className="px-4 py-3 mono">{format(result.stats.duration_voltage_above_threshold_seconds, 1)} s</td></tr>)}</tbody></table></div></>}</div>;
}