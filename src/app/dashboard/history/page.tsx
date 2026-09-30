"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, Eye, Trash2 } from "lucide-react";
import { apiJson, API_URL } from "@/lib/api";

interface Session { id: number; substrate_id: number; substrate_name: string; replicate: number; status: "running" | "stopped" | "aborted"; started_at: string; ended_at: string | null; }
interface Substrate { id: number; name: string; }

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [substrates, setSubstrates] = useState<Substrate[]>([]);
  const [substrateFilter, setSubstrateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { const [sessionRows, substrateRows] = await Promise.all([apiJson<Session[]>("/api/sessions"), apiJson<Substrate[]>("/api/substrates")]); setSessions(sessionRows); setSubstrates(substrateRows); setError(null); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Gagal memuat riwayat sesi"); }
    finally { setLoading(false); }
  };
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, []);

  const remove = async (session: Session) => {
    if (session.status === "running" || !window.confirm(`Hapus sesi ${session.id}?`)) return;
    try { await apiJson(`/api/sessions/${session.id}`, { method: "DELETE" }); await load(); }
    catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus sesi"); }
  };
  const visible = sessions.filter((session) => (substrateFilter === "all" || String(session.substrate_id) === substrateFilter) && (statusFilter === "all" || session.status === statusFilter));
  const statusLabel = (status: Session["status"]) => status === "running" ? "Berjalan" : status === "stopped" ? "Selesai" : "Dibatalkan";

  return (
    <div className="page-shell">
      <div><h1 className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>Riwayat Sesi</h1><p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Daftar seluruh pengukuran substrat yang tersimpan.</p></div>
      {error && <div className="rounded-lg px-4 py-3 text-sm" style={{ color: "var(--red-600)", background: "var(--red-50)" }}>{error}</div>}
      <div className="flex flex-col sm:flex-row gap-3"><select value={substrateFilter} onChange={(event) => setSubstrateFilter(event.target.value)} className="px-3 py-2 rounded-lg text-sm" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", color: "var(--text-primary)" }}><option value="all">Semua substrat</option>{substrates.map((substrate) => <option key={substrate.id} value={substrate.id}>{substrate.name}</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="px-3 py-2 rounded-lg text-sm" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", color: "var(--text-primary)" }}><option value="all">Semua status</option><option value="running">Berjalan</option><option value="stopped">Selesai</option><option value="aborted">Dibatalkan</option></select></div>
      <div className="card overflow-x-auto">{loading ? <div className="p-8 text-sm" style={{ color: "var(--text-muted)" }}>Memuat riwayat...</div> : visible.length === 0 ? <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>Tidak ada sesi sesuai filter.</div> : <table className="w-full text-sm"><thead><tr style={{ background: "var(--bg-subtle)" }}>{["ID", "Substrat", "Replikasi", "Mulai", "Status", "Aksi"].map((heading) => <th key={heading} className="px-4 py-3 text-left section-label whitespace-nowrap">{heading}</th>)}</tr></thead><tbody>{visible.map((session) => <tr key={session.id} className="border-t" style={{ borderColor: "var(--border)" }}><td className="px-4 py-3 mono">#{session.id}</td><td className="px-4 py-3 font-medium">{session.substrate_name}</td><td className="px-4 py-3">{session.replicate}</td><td className="px-4 py-3 whitespace-nowrap">{new Date(session.started_at).toLocaleString("id-ID")}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${session.status === "running" ? "badge-warning" : session.status === "stopped" ? "badge-normal" : "badge-critical"}`}>{statusLabel(session.status)}</span></td><td className="px-4 py-3"><div className="flex gap-2"><Link title="Lihat detail" href={`/dashboard/history/${session.id}`} className="p-1.5" style={{ color: "var(--blue-600)" }}><Eye size={15} /></Link><a title="Ekspor CSV" href={`${API_URL}/api/sessions/${session.id}/export.csv`} className="p-1.5" style={{ color: "var(--emerald-600)" }}><Download size={15} /></a><button title={session.status === "running" ? "Sesi running tidak dapat dihapus" : "Hapus"} disabled={session.status === "running"} onClick={() => void remove(session)} className="p-1.5 disabled:opacity-30" style={{ color: "var(--red-600)" }}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table>}</div>
    </div>
  );
}