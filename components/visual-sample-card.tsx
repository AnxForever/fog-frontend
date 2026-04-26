"use client";

import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import { createPortal } from "react-dom";

type VisualSampleCardProps = {
  index: number;
  src: string | null;
  city: string;
  sceneId: string;
  beta: string;
  note?: string;
  emptyText?: string;
  imageHeightClassName?: string;
  roundedClassName?: string;
};

export function VisualSampleCard({
  index,
  src,
  city,
  sceneId,
  beta,
  note,
  emptyText = "样本路径缺失",
  imageHeightClassName = "h-56",
  roundedClassName = "rounded-[1.8rem]",
}: VisualSampleCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <article className={`thesis-surface ${roundedClassName} p-4`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Eye className="h-4 w-4" />
            样本 {index + 1}
          </div>
          <div className="thesis-badge">雾浓度 {beta}</div>
        </div>

        {src ? (
          <button type="button" onClick={() => setOpen(true)} className="group block w-full text-left" aria-label={`放大查看样本 ${index + 1}`}>
            <div className="relative overflow-hidden rounded-[1.2rem] border border-border/70">
              <img
                src={src}
                alt={`visual sample ${index + 1}`}
                className={`${imageHeightClassName} w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]`}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-[linear-gradient(180deg,transparent,rgba(8,20,28,0.72))] px-4 py-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="text-sm font-medium text-white">点击放大查看</span>
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white">预览</span>
              </div>
            </div>
          </button>
        ) : (
          <div className={`flex ${imageHeightClassName} items-center justify-center rounded-[1.2rem] border border-dashed border-border/80 bg-muted/35 text-sm text-muted-foreground`}>
            {emptyText}
          </div>
        )}

        <dl className="mt-4 grid gap-2 rounded-[1.2rem] border border-border/70 bg-background/72 p-3 text-sm">
          <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-2">
            <dt className="shrink-0 whitespace-nowrap text-muted-foreground">城市</dt>
            <dd className="min-w-0 text-right font-medium text-foreground">{city}</dd>
          </div>
          <div className={note ? "flex items-start justify-between gap-3 border-b border-border/70 pb-2" : "flex items-start justify-between gap-3"}>
            <dt className="shrink-0 whitespace-nowrap text-muted-foreground">样本编号</dt>
            <dd className="min-w-0 break-all text-right font-mono text-[0.82rem] text-foreground">{sceneId}</dd>
          </div>
          {note ? (
            <div className="flex items-start justify-between gap-3">
              <dt className="shrink-0 whitespace-nowrap text-muted-foreground">说明</dt>
              <dd className="min-w-0 text-right text-foreground">{note}</dd>
            </div>
          ) : null}
        </dl>
      </article>

      {mounted && open && src
        ? createPortal(
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(8,18,24,0.82)] px-4 py-6 backdrop-blur-sm" onClick={() => setOpen(false)}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-black/28 text-white transition-colors hover:bg-black/44"
                aria-label="关闭放大预览"
              >
                <X className="h-5 w-5" />
              </button>
              <div
                className="w-full max-w-6xl rounded-[1.6rem] border border-white/12 bg-[rgba(9,20,26,0.52)] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.34)]"
                onClick={(event) => event.stopPropagation()}
              >
                <img src={src} alt={`visual sample enlarged ${index + 1}`} className="max-h-[84vh] w-full rounded-[1.2rem] object-contain" />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
