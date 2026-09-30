export interface Measurement {
  timestamp: string;
  elapsedSeconds?: number;
  voltage: number;
  current: number;
  power: number;
  energy: number;
  status: "normal" | "warning" | "critical";
}