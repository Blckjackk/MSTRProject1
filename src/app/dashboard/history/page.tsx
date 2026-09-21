"use client";

import EnergyProductionChart from "@/components/dashboard/EnergyProductionChart";

export default function HistoryPage() {
  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div>
        <h1 className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>
          Energy History
        </h1>
        <p className="mt-1" style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Historical energy production and electrical output analysis.
        </p>
      </div>

      <EnergyProductionChart />

      {/* Placeholder info card */}
      <div className="card p-8 text-center">
        <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
          Detailed historical data export
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Connect your backend to enable CSV export and long-term trend analysis.
        </p>
      </div>
    </div>
  );
}
