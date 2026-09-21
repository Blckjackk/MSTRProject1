import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVoltage(v: number): string {
  return v.toFixed(2);
}

export function formatCurrentMA(ampere: number): string {
  return (ampere * 1000).toFixed(1);
}

export function formatPowerMW(watt: number): string {
  return (watt * 1000).toFixed(2);
}

export function formatEnergyWh(wh: number): string {
  return wh.toFixed(3);
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
