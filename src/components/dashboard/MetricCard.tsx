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
  emerald: { iconBg: "var(--emerald-50)", iconFg: "var(--emerald-600)", accent: "var(--emerald-500)" },
  blue:    { iconBg: "var(--blue-50)",    iconFg: "var(--blue-600)",    accent: "var(--blue-500)"    },
  amber:   { iconBg: "var(--amber-50)",   iconFg: "var(--amber-600)",   accent: "var(--amber-500)"   },
  violet:  { iconBg: "var(--violet-50)",  iconFg: "var(--violet-600)",  accent: "var(--violet-500)"  },
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
          <div className="skeleton h-8 w-8 rounded-lg" />
        </div>
        <div className="skeleton h-8 w-24 rounded" />
        <div className="skeleton h-3 w-28 rounded" />
      </div>
    );
  }

  const trendDir =
    trend === undefined ? null : trend > 0 ? "up" : trend < 0 ? "down" : "neutral";

  return (
    <div className="card card-hover p-5" style={{ position: "relative", overflow: "hidden" }}>
      {/* Accent line */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 2, background: accent.accent,
          borderRadius: "12px 12px 0 0",
        }}
      />

      {/* Label row */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <p className="section-label">{label}</p>
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: 32, height: 32, background: accent.iconBg, color: accent.iconFg, flexShrink: 0 }}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1 mb-3">
        <span className="mono font-semibold" style={{ fontSize: 26, color: "var(--text-primary)", lineHeight: 1 }}>
          {value}
        </span>
        <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{unit}</span>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-1.5 min-h-[20px]">
        {trend !== undefined ? (
          <>
            <span
              className={cn(
                "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full",
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
