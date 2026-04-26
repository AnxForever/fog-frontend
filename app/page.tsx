import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CloudFog,
  Database,
  HardDrive,
  Image as ImageIcon,
  Layers3,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { LiveStatusBoard } from "@/components/live-status-board";
import { PhaseTimeline } from "@/components/phase-timeline";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeader } from "@/components/ui/section-header";
import { loadDashboardData } from "@/lib/dashboard-data";

function statusText(stage?: string) {
  if (!stage) return "等待结果写入";
  return stage;
}

function yesNo(v?: boolean) {
  if (v === true) return "正常";
  if (v === false) return "异常";
  return "未知";
}

const flowCards = [
  {
    icon: Database,
    title: "数据构建",
    description: "基于 Cityscapes 与合成雾图数据，统一整理训练、验证和论文素材导出链路。",
  },
  {
    icon: Sparkles,
    title: "传统预处理",
    description: "围绕 CLAHE、Gamma、Retinex 等简单增强方法做离线缓存与对照实验。",
  },
  {
    icon: Radar,
    title: "Variant Screening",
    description: "先筛选最优预处理方案，再把最佳 variant 送入正式训练，避免盲目全量训练。",
  },
  {
    icon: BrainCircuit,
    title: "正式训练与评估",
    description: "以语义分割模型为主干，持续输出 mIoU、精度、最佳权重和可视化结果。",
  },
];

const deliveryCards = [
  {
    icon: Workflow,
    title: "完整工程链路",
    text: "从雾图合成、坏图修复、缓存构建到筛选、训练、测试和论文素材导出，全部自动化串起来。",
  },
  {
    icon: ShieldCheck,
    title: "监控与容错",
    text: "加入了状态文件、自动恢复、低磁盘清理、断点续跑与邮件告警，不再靠人盯着日志。",
  },
  {
    icon: ImageIcon,
    title: "展示与答辩",
    text: "网页统一承接项目概览、实验结果、进度状态与后续在线推理演示，适合毕业设计验收展示。",
  },
];

