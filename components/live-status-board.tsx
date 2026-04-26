"use client";

import { useEffect, useState } from "react";
import { Activity, Database, HardDrive, RefreshCcw, ShieldCheck, TimerReset } from "lucide-react";
import type { DashboardData } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

function yesNo(v?: boolean) {
  if (v === true) return "正常";
  if (v === false) return "异常";
  return "未知";
}

function phaseLabel(stage?: string) {
  if (!stage) return "等待写入";
  return stage;
}

function progressLabel(data: DashboardData | null) {
  const progress = data?.status?.progress;
  if (!progress?.current || !progress?.total) return "n/a";
  return `${progress.current}/${progress.total}${typeof progress.percent === "number" ? ` · ${progress.percent}%` : ""}`;
}

const cards = [
  { key: "stage", label: "当前阶段", icon: Activity },
  { key: "health", label: "状态健康度", icon: ShieldCheck },
  { key: "disk", label: "磁盘剩余", icon: HardDrive },
  { key: "summary", label: "实验汇总行数", icon: Database },
  { key: "logAge", label: "日志新鲜度", icon: TimerReset },
];

export function LiveStatusBoard({
  initialData,
  compact = false,
  className,
}: {
  initialData: DashboardData;
  compact?: boolean;
  className?: string;
}) {
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let stopped = false;

    const update = async () => {
      try {
        setRefreshing(true);
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        if (!response.ok) return;
        const next = (await response.json()) as DashboardData;
        if (!stopped) setData(next);
      } finally {
        if (!stopped) setRefreshing(false);
      }
    };

    const timer = window.setInterval(update, 20000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, []);

  const status = data.status;

  const cardValues: Record<string, string> = {
    stage: phaseLabel(status?.stage),
    health: yesNo(status?.healthy),
    disk: typeof status?.disk?.free_gb === "number" ? `${status.disk.free_gb.toFixed(1)} GB` : "n/a",
    summary: String(data.summaryRows.length),
    logAge: typeof status?.log_age_minutes === "number" ? `${status.log_age_minutes} min` : "n/a",
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="fog-badge">
          <span className={cn("fog-signal", status?.healthy ? "bg-chart-2" : "bg-chart-3")} />
          实时状态面板
        </div>
        <button
          type="button"
          onClick={async () => {
            setRefreshing(true);
            try {
              const response = await fetch("/api/dashboard", { cache: "no-store" });
              if (!response.ok) return;
              setData((await response.json()) as DashboardData);
            } finally {
              setRefreshing(false);
            }
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          <RefreshCcw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
          刷新
        </button>
      </div>

      <div className={cn("grid gap-3", compact ? "md:grid-cols-3 xl:grid-cols-5" : "md:grid-cols-2 xl:grid-cols-5")}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.key} className="fog-card app-hover-lift rounded-[1.5rem] p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background/70">
                <Icon className="h-4 w-4 text-foreground/80" />
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{card.label}</div>
              <div className="mt-2 text-base font-semibold text-foreground">{cardValues[card.key]}</div>
            </div>
          );
        })}
      </div>

      <div className="fog-card rounded-[1.7rem] p-4 md:p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Activity className="h-4 w-4" />
          当前进度
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="text-xl font-semibold text-foreground">{progressLabel(data)}</div>
          <div className="fog-badge">{data.bestVariant?.variant ?? "variant 待定"}</div>
        </div>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {status?.pipeline_running
            ? "主流程正在远端推进。这个面板会自动轮询最新状态文件，不需要手动刷新整个网页。"
            : "当前没有检测到主流程仍在运行，适合回头检查状态文件、日志或自动恢复记录。"}
        </p>
      </div>
    </div>
  );
}
