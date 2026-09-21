"use client";

import { SYSTEM_COMPONENTS, INITIAL_ALERTS } from "@/lib/mock-data";
import SystemStatus from "@/components/dashboard/SystemStatus";
import AlertPanel from "@/components/dashboard/AlertPanel";

export default function StatusPage() {
  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div>
        <h1 className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>
          System Status
        </h1>
        <p className="mt-1" style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Hardware connectivity, sensor health, and communication status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SystemStatus components={SYSTEM_COMPONENTS} />
        <AlertPanel alerts={INITIAL_ALERTS} />
      </div>

      {/* Diagnostics placeholder */}
      <div className="card p-5">
        <p className="font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>
          Diagnostics Log
        </p>
        <div className="mono rounded-lg p-4 space-y-1.5"
          style={{ background: "var(--bg-subtle)", fontSize: 12, color: "var(--text-secondary)" }}>
          <p><span style={{ color: "var(--emerald-600)" }}>[INFO]</span> System initialized at 08:00:00</p>
          <p><span style={{ color: "var(--emerald-600)" }}>[INFO]</span> ESP32 handshake complete</p>
          <p><span style={{ color: "var(--emerald-600)" }}>[INFO]</span> Voltage sensor calibrated: OK</p>
          <p><span style={{ color: "var(--emerald-600)" }}>[INFO]</span> Current sensor calibrated: OK</p>
          <p><span style={{ color: "var(--amber-600)" }}>[WARN]</span> Cell 03 output below threshold</p>
          <p><span style={{ color: "var(--emerald-600)" }}>[INFO]</span> Data stream active — 2 s interval</p>
        </div>
      </div>
    </div>
  );
}
