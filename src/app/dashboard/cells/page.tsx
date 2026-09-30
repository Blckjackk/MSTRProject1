"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, ToggleLeft } from "lucide-react";
import { apiJson } from "@/lib/api";

interface Substrate { id: number; code: string; name: string; description: string | null; is_active: number; }
interface Session { substrate_id: number; }
interface FormState { code: string; name: string; description: string; is_active: boolean; }
const emptyForm: FormState = { code: "", name: "", description: "", is_active: true };

export default function SubstratesPage() {
  const [substrates, setSubstrates] = useState<Substrate[]>([]);
  const [sessionCounts, setSessionCounts] = useState<Record<number, number>>({});
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const query = activeFilter === "all" ? "" : `?active=${activeFilter}`;
      const [items, sessions] = await Promise.all([apiJson<Substrate[]>(`/api/substrates${query}`), apiJson<Session[]>("/api/sessions")]);
      const counts: Record<number, number> = {};
      sessions.forEach((session) => { counts[session.substrate_id] = (counts[session.substrate_id] ?? 0) + 1; });
      setSubstrates(items); setSessionCounts(counts); setError(null);
    } catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Gagal memuat substrat"); }
    finally { setLoading(false); }
  }, [activeFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await apiJson(editingId ? `/api/substrates/${editingId}` : "/api/substrates", { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, is_active: form.is_active ? 1 : 0 }) });
      setForm(emptyForm); setEditingId(null); await load();
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan substrat"); }
  };
  const remove = async (substrate: Substrate) => {
    try { await apiJson(`/api/substrates/${substrate.id}`, { method: "DELETE" }); await load(); }
    catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : "Substrat sudah dipakai, nonaktifkan saja."); }
  };
  const edit = (substrate: Substrate) => { setEditingId(substrate.id); setForm({ code: substrate.code, name: substrate.name, description: substrate.description ?? "", is_active: Boolean(substrate.is_active) }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const inputStyle = { background: "var(--bg-subtle)", border: "1px solid var(--border)", color: "var(--text-primary)" };

  return (
    <div className="page-shell substrate-page">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"><div><h1 className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>Substrat</h1><p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Kelola bahan ekoenzim yang digunakan dalam sesi MFC.</p></div></div>
      {error && <div className="rounded-lg px-4 py-3 text-sm" style={{ color: "var(--red-600)", background: "var(--red-50)", border: "1px solid var(--red-100)" }}>{error}</div>}
      <form onSubmit={save} className="card p-5"><div className="flex items-center justify-between mb-4"><p className="card-title">{editingId ? "Edit substrat" : "Substrat baru"}</p>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="text-xs" style={{ color: "var(--text-muted)" }}>Batal</button>}</div><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><label className="text-sm font-medium">Kode<input required maxLength={10} value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg text-sm" style={inputStyle} /></label><label className="text-sm font-medium">Nama<input required maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg text-sm" style={inputStyle} /></label><label className="text-sm font-medium">Deskripsi<textarea maxLength={2000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg text-sm min-h-10" style={inputStyle} /></label></div>{editingId && <label className="inline-flex items-center gap-2 mt-4 text-sm"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /> Aktif</label>}<div className="flex justify-end mt-4"><button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--emerald-600)" }}>{editingId ? "Simpan perubahan" : "Tambah substrat"}</button></div></form>
      <div className="flex items-center justify-between"><p className="card-title">Daftar substrat</p><select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)} className="px-3 py-2 rounded-lg text-sm" style={inputStyle}><option value="all">Semua status</option><option value="1">Aktif</option><option value="0">Nonaktif</option></select></div>
      <div className="card overflow-x-auto">{loading ? <div className="p-8 text-sm" style={{ color: "var(--text-muted)" }}>Memuat substrat...</div> : substrates.length === 0 ? <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>Belum ada substrat pada filter ini.</div> : <table className="w-full text-sm"><thead><tr style={{ background: "var(--bg-subtle)" }}>{["Kode", "Nama", "Deskripsi", "Status", "Jumlah sesi", "Aksi"].map((heading) => <th key={heading} className="px-4 py-3 text-left section-label whitespace-nowrap">{heading}</th>)}</tr></thead><tbody>{substrates.map((substrate) => <tr key={substrate.id} className="border-t" style={{ borderColor: "var(--border)" }}><td className="px-4 py-3 mono">{substrate.code}</td><td className="px-4 py-3 font-medium">{substrate.name}</td><td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>{substrate.description || "-"}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${substrate.is_active ? "badge-normal" : "badge-critical"}`}>{substrate.is_active ? "Aktif" : "Nonaktif"}</span></td><td className="px-4 py-3 mono">{sessionCounts[substrate.id] ?? 0}</td><td className="px-4 py-3"><div className="flex gap-2"><button title="Edit" onClick={() => edit(substrate)} className="p-1.5 rounded" style={{ color: "var(--blue-600)" }}><Pencil size={15} /></button><button title="Aktif/nonaktifkan" onClick={() => edit({ ...substrate, is_active: substrate.is_active ? 0 : 1 })} className="p-1.5 rounded" style={{ color: "var(--amber-600)" }}><ToggleLeft size={15} /></button><button title="Hapus" onClick={() => void remove(substrate)} className="p-1.5 rounded" style={{ color: "var(--red-600)" }}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table>}</div>
    </div>
  );
}