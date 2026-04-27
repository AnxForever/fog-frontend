import Link from "next/link";
import { ArrowUpRight, Globe, Layers3, MonitorSmartphone, ServerCog, WandSparkles } from "lucide-react";
import { DemoWorkbench } from "@/components/demo-workbench";
import { MetricCard } from "@/components/ui/metric-card";
import { VisualSampleCard } from "@/components/visual-sample-card";
import { SectionHeader } from "@/components/ui/section-header";
import { loadDashboardData } from "@/lib/dashboard-data";
import { resolveDemoRuntime } from "@/lib/demo-runtime";
import { parseSampleMeta } from "@/lib/visual-sample-meta";

export const dynamic = "force-dynamic";

const demoUrl = process.env.NEXT_PUBLIC_DEMO_URL;
const FINAL_MODEL_NAME = "segformer_b2_none_betaall_512x1024_s42_final";
const FINAL_MODEL_SCORE = "slide + TTA · mIoU 80.42";

const presentationPriorities = [
  "先跑纯展示模式，确保答辩一定能讲。",
  "如果她的 3050 本机环境顺利，再补本地单图推理模式。",
  "不要把答辩成败压在现场临时装 CUDA / mmseg 上。",
];

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
  const [runtime, data] = await Promise.all([resolveDemoRuntime(), loadDashboardData()]);
  const runtimeLevel = runtime.device.startsWith("cuda") ? "本地推理可用" : "建议先用纯展示模式";
  const runtimeHint = runtime.device.startsWith("cuda")
    ? "如果是 3050 级别显卡，单图推理优先用 FP16，答辩演示通常够用。"
    : "如果她电脑环境配不好，也没关系，单靠已导出的样本图和结果表就能完整展示。";
  const configLabel = displayRuntimePath(runtime.config, runtime.repoRoot) ?? "未知";
  const checkpointLabel = displayRuntimePath(runtime.checkpoint, runtime.repoRoot) ?? "未找到";
  const manifestLabel = data.latestManifestPath ?? "未找到 manifest";

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

      <section className="mt-8">
        <SectionHeader
          tag="Presentation Mode"
          title="纯展示模式"
          description="如果她本地环境太差，或者 3050 那边临时装不好 Python / mmseg，这一块仍然可以直接展示已经导出的最终结果。"
        />

        <div className="space-y-5">
          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <div className="thesis-shell fog-grid rounded-[2rem] p-5 md:p-6">
              <div className="space-y-5 text-sm leading-8 text-muted-foreground">
                <p className="max-w-3xl">
                  这套展示模式不依赖实时推理，只读取已经取回的 `retrieved_artifacts/`。也就是说，她哪怕只是普通 Windows 笔记本，只要能跑前端，就能把实验结果、最佳模型、可视化样本和汇总表完整讲清楚。
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {presentationPriorities.map((item, index) => (
                    <div key={item} className="rounded-[1.35rem] border border-border/70 bg-background/82 p-4">
                      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-secondary/65 text-sm font-semibold text-foreground">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-7 text-foreground/88">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="thesis-surface rounded-[2rem] p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">当前已取回的本地成果</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">把最关键的答辩素材单独收在这里，方便现场快速确认。</p>
                </div>
                <div className="thesis-badge">Presentation Ready</div>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="rounded-[1.2rem] border border-border/70 bg-background/78 p-4">
                  <dt className="text-muted-foreground">最佳权重</dt>
                  <dd className="mt-2 break-all font-medium text-foreground">{checkpointLabel}</dd>
                </div>
                <div className="rounded-[1.2rem] border border-border/70 bg-background/78 p-4">
                  <dt className="text-muted-foreground">最终模型</dt>
                  <dd className="mt-2 break-all font-medium text-foreground">{FINAL_MODEL_NAME}</dd>
                  <div className="mt-2 text-xs text-muted-foreground">SegFormer-B2 · none · all-beta training · slide + TTA</div>
                </div>
                <div className="rounded-[1.2rem] border border-border/70 bg-background/78 p-4">
                  <dt className="text-muted-foreground">素材清单</dt>
                  <dd className="mt-2 break-all font-medium text-foreground">{manifestLabel}</dd>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-border/70 bg-background/78 p-4">
                    <dt className="text-muted-foreground">可视化样本</dt>
                    <dd className="mt-2 text-xl font-semibold text-foreground">{data.visualSamples.length} 张</dd>
                  </div>
                  <div className="rounded-[1.2rem] border border-border/70 bg-background/78 p-4">
                    <dt className="text-muted-foreground">推荐策略</dt>
                    <dd className="mt-2 text-base font-semibold text-foreground">{runtimeLevel}</dd>
                  </div>
                </div>
              </dl>
            </aside>
          </div>

          <div className="thesis-shell fog-grid rounded-[2rem] p-5 md:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h3 className="font-display-soft text-[1.18rem] font-semibold text-foreground">本地可视化样本画廊</h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                  这一排专门展示已经导出的分割结果。卡片放大后可以直接拿来讲样本差异，不需要再在文件夹里翻图。
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1.5">样本数 {data.visualSamples.length}</span>
                <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1.5">{runtimeLevel}</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {data.visualSamples.map((sample, index) => {
                const src = sample.output_path ? `/api/artifact?path=${encodeURIComponent(sample.output_path)}` : null;
                const meta = parseSampleMeta(sample);
                return (
                  <VisualSampleCard
                    key={`${sample.output_path ?? sample.image_path ?? index}`}
                    index={index}
                    src={src}
                    city={meta.city}
                    sceneId={meta.sceneId}
                    beta={meta.beta}
                    imageHeightClassName="h-60 md:h-64"
                    roundedClassName="rounded-[1.7rem]"
                  />
                );
              })}
            </div>
          </div>
        </div>
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
