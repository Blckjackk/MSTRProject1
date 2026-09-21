"use client";

import { INITIAL_CELLS } from "@/lib/mock-data";
import MSTRCellCard from "@/components/dashboard/MSTRCellCard";

export default function CellsPage() {
  const active  = INITIAL_CELLS.filter((c) => c.status === "active").length;
  const warning = INITIAL_CELLS.filter((c) => c.status === "warning").length;
  const offline = INITIAL_CELLS.filter((c) => c.status === "offline").length;

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>
            MSTR Cells
          </h1>
          <p className="mt-1" style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Individual cell health, output metrics, and efficiency.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded-full font-medium badge-normal">
            {active} Active
          </span>
          {warning > 0 && (
            <span className="text-xs px-2 py-1 rounded-full font-medium badge-warning">
              {warning} Warning
            </span>
          )}
          {offline > 0 && (
            <span className="text-xs px-2 py-1 rounded-full font-medium badge-critical">
              {offline} Offline
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {INITIAL_CELLS.map((cell) => (
          <MSTRCellCard key={cell.id} cell={cell} />
        ))}
      </div>
    </div>
  );
}
