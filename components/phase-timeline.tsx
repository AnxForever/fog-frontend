import { CheckCircle2, CircleDashed, LoaderCircle, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const phases = [
  { key: "data", label: "数据准备", hints: ["synthesis", "dataset"] },
  { key: "cache", label: "缓存构建", hints: ["cache", "clahe", "gamma", "retinex", "beta_"] },
  { key: "screening", label: "方案筛选", hints: ["screening", "variant"] },
  { key: "training", label: "正式训练", hints: ["training", "train"] },
  { key: "artifacts", label: "结果导出", hints: ["artifact", "export", "complete"] },
];

function phaseIndex(stage?: string) {
  const normalized = (stage ?? "").toLowerCase();
  const found = phases.findIndex((phase) => phase.hints.some((hint) => normalized.includes(hint)));
  return found === -1 ? 0 : found;
}

export function PhaseTimeline({ stage }: { stage?: string }) {
  const current = phaseIndex(stage);

  return (
    <div className="grid gap-3 md:grid-cols-5">
      {phases.map((phase, index) => {
        const done = index < current;
        const active = index === current;
        const Icon = done ? CheckCircle2 : active ? LoaderCircle : CircleDashed;
        return (
          <div
            key={phase.key}
            className={cn(
              "fog-card rounded-[1.5rem] p-4",
              active && "ring-1 ring-chart-1/35",
              done && "border-chart-2/25",
            )}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Phase {index + 1}</div>
              <Icon className={cn("h-4 w-4", done && "text-chart-2", active && "animate-spin text-chart-1", !done && !active && "text-muted-foreground/70")} />
            </div>
            <div className="text-sm font-semibold text-foreground">{phase.label}</div>
            <div className="mt-2 text-xs leading-6 text-muted-foreground">
              {active ? "当前活跃阶段" : done ? "已完成并已推进" : "等待进入"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
