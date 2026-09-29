"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type Measurement } from "@/lib/data-models";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const configuredPollInterval = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_MS ?? 5000);
const POLL_INTERVAL_MS = Number.isFinite(configuredPollInterval) && configuredPollInterval > 0
  ? configuredPollInterval
  : 5000;
const LIVE_CACHE_KEY = "mstr-live-data-cache";

export interface LiveSession {
  id: number;
  substrate_name: string;
  replicate: number;
  ph: number | null;
  temperature_c: number | null;
  load_resistor_ohm: number | null;
  interval_seconds: number;
  started_at: string;
  voltage_threshold_v: number;
}

interface LiveResponse {
  session: LiveSession | null;
  latest: {
    elapsedSeconds: number;
    voltage: number;
    currentMa: number;
    powerMw: number;
    timestamp: string;
  } | null;
  energy_wh: number;
  device: { online: boolean; last_seen_at: string | null } | null;
  data_last_at: string | null;
}

interface ReadingResponse {
  points: Array<{
    elapsed_seconds: number;
    voltage_v: number;
    current_ma: number;
    power_mw: number;
    created_at?: string;
  }>;
}

interface LiveDataValue {
  latest: Measurement | null;
  history: Measurement[];
  energyWh: number;
  isConnected: boolean;
  dataStale: boolean;
  dataLastAt: string | null;
  session: LiveSession | null;
  loading: boolean;
  error: string | null;
}

interface LiveDataCache {
  latest: Measurement | null;
  history: Measurement[];
  energyWh: number;
  dataLastAt: string | null;
  session: LiveSession | null;
}

function readLiveCache(): LiveDataCache | null {
  try {
    const cached = window.localStorage.getItem(LIVE_CACHE_KEY);
    return cached ? JSON.parse(cached) as LiveDataCache : null;
  } catch {
    return null;
  }
}

const LiveDataContext = createContext<LiveDataValue | null>(null);

export function LiveDataProvider({ children }: { children: React.ReactNode }) {
  const [initialCache] = useState<LiveDataCache | null>(() => readLiveCache());
  const [latest, setLatest] = useState<Measurement | null>(() => initialCache?.latest ?? null);
  const [history, setHistory] = useState<Measurement[]>(() => initialCache?.history ?? []);
  const [energyWh, setEnergyWh] = useState(() => initialCache?.energyWh ?? 0);
  const [isConnected, setIsConnected] = useState(false);
  const [dataStale, setDataStale] = useState(false);
  const [dataLastAt, setDataLastAt] = useState<string | null>(() => initialCache?.dataLastAt ?? null);
  const [session, setSession] = useState<LiveSession | null>(() => initialCache?.session ?? null);
  const [loading, setLoading] = useState(!initialCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadLiveData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/live`, { cache: "no-store" });
        if (!response.ok) throw new Error("Backend live tidak dapat diakses");
        const live = (await response.json()) as LiveResponse;
        let readings: ReadingResponse["points"] = [];

        if (live.session) {
          const readingsResponse = await fetch(
            `${API_URL}/api/sessions/${live.session.id}/readings?max_points=600`,
            { cache: "no-store" },
          );
          if (!readingsResponse.ok) throw new Error("Gagal mengambil pembacaan sesi");
          readings = (await readingsResponse.json() as ReadingResponse).points;
        }

        let cumulativeWh = 0;
        const measurements = readings.map((reading, index) => {
          if (index > 0) {
            const previous = readings[index - 1];
            const seconds = Math.max(0, reading.elapsed_seconds - previous.elapsed_seconds);
            cumulativeWh += ((previous.power_mw + reading.power_mw) / 2) * seconds / 3_600_000;
          }
          return {
            timestamp: reading.created_at ?? new Date().toISOString(),
            elapsedSeconds: reading.elapsed_seconds,
            voltage: reading.voltage_v,
            current: reading.current_ma / 1000,
            power: reading.power_mw / 1000,
            energy: cumulativeWh,
            status: reading.current_ma > 40
              ? "warning"
              : reading.voltage_v < 0.25
              ? "critical"
              : "normal",
          } as Measurement;
        });

        if (!active) return;
        setHistory(measurements);
        setEnergyWh(live.energy_wh);
        setLatest(measurements.at(-1) ?? (live.latest ? {
          timestamp: live.latest.timestamp,
          elapsedSeconds: live.latest.elapsedSeconds,
          voltage: live.latest.voltage,
          current: live.latest.currentMa / 1000,
          power: live.latest.powerMw / 1000,
          energy: live.energy_wh,
          status: "normal",
        } as Measurement : null));
        setSession(live.session);
        setIsConnected(Boolean(live.device?.online));
        const stale = Boolean(
          live.session &&
          (!live.data_last_at || Date.now() - new Date(live.data_last_at).getTime() > live.session.interval_seconds * 3 * 1000),
        );
        setDataStale(stale);
        setDataLastAt(live.data_last_at);
        try {
          window.localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify({
            latest: measurements.at(-1) ?? null,
            history: measurements,
            energyWh: live.energy_wh,
            dataLastAt: live.data_last_at,
            session: live.session,
          } satisfies LiveDataCache));
        } catch {
          // Kegagalan cache tidak boleh menghilangkan data live.
        }
        setError(null);
      } catch (loadError) {
        if (active) {
          setIsConnected(false);
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat data live");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadLiveData();
    const timer = setInterval(() => void loadLiveData(), POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <LiveDataContext.Provider value={{ latest, history, energyWh, isConnected, dataStale, dataLastAt, session, loading, error }}>
      {children}
    </LiveDataContext.Provider>
  );
}

export function useLiveData(): LiveDataValue {
  const context = useContext(LiveDataContext);
  if (!context) throw new Error("useLiveData harus digunakan di dalam LiveDataProvider");
  return context;
}