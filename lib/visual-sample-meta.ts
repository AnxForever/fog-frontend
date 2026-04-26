export function basename(input?: string | null) {
  if (!input) return "n/a";
  const parts = input.split("/").filter(Boolean);
  return parts.at(-1) ?? input;
}

export function cityLabel(city?: string) {
  if (!city) return "未知城市";
  const normalized = city.toLowerCase();
  if (normalized === "frankfurt") return "法兰克福";
  if (normalized === "munster") return "明斯特";
  if (normalized === "lindau") return "林道";
  return city;
}

export function parseSampleMeta(sample: { output_path?: string | null; image_path?: string | null; beta?: string | number | null }) {
  const raw = basename(sample.output_path ?? sample.image_path);
  const stem = raw.replace(/\.[^.]+$/, "");
  const match = stem.match(/^beta\d+_([a-z]+)_[a-z]+_(\d{6}_\d{6})_leftImg8bit_foggy_beta_(\d+(?:\.\d+)?)$/i);

  return {
    city: cityLabel(match?.[1]),
    sceneId: match?.[2] ?? stem,
    beta: String(sample.beta ?? match?.[3] ?? "n/a"),
  };
}
