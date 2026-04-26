export type PipelineStatus = {
  timestamp?: string;
  healthy?: boolean;
  stage?: string;
  pipeline_running?: boolean;
  log_age_minutes?: number;
  disk?: { free_gb?: number };
  progress?: {
    kind?: string;
    current?: number;
    total?: number;
    percent?: number;
    variant?: string;
  };
};

export type BestVariant = {
  variant?: string;
  score?: number;
  metric?: string;
  experiment_name?: string;
};

export type SummaryRow = Record<string, string>;

export type VisualSample = {
  beta?: string;
  output_path?: string;
  image_path?: string;
};

export type DashboardData = {
  status: PipelineStatus | null;
  bestVariant: BestVariant | null;
  summaryRows: SummaryRow[];
  latestManifestPath: string | null;
  visualSamples: VisualSample[];
};
