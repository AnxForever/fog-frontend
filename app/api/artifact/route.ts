import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest } from "next/server";

const ROOT_CANDIDATES = [process.cwd(), path.resolve(process.cwd(), "..")];

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export async function GET(request: NextRequest) {
  const relative = request.nextUrl.searchParams.get("path");
  if (!relative) {
    return new Response("missing path", { status: 400 });
  }

  if (/^https?:\/\//i.test(relative)) {
    try {
      const upstream = await fetch(relative, { cache: "no-store" });
      if (!upstream.ok) {
        return new Response("not found", { status: 404 });
      }

      const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
      const url = new URL(relative);
      const filename = path.basename(url.pathname) || "artifact";
      const download = request.nextUrl.searchParams.get("download");

      return new Response(upstream.body, {
        headers: {
          "content-type": contentType,
          "cache-control": "no-store",
          ...(download ? { "content-disposition": `attachment; filename="${filename}"` } : {}),
        },
      });
    } catch {
      return new Response("not found", { status: 404 });
    }
  }

  let absolute: string | null = null;

  if (path.isAbsolute(relative)) {
    absolute = ROOT_CANDIDATES.find((root) => relative.startsWith(root)) ?? null;
    absolute = absolute ? relative : null;
  } else {
    for (const root of ROOT_CANDIDATES) {
      const candidate = path.resolve(root, relative);
      if (!candidate.startsWith(root)) continue;
      try {
        await fs.access(candidate);
        absolute = candidate;
        break;
      } catch {
        continue;
      }
    }
  }

  if (!absolute) {
    return new Response("not found", { status: 404 });
  }

  try {
    const data = await fs.readFile(absolute);
    const ext = path.extname(absolute).toLowerCase();
    const filename = path.basename(absolute);
    const download = request.nextUrl.searchParams.get("download");
    return new Response(data, {
      headers: {
        "content-type": MIME_TYPES[ext] ?? "application/octet-stream",
        "cache-control": "no-store",
        ...(download ? { "content-disposition": `attachment; filename="${filename}"` } : {}),
      },
    });
  } catch {
    return new Response("not found", { status: 404 });
  }
}
