import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  className?: string;
  compact?: boolean;
};

export function MetricCard({ label, value, hint, className, compact = false }: MetricCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.6rem] border border-border/70 bg-background/92 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(15,23,42,0.07)]",
        compact ? "p-3.5" : "p-5",
        className,
      )}
    >
      <div>
        <div
          className={cn(
            "mb-1 break-words font-semibold tracking-tight text-foreground",
            compact ? "text-[1.05rem] leading-[1.18] md:text-[1.18rem]" : "text-3xl leading-[0.98] md:text-4xl lg:text-[2.6rem]",
          )}
        >
          {value}
        </div>
        <div className={cn("font-medium text-muted-foreground", compact ? "text-[11px] md:text-xs" : "text-sm md:text-base")}>{label}</div>
        {hint ? (
          <div className={cn("break-words text-muted-foreground", compact ? "mt-0.5 text-[10px] leading-5 md:text-[11px]" : "mt-1 text-xs md:text-sm")}>
            {hint}
          </div>
        ) : null}
      </div>
    </div>
  );
}
