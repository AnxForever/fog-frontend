import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  ChartColumnBig,
  CloudFog,
  Database,
  HardDrive,
  Image as ImageIcon,
  Layers3,
  Orbit,
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
    description: "把 Cityscapes、雾图合成结果、标签和论文素材统一接到同一条可复现链路里。",
  },
  {
    icon: Sparkles,
    title: "传统预处理",
    description: "围绕 CLAHE、Gamma、Retinex 建离线缓存，不把训练时间浪费在重复图像增强上。",
  },
  {
    icon: Radar,
    title: "Variant Screening",
    description: "先做 screening，再把最佳方案送去正式训练，让实验结论建立在选择而不是猜测上。",
  },
  {
    icon: BrainCircuit,
    title: "正式训练与评估",
    description: "持续产出 mIoU、aAcc、最佳权重和可视化样本，结果直接可拿去展示和答辩。",
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
  const progressText =
    status?.progress?.current && status?.progress?.total
      ? `${status.progress.current}/${status.progress.total}${typeof status.progress.percent === "number" ? ` · ${status.progress.percent}%` : ""}`
      : "结果已归档";

  return (
    <div>
      <section className="thesis-hero border-b border-border/80">
        <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10 xl:py-14">
          <div className="thesis-orb app-float-orb left-[-4rem] top-6 h-36 w-36 bg-chart-3/15 md:h-52 md:w-52" />
          <div className="thesis-orb app-float-orb app-float-orb-delayed right-[-2rem] top-0 h-44 w-44 bg-chart-1/15 md:h-72 md:w-72" />

          <div className="grid gap-8 xl:grid-cols-[1.18fr_0.82fr]">
            <div className="space-y-8">
              <div className="app-stagger-tight flex flex-wrap gap-2.5">
                <div className="thesis-kicker">Fog Operations Console</div>
                <div className="thesis-chip">Segmentation Research Frontend</div>
                <div className="thesis-chip">Results Ready</div>
              </div>

              <div className="max-w-5xl space-y-6 app-panel-enter">
                <div className="home-hero-ribbon">
                  <span className="home-hero-ribbon-mark" />
                  当前最佳模型与实验素材已归档，可直接用于展示、答辩与后续部署。
                </div>
                <h1 className="font-display text-[2.8rem] font-semibold leading-[0.92] text-foreground md:text-[4.7rem] xl:text-[6rem]">
                  雾天道路语义分割
                  <span className="mt-2 block text-[0.52em] leading-[1.02] text-foreground/82">实验控制台、结果前台与答辩展示页</span>
                </h1>
                <p className="max-w-3xl text-[1.02rem] leading-8 text-muted-foreground md:text-[1.1rem]">
                  这不是一张静态介绍页，而是把训练状态、最佳方案、实验汇总和论文可视化样本压成一个可以直接对外展示的研究界面。它要做的是让人一眼看懂这套项目究竟产出了什么，而不是继续埋在日志里。
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/experiments"
                    className="inline-flex items-center gap-2 rounded-2xl border border-transparent bg-[linear-gradient(135deg,color-mix(in_srgb,var(--chart-1)_88%,white_12%),color-mix(in_srgb,var(--chart-4)_65%,var(--chart-1)))] px-5 py-3 text-sm font-medium text-white shadow-[0_18px_40px_rgba(35,115,154,0.24)] transition-all hover:-translate-y-1 hover:shadow-[0_26px_46px_rgba(35,115,154,0.3)]"
                  >
                    查看实验结果
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background/82 px-5 py-3 text-sm font-medium text-foreground shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:bg-muted/55"
                  >
                    打开展示页
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="home-stat-grid app-stagger">
                <MetricCard label="当前阶段" value={statusText(status?.stage)} hint="当前首页直接根据状态文件和已归档素材判断项目进度。" />
                <MetricCard label="状态健康度" value={yesNo(status?.healthy)} hint="训练链路已经收尾，本地展示模式不再依赖远端实例在线。" />
                <MetricCard label="最佳 Variant" value={data.bestVariant?.variant ?? "筛选中"} hint="本轮 screening 的最优策略会直接在这里暴露出来。" />
                <MetricCard label="实验汇总行数" value={String(summaryCount)} hint="页面从 summary.csv 读取结果表，不是手工抄写指标。" />
              </div>
            </div>

            <aside className="thesis-shell fog-grid app-panel-enter overflow-hidden rounded-[2.1rem] p-5 xl:sticky xl:top-8">
              <div className="home-aside-header">
                <div>
                  <p className="home-panel-caption">Mission Snapshot</p>
                  <h2 className="font-display-soft mt-1 text-[1.45rem] font-semibold text-foreground">当前任务快照</h2>
                </div>
                <div className="signal-pill">
                  <span className={`thesis-dot ${status?.healthy ? "text-chart-2" : "text-chart-3"}`} />
                  {status?.healthy ? "Healthy" : "Pending"}
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <div className="home-stage-panel">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="home-panel-caption">Pipeline State</div>
                      <div className="mt-2 text-[1.45rem] font-semibold tracking-[-0.04em] text-foreground">{statusText(status?.stage)}</div>
                    </div>
                    <Orbit className="h-5 w-5 text-chart-1" />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {status?.pipeline_running
                      ? "主流程仍在推进，前端会继续轮询最新状态。"
                      : "主流程已经停在完成态，当前这套前端更适合拿去展示结果、素材和方法论。"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="home-data-tile">
                    <div className="home-panel-caption">Current Progress</div>
                    <div className="mt-2 text-lg font-semibold tracking-[-0.04em] text-foreground">{progressText}</div>
                  </div>
                  <div className="home-data-tile">
                    <div className="home-panel-caption">Storage Headroom</div>
                    <div className="mt-2 text-lg font-semibold tracking-[-0.04em] text-foreground">
                      {status?.disk?.free_gb ? `${status.disk.free_gb.toFixed(1)} GB` : "n/a"}
                    </div>
                  </div>
                </div>

                <div className="home-mini-board">
                  <div className="home-mini-board-item">
                    <ChartColumnBig className="h-4 w-4 text-chart-4" />
                    <div>
                      <div className="home-panel-caption">Best Variant</div>
                      <div className="text-sm font-medium text-foreground">{data.bestVariant?.variant ?? "等待筛选"}</div>
                    </div>
                  </div>
                  <div className="home-mini-board-item">
                    <Activity className="h-4 w-4 text-chart-3" />
                    <div>
                      <div className="home-panel-caption">Log Freshness</div>
                      <div className="text-sm font-medium text-foreground">
                        {typeof status?.log_age_minutes === "number" ? `${status.log_age_minutes} min` : "n/a"}
                      </div>
                    </div>
                  </div>
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
              <article key={card.title} className="home-flow-card thesis-surface app-hover-lift rounded-[1.95rem] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--secondary)_84%,white_16%),color-mix(in_srgb,var(--background)_80%,var(--secondary)_20%))]">
                  <Icon className="h-5 w-5 text-foreground/84" />
                </div>
                <div className="home-panel-caption">0{flowCards.indexOf(card) + 1}</div>
                <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-foreground">{card.title}</h3>
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
