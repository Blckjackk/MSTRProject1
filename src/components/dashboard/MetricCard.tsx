"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  accentColor?: "emerald" | "blue" | "amber" | "violet";
  loading?: boolean;
}

const ACCENT = {
  emerald: {
    iconBg: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
    iconFg: "var(--emerald-600)",
    bar:    "var(--emerald-500)",
    glow:   "rgba(16,185,129,0.12)",
  },
  blue: {
    iconBg: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    iconFg: "var(--blue-600)",
    bar:    "var(--blue-500)",
    glow:   "rgba(59,130,246,0.10)",
  },
  amber: {
    iconBg: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    iconFg: "var(--amber-600)",
    bar:    "var(--amber-500)",
    glow:   "rgba(245,158,11,0.10)",
  },
  violet: {
    iconBg: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
    iconFg: "var(--violet-600)",
    bar:    "var(--violet-500)",
    glow:   "rgba(139,92,246,0.10)",
  },
};

export default function MetricCard({
  label, value, unit, icon, trend, trendLabel,
  accentColor = "emerald", loading = false,
}: MetricCardProps) {
  const accent = ACCENT[accentColor];

  if (loading) {
    return (
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-9 w-9 rounded-xl" />
        </div>
        <div className="skeleton h-9 w-28 rounded" />
        <div className="skeleton h-3 w-24 rounded" />
      </div>
    );
  }

  const trendDir =
    trend === undefined ? null : trend > 0 ? "up" : trend < 0 ? "down" : "neutral";

  return (
    <div className="card card-hover p-5" style={{ position: "relative", overflow: "hidden" }}>
      {/* Subtle top glow strip */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 3,
          background: accent.bar,
          borderRadius: "14px 14px 0 0",
          opacity: 0.8,
        }}
      />

      {/* Background glow blob */}
      <div
        style={{
          position: "absolute", top: -20, right: -20,
          width: 80, height: 80,
          borderRadius: "50%",
          background: accent.glow,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* Header row */}
      <div className="flex items-center justify-between mb-4 pt-1" style={{ position: "relative" }}>
        <p className="section-label">{label}</p>
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 36, height: 36,
            background: accent.iconBg,
            color: accent.iconFg,
            flexShrink: 0,
            boxShadow: `0 2px 6px ${accent.glow}`,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mb-3" style={{ position: "relative" }}>
        <span
          className="mono"
          style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1 }}
        >
          {value}
        </span>
        <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{unit}</span>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-1.5 min-h-[20px]" style={{ position: "relative" }}>
        {trend !== undefined ? (
          <>
            <span
              className={cn(
                "flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full",
                trendDir === "up"      && "trend-up",
                trendDir === "down"    && "trend-down",
                trendDir === "neutral" && "trend-neutral"
              )}
            >
              {trendDir === "up"      && <TrendingUp  size={10} />}
              {trendDir === "down"    && <TrendingDown size={10} />}
              {trendDir === "neutral" && <Minus        size={10} />}
              {Math.abs(trend).toFixed(1)}%
            </span>
            {trendLabel && (
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{trendLabel}</span>
            )}
          </>
        ) : trendLabel ? (
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{trendLabel}</span>
        ) : null}
      </div>
    </div>
  );
}
