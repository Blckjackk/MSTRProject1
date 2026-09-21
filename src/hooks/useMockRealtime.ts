"use client";

import { useState, useEffect, useRef } from "react";
import {
  type Measurement,
  generateMeasurement,
  generateHistory,
} from "@/lib/mock-data";

const INTERVAL_MS = 2000;
const HISTORY_SIZE = 60; // keep last 60 readings (2 min at 2s interval)

interface UseRealtimeReturn {
  latest: Measurement | null;
  history: Measurement[];
  isConnected: boolean;
}

/**
 * useMockRealtime
 *
 * Simulates an incoming data stream from an ESP32 device.
 * Replace the setInterval body with a WebSocket message handler
 * to switch from mock to real data without touching any component.
 */
export function useMockRealtime(): UseRealtimeReturn {
  const [latest, setLatest] = useState<Measurement | null>(null);
  const [history, setHistory] = useState<Measurement[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Seed with historical data on mount
    const seed = generateHistory(HISTORY_SIZE);
    setHistory(seed);
    setLatest(seed[seed.length - 1]);
    setIsConnected(true);

    // Simulate incoming measurements
    timerRef.current = setInterval(() => {
      const measurement = generateMeasurement();
      setLatest(measurement);
      setHistory((prev) => {
        const next = [...prev, measurement];
        return next.length > HISTORY_SIZE ? next.slice(-HISTORY_SIZE) : next;
      });
    }, INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { latest, history, isConnected };
}
