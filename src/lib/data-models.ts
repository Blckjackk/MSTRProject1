export interface Measurement {
  timestamp: string;
  elapsedSeconds?: number;
  voltage: number;
  current: number;
  power: number;
  energy: number;
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

export interface Alert {
  id: string;
  type: "warning" | "info" | "critical";
  title: string;
  description: string;
  minutesAgo: number;
}