import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  ChevronRight,
  CircleHelp,
  CloudFog,
  Cpu,
  Database,
  FileSearch,
  FlaskConical,
  Image as ImageIcon,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
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

const heroHighlights = [
  {
    icon: CircleHelp,
    title: "研究问题",
    description: "在雾天交通道路场景里，把路面、车辆、行人、建筑等区域稳定分出来，并观察雾度变化下模型还能否保持结构判断。",
  },
  {
    icon: Workflow,
    title: "技术路线",
    description: "数据准备、预处理缓存、variant screening、正式训练、测试评估与论文素材导出构成整条主线。",
  },
  {
    icon: ShieldCheck,
    title: "系统落地",
    description: "前端承接展示与答辩，后端预留本地推理入口，同时保留纯展示模式，避免现场环境翻车。",
  },
];

const projectFlow = [
  {
    step: "01",
    title: "问题定义",
    desc: "明确雾天道路语义分割的任务边界，以及不同雾浓度、不同预处理方式下的对比目标。",
    href: "/experiments",
    icon: Target,
  },
  {
    step: "02",
    title: "数据准备",
    desc: "基于 Cityscapes 与合成雾图整理训练、验证和展示样本，并处理坏图、标签和缓存问题。",
    href: "/experiments",
    icon: Database,
  },
  {
    step: "03",
    title: "方法设计",
    desc: "以 SegFormer 为主干，围绕 none、CLAHE、Gamma、Retinex 做 preprocessing 筛选与最终训练。",
    href: "/experiments",
    icon: BrainCircuit,
  },
  {
    step: "04",
    title: "实验验证",
    desc: "用 screening、最终权重、可视化样本和汇总表来判断哪种方案更稳、更适合展示。",
    href: "/experiments",
    icon: FlaskConical,
  },
  {
    step: "05",
    title: "在线展示",
    desc: "网页前台展示状态、结果表和论文素材，并预留本地单图推理的接入方式。",
    href: "/demo",
    icon: Cpu,
  },
  {
    step: "06",
    title: "答辩交付",
    desc: "把最佳模型、样本图和结果清单压成一套可直接展示的交付形式，而不是只留训练日志。",
    href: "/demo",
    icon: Bot,
  },
];

const chapterCards = [
  {
    href: "/experiments",
    icon: FileSearch,
    title: "实验结果",
    detail: "variant 选择、训练结果、可视化样本与汇总表",
  },
  {
    href: "/demo",
    icon: Sparkles,
    title: "在线展示",
    detail: "纯展示模式、本地推理工作台与后续 API 接入",
  },
  {
    href: "/experiments",
    icon: Radar,
    title: "流程阶段",
    detail: "从数据准备、screening 到正式训练与结果归档",
  },
  {
    href: "/demo",
    icon: ImageIcon,
    title: "可视化素材",
    detail: "论文图样、overlay、mask 与 manifest 清单",
  },
  {
    href: "/experiments",
    icon: TrendingUp,
    title: "指标快照",
    detail: "状态健康度、最佳方案、实验表和阶段进度",
  },
];

const quickAnswers = [
  {
    q: "这个项目到底做什么？",
    a: "给一张雾天道路图，把道路、车辆、行人、建筑、植被、天空等区域逐像素分出来，而不是只给整图一个类别。",
  },
  {
    q: "为什么要做 preprocessing 对比？",
    a: "因为雾天场景最先损失的是对比度和边界细节，传统增强方法是否真的有帮助，必须通过对照实验说话。",
  },
  {
    q: "为什么首页更偏展示而不是训练？",
    a: "因为训练已经结束，真正要交付给老师和同学看的，是结果、样本、结构化结论和可操作的演示入口。",
  },
];

