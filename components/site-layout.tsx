"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Compass, Home, PlaySquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页", icon: Home, hint: "Overview" },
  { href: "/experiments", label: "实验结果", icon: BarChart3, hint: "Results" },
  { href: "/demo", label: "在线展示", icon: PlaySquare, hint: "Demo" },
];

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border/80 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--card)_94%,transparent),color-mix(in_srgb,var(--background)_88%,transparent))] backdrop-blur md:flex">
        <div className="border-b border-border/80 px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-chart-1/20 bg-chart-1/10">
              <Compass className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Fog Operations Console</p>
              <h1 className="font-display mt-2 text-[1.05rem] font-semibold text-foreground">雾天分割控制台</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                面向训练监控、实验证据和答辩演示的统一前台。
              </p>
            </div>
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
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors",
                  active
                    ? "border-chart-1/15 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--chart-1)_92%,white_8%),color-mix(in_srgb,var(--chart-4)_76%,var(--chart-1)))] text-white shadow-[0_12px_28px_rgba(35,115,154,0.22)]"
                    : "border-transparent text-muted-foreground hover:border-border/80 hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className={cn("text-[11px]", active ? "text-background/75" : "text-muted-foreground/80")}>{item.hint}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/80 px-4 py-4">
          <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/75 px-4 py-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Theme</div>
              <div className="mt-1 text-sm text-foreground">雾感配色</div>
            </div>
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

      <main className="min-h-screen pt-14 md:ml-72 md:pt-0">
        <div className="app-route-enter">{children}</div>
      </main>
    </div>
  );
}
