import { BarChart3, FileStack, Gauge, Sparkles } from "lucide-react";
import { LiveStatusBoard } from "@/components/live-status-board";
import { PhaseTimeline } from "@/components/phase-timeline";
import { MetricCard } from "@/components/ui/metric-card";
import { VisualSampleCard } from "@/components/visual-sample-card";
import { SectionHeader } from "@/components/ui/section-header";
import { loadDashboardData } from "@/lib/dashboard-data";
import { basename, parseSampleMeta } from "@/lib/visual-sample-meta";

function artifactSrc(path?: string) {
  if (!path) return null;
  return `/api/artifact?path=${encodeURIComponent(path)}`;
}

function normalizeStage(stage?: string) {
  return stage ?? "等待状态写入";
}

export default async function ExperimentsPage() {
  const data = await loadDashboardData();
  const headers = data.summaryRows[0] ? Object.keys(data.summaryRows[0]) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <SectionHeader
        tag="Experiments"
        title="实验结果与运行状态"
        description="这里承接 screening、正式训练和论文素材导出的结构化结果。最终 `results/` 目录里的内容会自动映射到这页。"
      />

      <div className="app-stagger grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="当前阶段" value={normalizeStage(data.status?.stage)} compact />
        <MetricCard label="健康状态" value={data.status?.healthy ? "Healthy" : "Pending"} compact />
        <MetricCard label="最佳预处理方案" value={data.bestVariant?.variant ?? "尚未选出"} compact />
        <MetricCard label="最佳指标" value={data.bestVariant?.score ? `${data.bestVariant.score}` : "n/a"} hint={data.bestVariant?.metric} compact />
      </div>

      <div className="mt-8">
        <LiveStatusBoard initialData={data} compact />
      </div>

      <section className="mt-8">
        <SectionHeader
          tag="Pipeline Timeline"
          title="结果页里的实时阶段总览"
          description="适合答辩时直接讲当前项目处在哪一层，老师不需要自己猜 `stage` 字段是什么意思。"
        />
        <PhaseTimeline stage={data.status?.stage} />
      </section>

      <div className="mt-8 grid gap-4 2xl:grid-cols-[0.8fr_1.2fr]">
        <section className="thesis-shell fog-grid rounded-[2rem] p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
              <Gauge className="h-4 w-4 text-foreground/84" />
            </div>
            <div>
              <h2 className="font-display-soft text-[1.25rem] font-semibold text-foreground">运行中快照</h2>
              <p className="text-sm text-muted-foreground">读取 `pipeline_status.json` 和 `best_variant.json`</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Pipeline",
                value: normalizeStage(data.status?.stage),
                description: data.status?.pipeline_running ? "主流程正在运行。" : "当前未检测到主流程运行。",
              },
              {
                label: "Progress",
                value:
                  data.status?.progress?.current && data.status?.progress?.total
                    ? `${data.status.progress.current}/${data.status.progress.total}`
                    : "n/a",
                description:
                  typeof data.status?.progress?.percent === "number" ? `当前约 ${data.status.progress.percent}%` : "暂未写入结构化进度百分比。",
              },
              {
                label: "磁盘空间",
                value: typeof data.status?.disk?.free_gb === "number" ? `${data.status.disk.free_gb.toFixed(2)} GB` : "n/a",
                description: "监控层会结合磁盘状态决定是否自动清理中间产物。",
              },
              {
                label: "素材清单",
                value: basename(data.latestManifestPath),
                description: "最新论文素材清单会从 `paper_artifacts` 中自动挑最新一份。",
              },
            ].map((item) => (
              <div key={item.label} className="home-mini-board-item rounded-[1.45rem]">
                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[linear-gradient(135deg,var(--chart-1),var(--chart-4))]" />
                <div className="min-w-0">
                  <div className="home-panel-caption">{item.label}</div>
                  <div className="mt-1 break-words text-[1.06rem] font-semibold leading-7 text-foreground">{item.value}</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="thesis-shell fog-grid rounded-[2rem] p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
              <FileStack className="h-4 w-4 text-foreground/84" />
            </div>
            <div>
              <h2 className="font-display-soft text-[1.25rem] font-semibold text-foreground">实验汇总表</h2>
              <p className="text-sm text-muted-foreground">读取 `summary.csv`，自动渲染成横向可滚动表格。</p>
            </div>
          </div>

          {headers.length ? (
            <div className="overflow-x-auto">
              <table className="thesis-table min-w-[920px]">
                <thead>
                  <tr>
                    {headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.summaryRows.map((row, index) => (
                    <tr key={`${index}-${row[headers[0]] ?? "row"}`}>
                      {headers.map((header) => (
                        <td key={header}>{row[header] || "—"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-border/80 bg-background/82 p-6 text-sm leading-7 text-muted-foreground">
              当前仓库本地还没有 `results/summary.csv`，所以这里先显示占位状态。等远端结果同步回来后，这页会自动变成真实实验表。
            </div>
          )}
        </section>
      </div>

      <section className="mt-8">
        <SectionHeader
          tag="Visual Samples"
          title="论文可视化样本"
          description="从 `paper_artifacts/*/manifest.json` 中提取的可视化列表，适合答辩时直接展示原图、输出图或对比结果。"
        />

        {data.visualSamples.length ? (
          <div className="app-stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.visualSamples.map((sample, index) => {
              const src = artifactSrc(sample.output_path ?? sample.image_path);
              const meta = parseSampleMeta(sample);
              return (
                <VisualSampleCard
                  key={`${sample.output_path ?? sample.image_path ?? index}`}
                  index={index}
                  src={src}
                  city={meta.city}
                  sceneId={meta.sceneId}
                  beta={meta.beta}
                  note="原图、叠加图、标注掩码与预测掩码对照"
                  emptyText="manifest 中未提供图片路径"
                />
              );
            })}
          </div>
        ) : (
          <div className="thesis-shell fog-grid rounded-[2rem] p-6">
            <div className="flex items-center gap-3 text-foreground">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">还没有可视化样本被同步到本地。</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              这不是报错。只是当前本地工作区里还没有 `paper_artifacts` 产物。等训练和导出完成后，这一块会自动展示样本图。
            </p>
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="thesis-shell fog-grid rounded-[2rem] p-5 md:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/55">
              <BarChart3 className="h-4 w-4 text-foreground/84" />
            </div>
            <div>
              <h2 className="font-display-soft text-[1.25rem] font-semibold text-foreground">页面读取来源</h2>
              <p className="text-sm text-muted-foreground">这页不是手写静态内容，而是直接接数据。</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="状态文件" value="pipeline_status.json" hint="results/pipeline_status.json" className="rounded-[1.3rem]" compact />
            <MetricCard label="最佳方案" value="best_variant.json" hint="results/best_variant.json" className="rounded-[1.3rem]" compact />
            <MetricCard label="实验汇总" value="summary.csv" hint="results/summary.csv" className="rounded-[1.3rem]" compact />
            <MetricCard label="论文素材" value="manifest.json" hint="results/paper_artifacts/*/manifest.json" className="rounded-[1.3rem]" compact />
          </div>
        </div>
      </section>
    </div>
  );
}
