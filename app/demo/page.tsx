import Link from "next/link";
import { ArrowUpRight, Globe, Layers3, MonitorSmartphone, ServerCog, WandSparkles } from "lucide-react";
import { DemoWorkbench } from "@/components/demo-workbench";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeader } from "@/components/ui/section-header";
import { resolveDemoRuntime } from "@/lib/demo-runtime";

export const dynamic = "force-dynamic";

const demoUrl = process.env.NEXT_PUBLIC_DEMO_URL;
const FINAL_MODEL_NAME = "segformer_b2_none_betaall_512x1024_s42_final";
const FINAL_MODEL_SCORE = "slide + TTA · mIoU 80.42";

const supportNotes = [
  {
    icon: Layers3,
    title: "为什么不用 Gradio 做主展示层",
    description: "Gradio 适合快速起 demo，但不适合承载完整的毕设叙事、实验组织和结果归档。",
  },
  {
    icon: ServerCog,
    title: "当前后端接入方式",
    description: "真实推理已经由 Python 服务承接，前端只负责输入、状态和结果展示，结构更稳。",
  },
  {
    icon: WandSparkles,
    title: "这套页面的定位",
    description: "它不是训练脚本替身，而是你的研究结果前台，重点是讲清实验、样本和效果。",
  },
];

function displayRuntimePath(value: string | null, repoRoot: string) {
  if (!value) return null;
  return value.startsWith(`${repoRoot}/`) ? value.replace(`${repoRoot}/`, "") : value;
}

export default async function DemoPage() {
  const runtime = await resolveDemoRuntime();
  const runtimeLevel = runtime.device.startsWith("cuda") ? "本地推理可用" : "建议先用纯展示模式";
  const runtimeHint = runtime.device.startsWith("cuda")
    ? "如果是 3050 级别显卡，单图推理优先用 FP16，答辩演示通常够用。"
    : "如果她电脑环境配不好，也没关系，单靠已导出的样本图和结果表就能完整展示。";
  const configLabel = displayRuntimePath(runtime.config, runtime.repoRoot) ?? "未知";
  const checkpointLabel = displayRuntimePath(runtime.checkpoint, runtime.repoRoot) ?? "未找到";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <SectionHeader
        tag="Demo & Deployment"
        title="答辩演示页"
        description="这页保留高级前端展示层，同时预留在线推理容器。后续要挂真实推理服务，只需要给前端一个可访问的 URL。"
      />

      <div className="app-stagger grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="前端技术栈" value="Next.js 16" hint="App Router + Server Components" compact />
        <MetricCard label="UI 技术" value="React 19" hint="Tailwind CSS 4 + next-themes" compact />
        <MetricCard label="演示容器" value={demoUrl ? "已接入" : "待接入"} hint="支持 iframe 嵌入在线推理页" compact />
        <MetricCard label="本机状态" value={runtimeLevel} hint={runtimeHint} compact />
        <MetricCard label="最终模型" value="SegFormer-B2" hint={FINAL_MODEL_NAME} compact />
        <MetricCard label="最终成绩" value="mIoU 80.42" hint={FINAL_MODEL_SCORE} compact />
      </div>

      <section className="mt-8">
        <DemoWorkbench
          runtimeReady={runtime.ready}
          defaultConfig={configLabel}
          defaultCheckpoint={checkpointLabel === "未找到" ? null : checkpointLabel}
          defaultDevice={runtime.device}
        />
      </section>

      {demoUrl ? (
        <section className="mt-8 thesis-shell fog-grid rounded-[2rem] p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
                <MonitorSmartphone className="h-4 w-4 text-foreground/84" />
              </div>
              <div>
                <h2 className="font-display-soft text-[1.25rem] font-semibold text-foreground">在线展示窗口</h2>
                <p className="text-sm text-muted-foreground">只有接入外部推理页时，这里才展开完整嵌入窗口。</p>
              </div>
            </div>
            <Link
              href={demoUrl}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background/88 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted/60"
            >
              新窗口打开
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-border/80 bg-background/80">
            <iframe src={demoUrl} title="Fog segmentation demo" className="h-[720px] w-full bg-background" />
          </div>
        </section>
      ) : (
        <section className="mt-8 thesis-surface rounded-[1.8rem] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
              <Globe className="h-4 w-4 text-foreground/84" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">当前直接使用站内推理工作台</h2>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">外部 iframe 没配时，不再保留大面积占位区，页面重点放在上传、推理和结果展示。</p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="grid gap-4 xl:grid-cols-3">
          {supportNotes.map((note) => {
            const Icon = note.icon;
            return (
              <article key={note.title} className="thesis-surface rounded-[1.8rem] p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
                  <Icon className="h-4 w-4 text-foreground/84" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{note.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{note.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
