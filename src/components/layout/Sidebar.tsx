"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  BarChart2,
  Cpu,
  LineChart,
  ServerCog,
  Settings,
  Zap,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  group?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview",          href: "/dashboard",           icon: LayoutDashboard, group: "Monitor" },
  { label: "Real-Time Monitor", href: "/dashboard/realtime",  icon: Activity,        group: "Monitor" },
  { label: "Energy History",    href: "/dashboard/history",   icon: BarChart2,       group: "Monitor" },
  { label: "MSTR Cells",        href: "/dashboard/cells",     icon: Cpu,             group: "Monitor" },
  { label: "Analytics",         href: "/dashboard/analytics", icon: LineChart,       group: "Analyze" },
  { label: "System Status",     href: "/dashboard/status",    icon: ServerCog,       group: "Analyze" },
  { label: "Settings",          href: "/dashboard/settings",  icon: Settings,        group: "System"  },
];

const GROUPS = ["Monitor", "Analyze", "System"] as const;

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={{
          width: "var(--sidebar-w)",
          borderRight: "1px solid var(--border)",
          background: "var(--bg-surface)",
          flexShrink: 0,
        }}
        className={cn(
          /* Mobile: fixed drawer, slides in/out */
          "fixed top-0 left-0 z-40 h-screen flex flex-col",
          "transition-transform duration-250 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          /* Desktop: override to static, always visible */
          "lg:relative lg:translate-x-0 lg:z-auto lg:flex"
        )}
      >
        {/* ── Logo ── */}
        <div
          className="flex items-center justify-between px-4"
          style={{ height: "var(--topbar-h)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 30, height: 30, background: "var(--emerald-600)", flexShrink: 0 }}
            >
              <Zap size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <div style={{ lineHeight: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                MSTR
              </p>
              <p style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 2 }}>
                Energy Monitor
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md"
              style={{ color: "var(--text-muted)" }}
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {GROUPS.map((group) => {
            const items = NAV_ITEMS.filter((n) => n.group === group);
            return (
              <div key={group} className="mb-5">
                <p
                  className="section-label px-2 mb-1.5"
                >
                  {group}
                </p>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const isActive =
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn("sidebar-nav-item", isActive && "active")}
                        onClick={onClose}
                      >
                        <item.icon
                          size={14}
                          strokeWidth={isActive ? 2.5 : 1.75}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* ── Footer status ── */}
        <div
          className="px-3 py-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="live-dot" />
            <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
              System Active
            </p>
            <span
              className="ml-auto mono"
              style={{ fontSize: 11, color: "var(--text-muted)" }}
            >
              4 cells
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
