import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const APP_ROOT = process.cwd();
const ROOT_CANDIDATES = [APP_ROOT, path.resolve(APP_ROOT, "..")];
const execFileAsync = promisify(execFile);

async function pathExists(target: string) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function findLatestCheckpoint() {
  const roots = ROOT_CANDIDATES.flatMap((root) => [path.join(root, "retrieved_artifacts"), path.join(root, "work_dirs")]);
  for (const workRoot of roots) {
    try {
      const entries = await fs.readdir(workRoot, { withFileTypes: true });
      const dirs = await Promise.all(
        entries
          .filter((entry) => entry.isDirectory())
          .map(async (entry) => {
            const absolute = path.join(workRoot, entry.name);
            const stat = await fs.stat(absolute);
            return { absolute, mtimeMs: stat.mtimeMs };
          }),
      );

      dirs.sort((a, b) => b.mtimeMs - a.mtimeMs);
      for (const dir of dirs) {
        const files = await fs.readdir(dir.absolute);
        const best = files
          .filter((name) => name.startsWith("best_") && name.endsWith(".pth"))
          .sort()
          .at(-1);
        if (best) return path.join(dir.absolute, best);
        if (files.includes("last_checkpoint")) {
          const target = (await fs.readFile(path.join(dir.absolute, "last_checkpoint"), "utf-8")).trim();
          const resolved = path.isAbsolute(target) ? target : path.join(dir.absolute, path.basename(target));
          if (await pathExists(resolved)) return resolved;
        }
      }
    } catch {
      continue;
    }
  }
  for (const root of ROOT_CANDIDATES) {
    const flatRetrieved = path.join(root, "retrieved_artifacts", "best_mIoU_iter_21000.pth");
    if (await pathExists(flatRetrieved)) return flatRetrieved;
  }
  return null;
}

async function detectDevice(pythonBin: string) {
  if (process.env.FOG_SEG_DEMO_DEVICE) return process.env.FOG_SEG_DEMO_DEVICE;
  try {
    const { stdout } = await execFileAsync(
      pythonBin,
      ["-c", "import torch; print('cuda:0' if torch.cuda.is_available() else 'cpu')"],
      { cwd: APP_ROOT, timeout: 10000 },
    );
    const value = stdout.trim();
    return value || "cpu";
  } catch {
    return "cpu";
  }
}

async function findExistingPath(candidates: string[]) {
  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate;
  }
  return null;
}

export async function resolveDemoRuntime() {
  const pythonBin = process.env.FOG_SEG_DEMO_PYTHON || "python3";
  const defaultConfig = await findExistingPath(
    ROOT_CANDIDATES.map((root) => path.join(root, "configs", "experiments", "segformer_b2_full.py")),
  );
  const config = process.env.FOG_SEG_DEMO_CONFIG
    ? path.resolve(APP_ROOT, process.env.FOG_SEG_DEMO_CONFIG)
    : (defaultConfig ?? path.join(APP_ROOT, "configs", "experiments", "segformer_b2_full.py"));
  const checkpoint = process.env.FOG_SEG_DEMO_CHECKPOINT
    ? path.resolve(APP_ROOT, process.env.FOG_SEG_DEMO_CHECKPOINT)
    : await findLatestCheckpoint();
  const device = await detectDevice(pythonBin);

  return {
    repoRoot: APP_ROOT,
    pythonBin,
    device,
    config,
    checkpoint,
    ready: Boolean(checkpoint && (await pathExists(config)) && (await pathExists(checkpoint))),
  };
}
