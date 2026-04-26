import Link from "next/link";
import { ArrowUpRight, Bot, Cpu, Globe, Layers3, MonitorSmartphone, ServerCog, WandSparkles } from "lucide-react";
import { DemoWorkbench } from "@/components/demo-workbench";
import { MetricCard } from "@/components/ui/metric-card";
import { VisualSampleCard } from "@/components/visual-sample-card";
import { SectionHeader } from "@/components/ui/section-header";
import { loadDashboardData } from "@/lib/dashboard-data";
import { resolveDemoRuntime } from "@/lib/demo-runtime";
import { parseSampleMeta } from "@/lib/visual-sample-meta";

const demoUrl = process.env.NEXT_PUBLIC_DEMO_URL;

const demoSteps = [
  {
    title: "输入雾天道路图像",
    description: "答辩时可以导入数据集外的真实雾天道路图，避免只展示训练集内样本。",
  },
  {
    title: "切换预处理方式",
    description: "展示 none / CLAHE / Gamma / Retinex 的差异，再比较它们对分割结果的影响。",
  },
  {
    title: "输出分割与 overlay",
    description: "同时呈现原图、预处理图、语义分割图和叠加效果，更适合现场讲述效果差异。",
  },
];

export default async function DemoPage() {
  const [runtime, data] = await Promise.all([resolveDemoRuntime(), loadDashboardData()]);
  const runtimeLevel = runtime.device.startsWith("cuda") ? "本地推理可用" : "建议先用纯展示模式";
  const runtimeHint = runtime.device.startsWith("cuda")
    ? "如果是 3050 级别显卡，单图推理优先用 FP16，答辩演示通常够用。"
    : "如果她电脑环境配不好，也没关系，单靠已导出的样本图和结果表就能完整展示。";

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
      </div>

      <section className="mt-8">
        <DemoWorkbench
          runtimeReady={runtime.ready}
          defaultConfig={runtime.config.replace(`${runtime.repoRoot}/`, "")}
          defaultCheckpoint={runtime.checkpoint ? runtime.checkpoint.replace(`${runtime.repoRoot}/`, "") : null}
          defaultDevice={runtime.device}
        />
      </section>

      <section className="mt-8">
        <SectionHeader
          tag="Presentation Mode"
          title="纯展示模式"
          description="如果她本地环境太差，或者 3050 那边临时装不好 Python / mmseg，这一块仍然可以直接展示已经导出的最终结果。"
        />

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="thesis-shell fog-grid rounded-[2rem] p-5 md:p-6">
            <div className="space-y-4 text-sm leading-8 text-muted-foreground">
              <p>
                这套展示模式不依赖实时推理，只读取已经取回的 `retrieved_artifacts/`。也就是说，她哪怕只是普通 Windows 笔记本，只要能跑前端，就能把实验结果、最佳模型、可视化样本和汇总表完整讲清楚。
              </p>
              <div className="rounded-[1.35rem] border border-border/70 bg-background/82 p-4">
                <div className="text-sm font-semibold text-foreground">建议给她的优先级</div>
                <div className="mt-2">1. 先跑纯展示模式，确保答辩一定能讲。</div>
                <div>2. 如果她的 3050 本机环境顺利，再补本地单图推理模式。</div>
                <div>3. 不要把答辩成败压在现场临时装 CUDA / mmseg 上。</div>
              </div>
              <div className="rounded-[1.35rem] border border-border/70 bg-background/82 p-4">
                <div className="text-sm font-semibold text-foreground">当前已取回的本地成果</div>
                <div className="mt-2 break-all">最佳权重：{runtime.checkpoint ? runtime.checkpoint.replace(`${runtime.repoRoot}/`, "") : "未找到"}</div>
                <div>素材清单：{data.latestManifestPath ?? "未找到 manifest"}</div>
                <div>可视化样本：{data.visualSamples.length} 张</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                  imageHeightClassName="h-52"
                  roundedClassName="rounded-[1.6rem]"
                />
              );
            })}
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="thesis-shell fog-grid rounded-[2rem] p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
                <MonitorSmartphone className="h-4 w-4 text-foreground/84" />
              </div>
              <div>
                <h2 className="font-display-soft text-[1.25rem] font-semibold text-foreground">在线展示窗口</h2>
                <p className="text-sm text-muted-foreground">如果已经部署推理页，可以直接内嵌到这里。</p>
              </div>
            </div>
            {demoUrl ? (
              <Link
                href={demoUrl}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background/88 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted/60"
              >
                新窗口打开
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          {demoUrl ? (
            <div className="overflow-hidden rounded-[1.5rem] border border-border/80 bg-background/80">
              <iframe src={demoUrl} title="Fog segmentation demo" className="h-[720px] w-full bg-background" />
            </div>
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-border/80 bg-background/84 p-6">
              <div className="flex items-center gap-3 text-foreground">
                <Globe className="h-4 w-4" />
                <span className="font-medium">当前还没有配置 `NEXT_PUBLIC_DEMO_URL`。</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                这不影响展示站本身。等你把在线推理服务部署出来后，只要给前端一个 URL，这里就能直接嵌进去，不需要改页面结构。
              </p>
              <div className="thesis-code mt-4 rounded-[1.25rem]">
                <div>NEXT_PUBLIC_DEMO_URL=http://127.0.0.1:7860</div>
                <div>npm run dev</div>
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-4">
          <article className="thesis-surface rounded-[1.8rem] p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
              <Layers3 className="h-4 w-4 text-foreground/84" />
            </div>
            <h3 className="text-base font-semibold text-foreground">为什么不用 Gradio 做主展示层</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Gradio 更适合快速起一个机器学习 demo，但不适合承载完整的毕设展示、实验组织和论文素材结构。我这里把它降成可选的推理后端入口，主展示层改成更成熟的 Next.js 前端。
            </p>
          </article>

          <article className="thesis-surface rounded-[1.8rem] p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
              <ServerCog className="h-4 w-4 text-foreground/84" />
            </div>
            <h3 className="text-base font-semibold text-foreground">后续接真实推理的方式</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              最稳的方式是保留 Python 侧推理服务，前端只做输入、状态和结果展示。这样模型更新不会影响站点结构，答辩时也更稳定。
            </p>
          </article>

          <article className="thesis-surface rounded-[1.8rem] p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
              <Bot className="h-4 w-4 text-foreground/84" />
            </div>
            <h3 className="text-base font-semibold text-foreground">现有后端可直接接入</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              你仓库里已经有 `src/demo/gradio_app.py` 和 `scripts/infer_demo.py`。后面要真跑演示，可以直接把它起到 7860 端口，再由这个页面内嵌或跳转。
            </p>
            <div className="thesis-code mt-4 rounded-[1.25rem]">
              <div>python scripts/infer_demo.py \</div>
              <div>  --config configs/experiments/segformer_b2_full.py \</div>
              <div>  --checkpoint work_dirs/xxx/best_mIoU_iter_xxx.pth</div>
            </div>
          </article>

          <article className="thesis-surface rounded-[1.8rem] p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
              <Cpu className="h-4 w-4 text-foreground/84" />
            </div>
            <h3 className="text-base font-semibold text-foreground">建议的答辩演示流程</h3>
            <div className="mt-3 space-y-3">
              {demoSteps.map((step, index) => (
                <div key={step.title} className="rounded-[1.2rem] border border-border/70 bg-background/86 p-3">
                  <div className="text-sm font-semibold text-foreground">
                    {index + 1}. {step.title}
                  </div>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>

      <section className="mt-8">
        <div className="thesis-shell fog-grid rounded-[2rem] p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
              <WandSparkles className="h-4 w-4 text-foreground/84" />
            </div>
            <div>
              <h2 className="font-display-soft text-[1.25rem] font-semibold text-foreground">这套展示站的定位</h2>
              <p className="text-sm text-muted-foreground">不是训练脚本替身，而是你的研究结果前台。</p>
            </div>
          </div>
          <p className="max-w-4xl text-sm leading-8 text-muted-foreground">
            现在这套网页已经能承担项目概览、实验状态、结果表和可视化素材展示。后续如果你要把真实的在线推理功能补进来，
            我建议把 Python 推理服务挂到单独端口，再由这个 Next.js 前端通过 iframe 或 API 调用承接交互层。这样兼顾好看、稳定和答辩可控性。
          </p>
        </div>
      </section>
    </div>
  );
}
