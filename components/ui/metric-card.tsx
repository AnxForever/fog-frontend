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
        "rounded-[1.6rem] border border-border/70 bg-background/92 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(15,23,42,0.07)]",
        className,
      )}
    >
      <div className="text-[1.55rem] font-semibold tracking-tight text-foreground md:text-[1.9rem]">{value}</div>
      <div className="mt-1 text-sm font-medium text-muted-foreground">{label}</div>
      {hint ? <div className="mt-2 text-xs leading-6 text-muted-foreground">{hint}</div> : null}
    </div>
  );
}
