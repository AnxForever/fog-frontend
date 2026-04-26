import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import { resolveDemoRuntime } from "@/lib/demo-runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const execFileAsync = promisify(execFile);
const VALID_VARIANTS = new Set(["none", "clahe", "gamma", "retinex"]);
const VALID_PRECISIONS = new Set(["fp32", "fp16"]);
const EXTERNAL_API_BASE = process.env.FOG_API_BASE?.replace(/\/+$/, "");
const EXTERNAL_API_TOKEN = process.env.FOG_API_TOKEN;

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("image");
  const variant = String(form.get("variant") || "none");
  const precision = String(form.get("precision") || "fp32");

  if (!(file instanceof File)) {
    return Response.json({ error: "缺少图片文件。" }, { status: 400 });
  }
  if (!VALID_VARIANTS.has(variant)) {
    return Response.json({ error: `不支持的预处理方式：${variant}` }, { status: 400 });
  }
  if (!VALID_PRECISIONS.has(precision)) {
    return Response.json({ error: `不支持的精度模式：${precision}` }, { status: 400 });
  }

  if (EXTERNAL_API_BASE) {
    const headers = new Headers();
    if (EXTERNAL_API_TOKEN) {
      headers.set("Authorization", `Bearer ${EXTERNAL_API_TOKEN}`);
    }

    const upstream = await fetch(`${EXTERNAL_API_BASE}/infer`, {
      method: "POST",
      headers,
      body: form,
    });

    const payload = await upstream.json();
    return Response.json(payload, { status: upstream.status });
  }

  const runtimeConfig = await resolveDemoRuntime();
  if (!runtimeConfig.ready || !runtimeConfig.checkpoint) {
    return Response.json(
      {
        error: "当前还没有可用的演示模型。请先完成训练，或设置 FOG_SEG_DEMO_CONFIG / FOG_SEG_DEMO_CHECKPOINT。",
        config: runtimeConfig.config,
        checkpoint: runtimeConfig.checkpoint,
      },
      { status: 400 },
    );
  }

  const runId = randomUUID();
  const runDir = path.join(runtimeConfig.repoRoot, "results", "demo_runtime", runId);
  await fs.mkdir(runDir, { recursive: true });

  const ext = path.extname(file.name) || ".png";
  const inputPath = path.join(runDir, `upload${ext}`);
  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(inputPath, Buffer.from(arrayBuffer));

  try {
    const { stdout, stderr } = await execFileAsync(
      runtimeConfig.pythonBin,
      [
        "scripts/run_demo_inference.py",
        "--config",
        runtimeConfig.config,
        "--checkpoint",
        runtimeConfig.checkpoint,
        "--input",
        inputPath,
        "--output-dir",
        runDir,
        "--variant",
        variant,
        "--device",
        runtimeConfig.device,
        "--precision",
        precision,
      ],
      {
        cwd: runtimeConfig.repoRoot,
        timeout: 180000,
        maxBuffer: 10 * 1024 * 1024,
      },
    );

    const payload = JSON.parse(stdout.trim()) as {
      variant: string;
      precision: string;
      config: string;
      checkpoint: string;
      device: string;
      outputs: Record<string, string>;
    };

    return Response.json({
      ...payload,
      stderr: stderr.trim(),
    });
  } catch (error) {
    const err = error as { stderr?: string; stdout?: string; message?: string };
    return Response.json(
      {
        error: "推理执行失败。",
        detail: err.stderr || err.stdout || err.message || "unknown error",
      },
      { status: 500 },
    );
  }
}
