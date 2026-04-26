import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import type { DashboardData, BestVariant, PipelineStatus, SummaryRow, VisualSample } from "@/lib/dashboard-types";

const APP_ROOT = process.cwd();
const ROOT_CANDIDATES = [APP_ROOT, path.resolve(APP_ROOT, "..")];

function resolveDataRoots() {
  return ROOT_CANDIDATES.map((root) => ({
    root,
    resultsDir: path.join(root, "results"),
    retrievedDir: path.join(root, "retrieved_artifacts"),
  }));
}

function toRepoRelative(filePath: string) {
  for (const root of ROOT_CANDIDATES) {
    if (filePath.startsWith(root)) {
      return path.relative(root, filePath);
    }
  }
  return filePath;
}

async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

function parseCsv(text: string): SummaryRow[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    return headers.reduce<SummaryRow>((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});
  });
}

async function readSummaryRows(): Promise<SummaryRow[]> {
  const candidates = resolveDataRoots().flatMap(({ resultsDir, retrievedDir }) => [
    path.join(resultsDir, "summary.csv"),
    path.join(retrievedDir, "summary.csv"),
    path.join(retrievedDir, "segformer_b2_none_betaall_512x1024_s42_final", "metadata", "summary.csv"),
  ]);
  for (const candidate of candidates) {
    try {
      const text = await fs.readFile(candidate, "utf-8");
      return parseCsv(text);
    } catch {
      continue;
    }
  }
  return [];
}

async function collectManifestPaths(root: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(root, { withFileTypes: true });
    const found: string[] = [];
    for (const entry of entries) {
      const absolute = path.join(root, entry.name);
      if (entry.isDirectory()) {
        found.push(...(await collectManifestPaths(absolute)));
      } else if (entry.isFile() && entry.name === "manifest.json") {
        found.push(absolute);
      }
    }
    return found;
  } catch {
    return [];
  }
}

async function latestManifest(): Promise<string | null> {
  const manifests = (
    await Promise.all(
      resolveDataRoots().flatMap(({ resultsDir, retrievedDir }) => [
        collectManifestPaths(path.join(resultsDir, "paper_artifacts")),
        collectManifestPaths(retrievedDir),
      ]),
    )
  ).flat();
  if (!manifests.length) return null;
  const withStats = await Promise.all(
    manifests.map(async (manifestPath) => ({
      manifestPath,
      stat: await fs.stat(manifestPath),
    })),
  );
  withStats.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
  return withStats[0]?.manifestPath ?? null;
}

async function readBestVariant(): Promise<BestVariant | null> {
  const candidates = resolveDataRoots().flatMap(({ resultsDir, retrievedDir }) => [
    path.join(resultsDir, "best_variant.json"),
    path.join(retrievedDir, "best_variant.json"),
    path.join(retrievedDir, "segformer_b2_none_betaall_512x1024_s42_final", "metadata", "best_variant.json"),
  ]);
  for (const candidate of candidates) {
    const data = await readJson<BestVariant>(candidate);
    if (data) return data;
  }
  return null;
}

async function deriveCompletedStatus(manifestPath: string | null): Promise<PipelineStatus | null> {
  if (!manifestPath) return null;
  try {
    const stat = await fs.stat(manifestPath);
    return {
      timestamp: stat.mtime.toISOString(),
      healthy: true,
      stage: "completed",
      pipeline_running: false,
      log_age_minutes: 0,
      progress: {
        kind: "final",
        current: 24000,
        total: 24000,
        percent: 100,
      },
    };
  } catch {
    return null;
  }
}

function localizeVisualSamples(manifestPath: string | null, samples: VisualSample[] | undefined): VisualSample[] {
  if (!manifestPath || !samples?.length) return [];

  const manifestDir = path.dirname(manifestPath);
  const visualsDir = path.join(manifestDir, "visuals");

  return samples.map((sample) => {
    const next = { ...sample };
    if (sample.output_path) {
      next.output_path = toRepoRelative(path.join(visualsDir, path.basename(sample.output_path)));
    }
    return next;
  });
}

export async function loadDashboardData(): Promise<DashboardData> {
  const [rawStatus, bestVariant, summaryRows, manifestPath] = await Promise.all([
    readJson<PipelineStatus>(path.join(APP_ROOT, "results", "pipeline_status.json")),
    readBestVariant(),
    readSummaryRows(),
    latestManifest(),
  ]);

  const manifest = manifestPath ? await readJson<{ visual_samples?: VisualSample[] }>(manifestPath) : null;
  const status = rawStatus ?? (await deriveCompletedStatus(manifestPath));

  return {
    status,
    bestVariant,
    summaryRows,
    latestManifestPath: manifestPath ? toRepoRelative(manifestPath) : null,
    visualSamples: localizeVisualSamples(manifestPath, manifest?.visual_samples).slice(0, 6),
  };
}
