"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Play, Square } from "lucide-react";
import { useLiveData } from "@/hooks/useLiveData";
import { apiJson } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface Substrate {
  id: number;
  code: string;
  name: string;
  description: string | null;
}

interface SessionRecord {
  substrate_id: number;
  replicate: number;
}

interface FormState {
  substrate_id: string;
  replicate: string;
  ph: string;
  temperature_c: string;
  volume_ml: string;
  anode_area_cm2: string;
  load_resistor_ohm: string;
  interval_seconds: string;
  voltage_threshold_v: string;
  notes: string;
}

const initialForm: FormState = {
  substrate_id: "",
  replicate: "1",
  ph: "",
  temperature_c: "",
  volume_ml: "",
  anode_area_cm2: "",
  load_resistor_ohm: "",
  interval_seconds: "10",
  voltage_threshold_v: "0.3",
  notes: "",
};

function readError(error: unknown): string {
  return error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui";
}

export default function SessionsPage() {
  const { session: activeSession } = useLiveData();
  const [substrates, setSubstrates] = useState<Substrate[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSubstrates = async () => {
      try {
        const [activeSubstrates, sessions] = await Promise.all([
          apiJson<Substrate[]>("/api/substrates?active=1"),
          apiJson<SessionRecord[]>("/api/sessions"),
        ]);
        setSubstrates(activeSubstrates);
        if (activeSubstrates.length > 0) {
          const firstId = String(activeSubstrates[0].id);
          const nextReplicate = sessions
            .filter((item) => item.substrate_id === activeSubstrates[0].id)
            .reduce((highest, item) => Math.max(highest, item.replicate), 0) + 1;
          setForm((current) => ({ ...current, substrate_id: firstId, replicate: String(nextReplicate) }));
        }
      } catch (loadError) {
        setError(readError(loadError));
      } finally {
        setLoading(false);
      }
    };
    void loadSubstrates();
  }, []);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError(null);
    setMessage(null);
  };

  const suggestedReplicate = async (substrateId: string) => {
    updateField("substrate_id", substrateId);
    if (!substrateId) return;
    try {
      const sessions = await apiJson<SessionRecord[]>(`/api/sessions?substrate_id=${substrateId}`);
      const next = sessions.reduce((highest, item) => Math.max(highest, item.replicate), 0) + 1;
      setForm((current) => ({ ...current, substrate_id: substrateId, replicate: String(next) }));
    } catch {
      // The user can still enter a replicate manually if this suggestion fails.
    }
  };

  const startSession = async () => {
    if (activeSession || !form.substrate_id || !window.confirm("Mulai sesi pengukuran ini?")) return;
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, value]) => value !== ""));
      for (const field of ["substrate_id", "replicate", "interval_seconds"]) payload[field] = Number(payload[field]);
      for (const field of ["ph", "temperature_c", "volume_ml", "anode_area_cm2", "load_resistor_ohm", "voltage_threshold_v"]) {
        if (payload[field] !== undefined) payload[field] = Number(payload[field]);
      }
      const response = await fetch(`${API_URL}/api/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? `Gagal memulai sesi (${response.status})`);
      setMessage(`Sesi ${body.session_id} berhasil dibuat dan command start dikirim.`);
    } catch (startError) {
      setError(readError(startError));
    } finally {
      setSubmitting(false);
    }
  };

  const stopSession = async () => {
    if (!activeSession || !window.confirm(`Hentikan sesi ${activeSession.id}?`)) return;
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`${API_URL}/api/sessions/${activeSession.id}/stop`, { method: "POST" });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? `Gagal menghentikan sesi (${response.status})`);
      setMessage(`Sesi ${activeSession.id} berhasil dihentikan.`);
    } catch (stopError) {
      setError(readError(stopError));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg text-sm outline-none";
  const inputStyle = { border: "1px solid var(--border)", background: "var(--bg-subtle)", color: "var(--text-primary)" };

  return (
    <div className="page-shell session-page">
      <div><h1 className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>Kontrol Sesi</h1><p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Atur pengukuran satu substrat dengan sensor MFC.</p></div>
      {error && <div className="rounded-lg px-4 py-3 text-sm" style={{ color: "var(--red-600)", background: "var(--red-50)", border: "1px solid var(--red-100)" }}>{error}</div>}
      {message && <div className="rounded-lg px-4 py-3 text-sm" style={{ color: "var(--emerald-700)", background: "var(--emerald-50)", border: "1px solid var(--emerald-100)" }}>{message}</div>}

      {activeSession && <div className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><p className="section-label">Sesi sedang berjalan</p><p className="font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{activeSession.substrate_name} · Replikasi {activeSession.replicate}</p></div><button type="button" onClick={() => void stopSession()} disabled={submitting} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: "var(--red-600)" }}><Square size={14} /> Stop Sesi</button></div>}

      {loading ? <div className="card p-6"><div className="skeleton h-5 w-56 rounded" /></div> : substrates.length === 0 ? <div className="card p-8 text-center"><Activity size={28} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} /><p className="font-semibold" style={{ color: "var(--text-primary)" }}>Belum ada substrat aktif</p><p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Aktifkan substrat terlebih dahulu dari pengelolaan data substrat.</p><Link href="/dashboard/settings" className="inline-flex mt-4 text-sm" style={{ color: "var(--emerald-600)" }}>Buka Settings</Link></div> : <div className="card p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm font-medium">Substrat<select value={form.substrate_id} onChange={(event) => void suggestedReplicate(event.target.value)} className={inputClass} style={inputStyle}><option value="">Pilih substrat</option>{substrates.map((substrate) => <option key={substrate.id} value={substrate.id}>{substrate.code} · {substrate.name}</option>)}</select></label>
          <label className="text-sm font-medium">Replikasi<input type="number" min="1" value={form.replicate} onChange={(event) => updateField("replicate", event.target.value)} className={inputClass} style={inputStyle} /></label>
          <label className="text-sm font-medium">pH<input type="number" step="0.01" min="0" max="14" value={form.ph} onChange={(event) => updateField("ph", event.target.value)} className={inputClass} style={inputStyle} placeholder="Opsional" /></label>
          <label className="text-sm font-medium">Suhu (°C)<input type="number" step="0.1" value={form.temperature_c} onChange={(event) => updateField("temperature_c", event.target.value)} className={inputClass} style={inputStyle} placeholder="Opsional" /></label>
          <label className="text-sm font-medium">Volume (mL)<input type="number" step="0.01" min="0" value={form.volume_ml} onChange={(event) => updateField("volume_ml", event.target.value)} className={inputClass} style={inputStyle} placeholder="Opsional" /></label>
          <label className="text-sm font-medium">Luas anoda (cm²)<input type="number" step="0.01" min="0" value={form.anode_area_cm2} onChange={(event) => updateField("anode_area_cm2", event.target.value)} className={inputClass} style={inputStyle} placeholder="Opsional" /></label>
          <label className="text-sm font-medium">Resistor beban (Ω)<input type="number" step="0.01" min="0" value={form.load_resistor_ohm} onChange={(event) => updateField("load_resistor_ohm", event.target.value)} className={inputClass} style={inputStyle} placeholder="Opsional" /></label>
          <label className="text-sm font-medium">Interval (detik)<input type="number" min="1" value={form.interval_seconds} onChange={(event) => updateField("interval_seconds", event.target.value)} className={inputClass} style={inputStyle} /></label>
          <label className="text-sm font-medium">Ambang tegangan (V)<input type="number" step="0.001" min="0" value={form.voltage_threshold_v} onChange={(event) => updateField("voltage_threshold_v", event.target.value)} className={inputClass} style={inputStyle} /></label>
          <label className="text-sm font-medium md:col-span-2">Catatan<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} className={`${inputClass} min-h-24`} style={inputStyle} placeholder="Opsional" /></label>
        </div>
        <div className="flex justify-end mt-6"><button type="button" onClick={() => void startSession()} disabled={submitting || Boolean(activeSession) || !form.substrate_id} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: "var(--emerald-600)" }}><Play size={14} /> Start Sesi</button></div>
      </div>}
    </div>
  );
}