export default async function HomePage() {
  const data = await loadDashboardData();
  const status = data.status;
  const summaryCount = data.summaryRows.length;
  const diskText = typeof status?.disk?.free_gb === "number" ? `${status.disk.free_gb.toFixed(1)} GB` : "n/a";
  const manifestText = data.latestManifestPath ?? "retrieved_artifacts 已归档";

  return (
    <div>
      <header className="thesis-hero app-premium-panel app-section-enter border-b border-border">
        <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10 xl:py-12">
          <div className="thesis-orb app-float-orb left-[-4rem] top-8 h-32 w-32 bg-chart-3/15 md:h-48 md:w-48" />
          <div className="thesis-orb app-float-orb app-float-orb-delayed right-[-3rem] top-0 h-44 w-44 bg-chart-1/12 md:h-64 md:w-64" />

          <div className="grid gap-8 xl:grid-cols-[1.35fr_0.85fr] xl:items-start">
            <div className="space-y-8">
              <div className="app-stagger-tight flex flex-wrap items-center gap-2.5">
                <div className="thesis-kicker">Research System</div>
                <div className="thesis-chip">本科毕业设计</div>
                <div className="thesis-chip">Fog · Segmentation · Presentation</div>
              </div>

              <div className="app-panel-enter max-w-5xl space-y-5">
                <h1 className="font-display max-w-5xl text-[2.6rem] font-semibold leading-[0.95] text-foreground md:text-[4.5rem] xl:text-[5.6rem]">
                  雾天道路语义分割
                  <span className="mt-2 block text-[0.58em] leading-[1.02] text-foreground/88">项目全景与结果展示</span>
                </h1>
                <p className="max-w-3xl text-base font-light leading-8 text-muted-foreground md:text-[1.08rem]">
                  这不是一页简单导航，而是一套压缩后的项目信息结构：研究问题、数据准备、方法路线、实验结果、可视化样本和后续演示入口，都在同一套阅读节奏里展开。
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/experiments"
                    className="inline-flex items-center gap-2 rounded-2xl border border-foreground bg-foreground px-5 py-3 text-sm font-medium text-background shadow-[0_14px_30px_rgba(15,23,42,0.10)] transition-all hover:-translate-y-0.5 hover:opacity-95"
                  >
                    查看核心结果
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background/88 px-5 py-3 text-sm font-medium text-foreground shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:bg-muted/55"
                  >
                    打开展示页
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="app-stagger-tight grid gap-3 md:grid-cols-3">
                {heroHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="app-hover-lift rounded-3xl border border-border/70 bg-background/88 px-5 py-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-secondary/45">
                          <Icon className="h-4 w-4 text-foreground/85" />
                        </div>
                        <h2 className="text-[0.98rem] font-semibold text-foreground">{item.title}</h2>
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="app-panel-enter rounded-[2rem] border border-border/70 bg-background/90 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] xl:sticky xl:top-8">
              <div className="flex items-center justify-between gap-3 border-b border-border/80 pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Current Snapshot</p>
                  <h2 className="font-display-soft mt-1 text-[1.3rem] font-semibold text-foreground">项目速览</h2>
                </div>
                <div className="rounded-full border border-border/70 bg-secondary/55 px-3 py-1 text-xs font-medium text-foreground">
                  {data.bestVariant?.variant ?? "final"}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <MetricCard label="当前阶段" value={statusText(status?.stage)} compact />
                <MetricCard label="状态健康度" value={yesNo(status?.healthy)} compact />
                <MetricCard label="汇总行数" value={String(summaryCount)} compact />
                <MetricCard label="磁盘剩余" value={diskText} compact />
              </div>

              <div className="mt-5 space-y-3 rounded-3xl border border-border/70 bg-muted/25 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FileSearch className="h-4 w-4 text-muted-foreground" />
                  关键事实
                </div>
                <dl className="space-y-2.5 text-sm">
                  {[
                    { k: "最佳 Variant", v: data.bestVariant?.variant ?? "none" },
                    { k: "主状态", v: statusText(status?.stage) },
                    { k: "Manifest", v: manifestText.split("/").at(-1) ?? manifestText },
                    { k: "可视化样本", v: `${data.visualSamples.length} 张` },
                    { k: "展示模式", v: "已可独立运行" },
                    { k: "本地推理", v: "可后续接入" },
                  ].map((row) => (
                    <div key={row.k} className="flex items-start justify-between gap-3 border-b border-border/70 pb-2.5 last:border-0 last:pb-0">
                      <dt className="text-muted-foreground">{row.k}</dt>
                      <dd className="text-right font-mono text-foreground">{row.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-5 grid gap-2.5">
                <Link
                  href="/experiments"
                  className="app-hover-soft flex items-center justify-between rounded-2xl border border-border/70 bg-background/88 px-4 py-3.5 text-sm text-foreground hover:bg-muted/45"
                >
                  <span>查看实验结果</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/demo"
                  className="app-hover-soft flex items-center justify-between rounded-2xl border border-border/70 bg-background/88 px-4 py-3.5 text-sm text-foreground hover:bg-muted/45"
                >
                  <span>打开在线展示</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <div className="grid gap-10 xl:grid-cols-[1.18fr_0.82fr]">
          <section aria-label="项目路径" className="app-section-enter space-y-6">
            <div className="flex items-end justify-between gap-4 border-b border-border/80 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Project Flow</p>
                <h2 className="font-display-soft mt-1 text-[1.4rem] font-semibold text-foreground md:text-[1.65rem]">项目路径</h2>
              </div>
              <span className="text-xs text-muted-foreground">从数据整理到结果展示</span>
            </div>

            <div className="app-stagger grid gap-3">
              {projectFlow.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.step}
                    href={item.href}
                    className="app-hover-lift group rounded-[1.6rem] border border-border/70 bg-background/92 px-5 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_38px_rgba(15,23,42,0.07)]"
                  >
                    <div className="grid gap-4 md:grid-cols-[72px_1fr_auto] md:items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-muted/35">
                          <Icon className="h-4 w-4 text-foreground/85" />
                        </div>
                        <div className="font-mono text-sm text-muted-foreground">{item.step}</div>
                      </div>
                      <div>
                        <div className="text-[1.02rem] font-semibold text-foreground">{item.title}</div>
                        <p className="mt-1 text-sm leading-7 text-muted-foreground">{item.desc}</p>
                      </div>
                      <div className="inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground">
                        查看
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6 xl:pt-1">
            <section className="app-panel-enter rounded-[1.8rem] border border-border/70 bg-background/92 p-5 shadow-[0_16px_34px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Quick Access</p>
              <h2 className="font-display-soft mt-1 text-[1.24rem] font-semibold text-foreground">内容索引</h2>
              <div className="app-stagger-tight mt-4 grid gap-2.5">
                {chapterCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <Link
                      key={card.href}
                      href={card.href}
                      className="app-hover-lift group flex items-start justify-between rounded-2xl border border-border/70 bg-background/88 px-4 py-3.5 hover:bg-background hover:shadow-[0_12px_28px_rgba(15,23,42,0.05)]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 bg-muted/35">
                          <Icon className="h-4 w-4 text-foreground/82" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{card.title}</p>
                          <p className="mt-1 text-xs leading-6 text-muted-foreground">{card.detail}</p>
                        </div>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </Link>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-10">
          <LiveStatusBoard initialData={data} />
        </section>

        <section className="mt-10">
          <SectionHeader
            tag="Execution Map"
            title="当前处在整条链路的哪个位置"
            description="这条时间线按当前 stage 判断项目大致处在数据准备、缓存、筛选、训练还是结果归档。"
          />
          <PhaseTimeline stage={status?.stage} />
        </section>

        <section aria-label="核心问题速答" className="app-section-enter mt-12">
          <div className="mb-4 flex items-end justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Quick Answers</p>
              <h2 className="font-display-soft mt-1 text-[1.4rem] font-semibold text-foreground md:text-[1.65rem]">核心问题速答</h2>
            </div>
            <span className="text-xs text-muted-foreground">先看懂项目，再看环境</span>
          </div>

          <div className="app-stagger-tight grid gap-3 lg:grid-cols-3">
            {quickAnswers.map((item) => (
              <div key={item.q} className="app-hover-lift rounded-[1.7rem] border border-border/70 bg-background/92 px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                <p className="text-[1rem] font-semibold leading-7 text-foreground">{item.q}</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
