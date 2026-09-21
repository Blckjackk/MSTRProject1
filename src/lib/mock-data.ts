/**
 * mock-data.ts
 *
 * Realistic mock data for the MSTR Energy Monitor.
 * This module is the ONLY place that generates synthetic data.
 * To connect real hardware, replace the generators here with
 * WebSocket / REST API calls — zero changes needed in components.
 */

export interface Measurement {
  timestamp: string;
  voltage: number;   // Volt  (0.10 – 1.50 V)
  current: number;   // Ampere (0 – 0.050 A, i.e. 0 – 50 mA)
  power: number;     // Watt  = V × I
  energy: number;    // Wh    (accumulated)
  status: "normal" | "warning" | "critical";
}

export interface MSTRCell {
  id: string;
  label: string;
  voltage: number;
  current: number;
  power: number;
  status: "active" | "warning" | "offline";
  efficiency: number; // 0–100 %
}

export interface SystemComponent {
  id: string;
  label: string;
  status: "connected" | "online" | "normal" | "stable" | "warning" | "offline";
}

export interface Alert {
  id: string;
  type: "warning" | "info" | "critical";
  title: string;
  description: string;
  minutesAgo: number;
}

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/** Clamp helper */
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Gaussian-like noise around a base value */
function jitter(base: number, spread: number): number {
  const u = Math.random() + Math.random() + Math.random() - 1.5;
  return clamp(base + u * spread, 0, Infinity);
}

let _accumulatedEnergy = 0.12; // Wh — starting accumulated value
let _lastVoltage = 0.82;
let _lastCurrent = 0.0126; // A

export function generateMeasurement(): Measurement {
  // Walk voltage and current with small random steps
  _lastVoltage = clamp(
    _lastVoltage + (Math.random() - 0.5) * 0.04,
    0.10,
    1.50
  );
  _lastCurrent = clamp(
    _lastCurrent + (Math.random() - 0.5) * 0.002,
    0.0,
    0.050
  );

  const power = _lastVoltage * _lastCurrent;
  // Accumulate energy: power(W) × interval(s) / 3600 → Wh
  _accumulatedEnergy += (power * 2) / 3600;

  const status: Measurement["status"] =
    _lastCurrent > 0.04
      ? "warning"
      : _lastVoltage < 0.25
      ? "critical"
      : "normal";

  return {
    timestamp: new Date().toISOString(),
    voltage: parseFloat(_lastVoltage.toFixed(4)),
    current: parseFloat(_lastCurrent.toFixed(5)),
    power: parseFloat(power.toFixed(6)),
    energy: parseFloat(_accumulatedEnergy.toFixed(5)),
    status,
  };
}

/** Generate a history of the past N measurements (latest last) */
export function generateHistory(count: number): Measurement[] {
  const now = Date.now();
  let v = 0.82;
  let i = 0.0126;
  let e = 0.08;
  const results: Measurement[] = [];

  for (let n = count; n >= 0; n--) {
    v = clamp(v + (Math.random() - 0.5) * 0.04, 0.1, 1.5);
    i = clamp(i + (Math.random() - 0.5) * 0.002, 0, 0.05);
    const p = v * i;
    e += (p * 2) / 3600;

    const status: Measurement["status"] =
      i > 0.04 ? "warning" : v < 0.25 ? "critical" : "normal";

    results.push({
      timestamp: new Date(now - n * 2000).toISOString(),
      voltage: parseFloat(v.toFixed(4)),
      current: parseFloat(i.toFixed(5)),
      power: parseFloat(p.toFixed(6)),
      energy: parseFloat(e.toFixed(5)),
      status,
    });
  }

  return results;
}

/** Daily energy buckets for the production chart */
export function generateDailyEnergy(days: number): { date: string; energy: number; avgPower: number; peakPower: number }[] {
  const result = [];
  for (let d = days - 1; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    result.push({
      date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      energy: parseFloat(jitter(0.28, 0.12).toFixed(3)),
      avgPower: parseFloat(jitter(10.5, 2.5).toFixed(2)),
      peakPower: parseFloat(jitter(18.0, 4.0).toFixed(2)),
    });
  }
  return result;
}

// ---------------------------------------------------------------------------
// Static initial data
// ---------------------------------------------------------------------------

export const INITIAL_CELLS: MSTRCell[] = [
  {
    id: "cell-01",
    label: "MSTR Cell 01",
    voltage: 0.84,
    current: 0.0126,
    power: 0.01058,
    status: "active",
    efficiency: 82,
  },
  {
    id: "cell-02",
    label: "MSTR Cell 02",
    voltage: 0.79,
    current: 0.0108,
    power: 0.00853,
    status: "active",
    efficiency: 74,
  },
  {
    id: "cell-03",
    label: "MSTR Cell 03",
    voltage: 0.41,
    current: 0.0042,
    power: 0.00172,
    status: "warning",
    efficiency: 31,
  },
  {
    id: "cell-04",
    label: "MSTR Cell 04",
    voltage: 0.92,
    current: 0.0138,
    power: 0.01270,
    status: "active",
    efficiency: 89,
  },
];

export const SYSTEM_COMPONENTS: SystemComponent[] = [
  { id: "sensor",     label: "Sensor",           status: "connected" },
  { id: "esp32",      label: "ESP32",             status: "online" },
  { id: "vsensor",    label: "Voltage Sensor",    status: "normal" },
  { id: "isensor",    label: "Current Sensor",    status: "normal" },
  { id: "datatx",    label: "Data Transmission",  status: "stable" },
  { id: "database",  label: "Database",           status: "connected" },
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: "a1",
    type: "warning",
    title: "High Current Detected",
    description: "Current reached 18.4 mA on Cell 01",
    minutesAgo: 2,
  },
  {
    id: "a2",
    type: "warning",
    title: "Low Voltage",
    description: "Voltage dropped below 0.50 V on Cell 03",
    minutesAgo: 18,
  },
  {
    id: "a3",
    type: "info",
    title: "Sensor Reconnected",
    description: "Current sensor connection restored",
    minutesAgo: 42,
  },
];
