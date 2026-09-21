"use client";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div>
        <h1 className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>
          Settings
        </h1>
        <p className="mt-1" style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Configure data acquisition, display preferences, and connection parameters.
        </p>
      </div>

      {/* Connection config */}
      <div className="card p-5 space-y-4">
        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
          Connection
        </p>

        {[
          { label: "WebSocket Endpoint",  placeholder: "ws://192.168.1.100:8080/ws", type: "text"   },
          { label: "API Base URL",         placeholder: "http://192.168.1.100:3001",  type: "text"   },
          { label: "Sampling Interval (s)", placeholder: "2",                         type: "number" },
        ].map((f) => (
          <div key={f.label} className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              {f.label}
            </label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              className="col-span-2 px-3 py-2 rounded-lg text-sm mono outline-none transition-all"
              style={{
                border: "1px solid var(--border)",
                background: "var(--bg-subtle)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--emerald-500)")}
              onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        ))}
      </div>

      {/* Display config */}
      <div className="card p-5 space-y-4">
        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
          Display
        </p>
        {[
          { label: "Chart History (readings)", placeholder: "60" },
          { label: "Table Rows",               placeholder: "10" },
        ].map((f) => (
          <div key={f.label} className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              {f.label}
            </label>
            <input
              type="number"
              placeholder={f.placeholder}
              className="col-span-2 px-3 py-2 rounded-lg text-sm mono outline-none transition-all"
              style={{
                border: "1px solid var(--border)",
                background: "var(--bg-subtle)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--emerald-500)")}
              onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        ))}
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--emerald-600)" }}
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
