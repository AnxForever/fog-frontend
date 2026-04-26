import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  tag?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({ tag, title, description, align = "left", className }: SectionHeaderProps) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", "mb-8", className)}>
      {tag ? (
        <span className="mb-3 inline-block rounded-full border border-border/70 bg-secondary/55 px-3.5 py-1 text-xs font-medium text-muted-foreground">
          {tag}
        </span>
      ) : null}
      <h2 className="font-display-soft text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">{description}</p> : null}
    </div>
  );
}
