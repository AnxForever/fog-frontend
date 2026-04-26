"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Compass, Home, PanelLeftClose, PanelLeftOpen, PlaySquare } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页", icon: Home, hint: "Overview" },
  { href: "/experiments", label: "实验结果", icon: BarChart3, hint: "Results" },
  { href: "/demo", label: "在线展示", icon: PlaySquare, hint: "Demo" },
];

const SIDEBAR_STORAGE_KEY = "fog-layout.sidebar-collapsed";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1";
  });
  const [sidebarReady, setSidebarReady] = useState(() => typeof window !== "undefined");
  const desktopSidebarWidth = sidebarCollapsed ? "6rem" : "18rem";

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setSidebarCollapsed(window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1");
    setSidebarReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !sidebarReady) {
      return;
    }
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, sidebarCollapsed ? "1" : "0");
  }, [sidebarCollapsed, sidebarReady]);

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ "--desktop-sidebar-width": desktopSidebarWidth } as React.CSSProperties}>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden overflow-hidden border-r border-border/80 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--card)_94%,transparent),color-mix(in_srgb,var(--background)_88%,transparent))] backdrop-blur md:flex md:flex-col md:w-[var(--desktop-sidebar-width)]",
          sidebarReady ? "sidebar-shell opacity-100" : "opacity-0",
        )}
      >
        <div className="border-b border-border/80 px-5 py-5">
          <div className={cn("flex gap-3", sidebarCollapsed ? "flex-col items-center" : "items-start justify-between")}>
            <div className={cn("flex", sidebarCollapsed ? "flex-col items-center" : "items-start gap-3")}>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-chart-1/20 bg-chart-1/10">
                <Compass className="h-5 w-5 text-chart-1" />
              </div>
              <div className={cn("sidebar-copy sidebar-copy-vertical", sidebarCollapsed && "is-collapsed")}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Fog Operations Console</p>
                <h1 className="font-display mt-2 text-[1.05rem] font-semibold text-foreground">雾天分割控制台</h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  面向训练监控、实验证据和答辩演示的统一前台。
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background/92 text-muted-foreground shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition-colors hover:bg-muted hover:text-foreground"
              aria-label={sidebarCollapsed ? "展开侧栏" : "收起侧栏"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                title={sidebarCollapsed ? item.label : undefined}
                className={cn(
                  "sidebar-nav-link flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors",
                  active
                    ? "border-chart-1/15 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--chart-1)_92%,white_8%),color-mix(in_srgb,var(--chart-4)_76%,var(--chart-1)))] text-white shadow-[0_12px_28px_rgba(35,115,154,0.22)]"
                    : "border-transparent text-muted-foreground hover:border-border/80 hover:bg-muted/60 hover:text-foreground",
                  sidebarCollapsed && "grid h-16 w-16 place-items-center px-0 py-0",
                )}
              >
                <span className={sidebarCollapsed ? "flex h-6 w-6 items-center justify-center" : "flex h-4 w-4 items-center justify-center"}>
                  <Icon className="h-4 w-4" />
                </span>
                {!sidebarCollapsed ? (
                  <div className="sidebar-copy min-w-0">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className={cn("text-[11px]", active ? "text-background/75" : "text-muted-foreground/80")}>{item.hint}</div>
                  </div>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/80 px-4 py-4">
          <div className={cn("flex items-center rounded-2xl border border-border/70 bg-background/75 px-4 py-3", sidebarCollapsed ? "justify-center" : "justify-between")}>
            {!sidebarCollapsed ? (
              <div className="sidebar-copy min-w-0">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Theme</div>
                <div className="mt-1 text-sm text-foreground">雾感配色</div>
              </div>
            ) : null}
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/92 backdrop-blur md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Fog Operations Console</div>
            <div className="font-display-soft text-sm font-semibold text-foreground">雾天分割控制台</div>
          </div>
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-2.5 py-1.5 text-xs",
                  pathname === item.href ? "bg-foreground text-background" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className={cn("min-h-screen pt-14 md:pt-0", sidebarReady ? "sidebar-offset md:pl-[var(--desktop-sidebar-width)]" : "md:pl-[var(--desktop-sidebar-width)]")}>
        <div className="app-route-enter">{children}</div>
      </main>
    </div>
  );
}