export default async function HomePage() {
  const data = await loadDashboardData();
  const status = data.status;
  const summaryCount = data.summaryRows.length;

  return (
    <div>
      <section className="thesis-hero border-b border-border/80">
        <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10 xl:py-12">
          <div className="thesis-orb app-float-orb left-[-4rem] top-6 h-36 w-36 bg-chart-3/15 md:h-48 md:w-48" />
          <div className="thesis-orb app-float-orb app-float-orb-delayed right-[-2rem] top-0 h-44 w-44 bg-chart-1/15 md:h-64 md:w-64" />

          <div className="grid gap-8 xl:grid-cols-[1.35fr_0.85fr]">
            <div className="space-y-8">
              <div className="app-stagger-tight flex flex-wrap gap-2.5">
                <div className="thesis-kicker">Fog Operations Console</div>
                <div className="thesis-chip">Research Dashboard</div>
                <div className="thesis-chip">Live Status + Demo Ready</div>
              </div>

              <div className="max-w-5xl space-y-5 app-panel-enter">
                <h1 className="font-display text-[2.7rem] font-semibold leading-[0.94] text-foreground md:text-[4.5rem] xl:text-[5.7rem]">
                  雾天道路语义分割
                  <span className="mt-2 block text-[0.56em] leading-[1.02] text-foreground/88">实验控制台与答辩展示前台</span>
                </h1>
                <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-[1.08rem]">
                  这套前端不再沿用之前网站的纸面气质，而是换成偏雾感、监控台式的研究界面。它直接接训练状态、实验汇总、最佳 variant 和论文素材，让你的毕设同时具备讲解、监控和验收展示能力。
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/experiments"
                    className="inline-flex items-center gap-2 rounded-2xl border border-foreground bg-foreground px-5 py-3 text-sm font-medium text-background shadow-[0_14px_34px_rgba(15,23,42,0.12)] transition-all hover:-translate-y-0.5 hover:opacity-95"
                  >
                    查看实验结果
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background/88 px-5 py-3 text-sm font-medium text-foreground shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:bg-muted/60"
                  >
                    打开展示页
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="app-stagger grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="当前阶段" value={statusText(status?.stage)} />
                <MetricCard label="状态健康度" value={yesNo(status?.healthy)} />
                <MetricCard label="最佳 Variant" value={data.bestVariant?.variant ?? "筛选中"} />
                <MetricCard label="实验汇总行数" value={String(summaryCount)} hint="前端会直接读取 summary.csv。" />
              </div>
            </div>

            <aside className="thesis-shell fog-grid app-panel-enter rounded-[2rem] p-5 xl:sticky xl:top-8">
              <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Mission Status</p>
                  <h2 className="font-display-soft mt-1 text-[1.3rem] font-semibold text-foreground">当前任务快照</h2>
                </div>
                <div className="thesis-badge">
                  <span className={`thesis-dot ${status?.healthy ? "text-chart-2" : "text-chart-3"}`} />
                  {status?.healthy ? "Healthy" : "Pending"}
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-[1.6rem] border border-border/70 bg-background/84 p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Pipeline</div>
                  <div className="mt-2 text-lg font-semibold text-foreground">{statusText(status?.stage)}</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {status?.pipeline_running
                      ? "主流程进程仍在运行，后续 screening、训练和论文素材导出会继续自动推进。"
                      : "当前没有检测到主流程在运行，适合回头查看状态文件或日志。"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <MetricCard
                    label="磁盘剩余"
                    value={status?.disk?.free_gb ? `${status.disk.free_gb.toFixed(1)} GB` : "n/a"}
                    className="rounded-[1.3rem]"
                  />
                  <MetricCard
                    label="日志年龄"
                    value={typeof status?.log_age_minutes === "number" ? `${status.log_age_minutes} min` : "n/a"}
                    className="rounded-[1.3rem]"
                  />
                </div>

                <div className="rounded-[1.6rem] border border-border/70 bg-secondary/40 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Activity className="h-4 w-4" />
                    当前进度
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {status?.progress?.current && status?.progress?.total
                      ? `${status.progress.current}/${status.progress.total} (${status.progress.percent ?? 0}%)`
                      : "状态文件尚未写入结构化进度，页面会自动在下一轮刷新后读取。"}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <LiveStatusBoard initialData={data} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 md:px-6">
        <SectionHeader
          tag="Execution Map"
          title="当前处在整条链路的哪个位置"
          description="这条时间线不是写死的说明文字，而是依据当前 stage 判断大致处于数据准备、缓存、筛选、训练还是结果导出。"
        />
        <PhaseTimeline stage={status?.stage} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <SectionHeader
          tag="Research Flow"
          title="这份毕设的核心链路"
          description="前端展示围绕真实工程链路组织，而不是堆一页静态介绍。后面拿它做验收时，老师能直接看见你从数据到训练再到部署的完整闭环。"
        />

        <div className="app-stagger grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {flowCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="thesis-surface app-hover-lift rounded-[1.8rem] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
                  <Icon className="h-5 w-5 text-foreground/84" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border/80 bg-muted/28">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
          <SectionHeader
            tag="Capability Layer"
            title="这次不是套模板，而是改成了实验控制台风格"
            description="配色、背景层次、侧栏状态和实时轮询逻辑都和你之前那个站分开了，但工程感和展示感仍然保留。"
          />

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="thesis-shell fog-grid rounded-[2rem] p-5 md:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.6rem] border border-border/70 bg-background/88 p-4">
                  <div className="thesis-badge">
                    <HardDrive className="h-3.5 w-3.5" />
                    Results 目录
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    `pipeline_status.json`、`summary.csv`、`best_variant.json` 和 `paper_artifacts/*/manifest.json` 会被前端直接读取并组织成展示内容。
                  </p>
                </div>
                <div className="rounded-[1.6rem] border border-border/70 bg-background/88 p-4">
                  <div className="thesis-badge">
                    <CloudFog className="h-3.5 w-3.5" />
                    视觉系统
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    我把它改成偏雾蓝、铜橙点缀的监控台语言，不再和你之前网站几乎同一套暖纸面配色撞脸。
                  </p>
                </div>
              </div>
              <div className="thesis-glow-line my-6" />
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                这里我仍然没有把主展示层做成 Gradio，而是保留 `Next.js 16 + React 19 + Tailwind CSS 4` 作为前台。
                但现在又加了一层 `/api/dashboard`，让首页和实验页可以轮询最新状态，不是只靠构建时快照。
              </p>
            </div>

            <div className="grid gap-4">
              <article className="thesis-surface app-hover-lift rounded-[1.8rem] p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
                  <Layers3 className="h-4 w-4 text-foreground/84" />
                </div>
                <h3 className="text-base font-semibold text-foreground">实时状态接口</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  新增了 `frontend/app/api/dashboard/route.ts`，前端会定时拉取最新状态、最佳方案和实验汇总，而不是把页面固定成静态介绍页。
                </p>
              </article>
              {deliveryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.title} className="thesis-surface app-hover-lift rounded-[1.8rem] p-5">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
                      <Icon className="h-4 w-4 text-foreground/84" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{card.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
