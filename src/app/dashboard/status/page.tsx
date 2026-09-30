"use client";

import { useEffect, useState } from "react";
import { Database, Radio, Activity } from "lucide-react";
import { apiJson } from "@/lib/api";

interface Health { status: string; mysql: { connected: boolean }; mqtt: { connected: boolean }; data: { stale: boolean; last_at: string | null }; timestamp: string; }

export default function StatusPage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => { void apiJson<Health>("/api/health").then(setHealth).catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Gagal memuat status sistem")).finally(() => setLoading(false)); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const items = health ? [
    ["MySQL", health.mysql.connected, Database],
    ["MQTT", health.mqtt.connected, Radio],
    ["Data", !health.data.stale, Activity],
  ] as const : [];
  return <div className="space-y-6 max-w-screen-xl mx-auto"><div><h1 className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>Status Sistem</h1><p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Status koneksi backend dan kesegaran data pengukuran.</p></div>{loading ? <div className="card p-8"><div className="skeleton h-5 w-48 rounded" /></div> : error ? <div className="card p-5 text-sm" style={{ color: "var(--red-600)", background: "var(--red-50)" }}>{error}</div> : health && <><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{items.map(([label, connected, Icon]) => <div className="card p-5" key={label}><div className="flex items-center gap-3"><Icon size={18} style={{ color: connected ? "var(--emerald-600)" : "var(--red-600)" }} /><div><p className="section-label">{label}</p><p className="font-semibold mt-1" style={{ color: connected ? "var(--emerald-700)" : "var(--red-600)" }}>{connected ? "Normal" : label === "Data" ? "Data lama" : "Offline"}</p></div></div></div>)}</div><div className="card p-5 text-sm" style={{ color: "var(--text-secondary)" }}><p>Data terakhir: <span className="mono">{health.data.last_at ? new Date(health.data.last_at).toLocaleString("id-ID") : "-"}</span></p><p className="mt-2">Pemeriksaan terakhir: <span className="mono">{new Date(health.timestamp).toLocaleString("id-ID")}</span></p></div></>}</div>;
}