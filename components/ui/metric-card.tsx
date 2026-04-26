import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  className?: string;
};

export function MetricCard({ label, value, hint, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[1.65rem] border border-border/75 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--card)_94%,white_6%),color-mix(in_srgb,var(--background)_92%,var(--secondary)_8%))] p-4 shadow-[0_16px_34px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-[0_22px_50px_rgba(15,23,42,0.11)]",
        className,
      )}
    >
      <div className="absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--chart-1)_55%,var(--border)),transparent)]" />
      <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-3 text-[1.65rem] font-semibold tracking-[-0.04em] text-foreground md:text-[2rem]">{value}</div>
      {hint ? <div className="mt-2 max-w-[24ch] text-xs leading-6 text-muted-foreground">{hint}</div> : null}
    </div>
  );
}
