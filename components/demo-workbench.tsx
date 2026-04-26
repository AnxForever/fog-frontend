"use client";

import { useEffect, useMemo, useState } from "react";
import { ImagePlus, LoaderCircle, WandSparkles } from "lucide-react";

type InferResponse = {
  variant: string;
  precision: string;
  config: string;
  checkpoint: string;
  device: string;
  outputs: {
    input: string;
    processed: string;
    mask: string;
    overlay: string;
  };
  stderr?: string;
};

const variants = [
  { value: "none", label: "None" },
  { value: "clahe", label: "CLAHE" },
  { value: "gamma", label: "Gamma" },
  { value: "retinex", label: "Retinex" },
];

const precisions = [
  { value: "fp32", label: "FP32" },
  { value: "fp16", label: "FP16" },
];

function artifactSrc(path: string) {
  return `/api/artifact?path=${encodeURIComponent(path)}`;
}

export function DemoWorkbench({
  runtimeReady,
  defaultConfig,
  defaultCheckpoint,
  defaultDevice,
}: {
  runtimeReady: boolean;
  defaultConfig: string;
  defaultCheckpoint: string | null;
  defaultDevice: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [variant, setVariant] = useState("none");
  const [precision, setPrecision] = useState(defaultDevice.startsWith("cuda") ? "fp16" : "fp32");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InferResponse | null>(null);
  const fp16Available = defaultDevice.startsWith("cuda");

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      <div className="fog-card rounded-[1.8rem] p-5 md:p-6">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div>
              <div className="fog-badge">Local Inference Workbench</div>
              <h3 className="mt-3 font-display-soft text-[1.24rem] font-semibold text-foreground">单图推理工作台</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                这里不依赖外部 iframe。前端会把上传图片提交到 `/api/demo/infer`，再由 Python 脚本调用你现有的模型推理逻辑生成结果。
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="rounded-[1.3rem] border border-border/70 bg-background/82 p-4">
                <div className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">Upload</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const next = event.target.files?.[0] ?? null;
                    setFile(next);
                    setResult(null);
                    setError(null);
                  }}
                  className="block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-chart-1/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-chart-1"
                />
              </label>

              <label className="rounded-[1.3rem] border border-border/70 bg-background/82 p-4">
                <div className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">Preprocess</div>
                <select
                  value={variant}
                  onChange={(event) => setVariant(event.target.value)}
                  className="w-full rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground outline-none"
                >
                  {variants.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="rounded-[1.3rem] border border-border/70 bg-background/82 p-4">
                <div className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">Precision</div>
                <select
                  value={precision}
                  onChange={(event) => setPrecision(event.target.value)}
                  className="w-full rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground outline-none"
                >
                  {precisions.map((item) => (
                    <option key={item.value} value={item.value} disabled={item.value === "fp16" && !fp16Available}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              type="button"
              disabled={!runtimeReady || !file || loading}
              onClick={async () => {
                if (!file) return;
                setLoading(true);
                setError(null);
                setResult(null);
                try {
                  const form = new FormData();
                  form.append("image", file);
                  form.append("variant", variant);
                  form.append("precision", precision);
                  const response = await fetch("/api/demo/infer", { method: "POST", body: form });
                  const payload = await response.json();
                  if (!response.ok) {
                    setError(payload.error || payload.detail || "推理失败");
                    return;
                  }
                  setResult(payload as InferResponse);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "推理失败");
                } finally {
                  setLoading(false);
                }
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-chart-1/20 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--chart-1)_92%,white_8%),color-mix(in_srgb,var(--chart-4)_76%,var(--chart-1)))] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_28px_rgba(35,115,154,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
              {loading ? "正在推理" : "开始推理"}
            </button>

            <div className="rounded-[1.3rem] border border-border/70 bg-background/78 p-4 text-[11px] leading-6 text-muted-foreground md:text-xs">
              <div className="break-all">Config: {defaultConfig}</div>
              <div className="break-all">Checkpoint: {defaultCheckpoint ?? "未找到"}</div>
              <div>Device: {defaultDevice}</div>
              <div>Precision: {precision}</div>
              <div>{fp16Available ? "建议：3050 这类中低端显卡优先用 FP16 单图推理。" : "当前未检测到 CUDA，已自动回退到 CPU/FP32 展示模式。"}</div>
              {!runtimeReady ? <div className="mt-2 text-chart-3">当前还没有可用 checkpoint，接口会返回错误提示。</div> : null}
            </div>

            {error ? <div className="rounded-[1.2rem] border border-chart-3/25 bg-chart-3/8 px-4 py-3 text-sm text-foreground">{error}</div> : null}
          </div>

          <div className="rounded-[1.6rem] border border-dashed border-border/80 bg-background/70 p-4">
            {previewUrl ? (
              <img src={previewUrl} alt="input preview" className="h-[320px] w-full rounded-[1.2rem] border border-border/70 object-cover" />
            ) : (
              <div className="flex h-[320px] flex-col items-center justify-center rounded-[1.2rem] border border-border/70 bg-muted/30 text-center text-sm text-muted-foreground">
                <ImagePlus className="mb-3 h-6 w-6" />
                上传一张雾天道路图后，这里会先显示输入预览。
              </div>
            )}
          </div>
        </div>
      </div>

      {result ? (
        <div className="space-y-4">
          <div className="fog-card rounded-[1.4rem] p-4 text-sm leading-7 text-muted-foreground">
            <div>Variant: {result.variant}</div>
            <div>Precision: {result.precision}</div>
            <div>Device: {result.device}</div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "输入图", path: result.outputs.input },
              { label: "预处理结果", path: result.outputs.processed },
              { label: "分割掩码", path: result.outputs.mask },
              { label: "Overlay", path: result.outputs.overlay },
            ].map((item) => (
              <div key={item.label} className="fog-card rounded-[1.6rem] p-4">
                <div className="mb-3 text-[0.95rem] font-medium text-foreground">{item.label}</div>
                <img src={artifactSrc(item.path)} alt={item.label} className="h-56 w-full rounded-[1.15rem] border border-border/70 object-cover" />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
