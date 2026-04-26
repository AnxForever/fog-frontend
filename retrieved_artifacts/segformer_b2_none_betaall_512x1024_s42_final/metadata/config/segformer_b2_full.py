import os
from pathlib import Path

from configs.datasets.foggy_cityscapes import build_dataloaders, build_evaluators
from configs.models.segformer_b2 import build_model, build_optim_wrapper, build_param_scheduler
from configs.runtime.default_runtime import build_runtime
from src.utils.exp_naming import make_experiment_name

project_root = Path(__file__).resolve().parents[2]
crop_size = (512, 1024)
seed = int(os.environ.get("THESIS_SEED", "42"))
fog_beta = os.environ.get("FOG_BETA", "0.02")
preprocess_variant = os.environ.get("PREPROCESS_VARIANT", "clahe")
stage = os.environ.get("TRAIN_STAGE", "full")
batch_size = int(os.environ.get("BATCH_SIZE", "2"))
num_workers = int(os.environ.get("NUM_WORKERS", "4"))
max_iters = int(os.environ.get("MAX_ITERS", "16000"))
val_interval = int(os.environ.get("VAL_INTERVAL", "1000"))
experiment_name = make_experiment_name("segformer_b2", preprocess_variant, fog_beta, crop_size, seed, stage)

model = build_model(crop_size=crop_size)
optim_wrapper = build_optim_wrapper(lr=float(os.environ.get("LEARNING_RATE", "2e-5")))
param_scheduler = build_param_scheduler(max_iters=max_iters)
train_dataloader, val_dataloader, test_dataloader = build_dataloaders(project_root, preprocess_variant, fog_beta, crop_size, batch_size, num_workers)
val_evaluator, test_evaluator = build_evaluators()
locals().update(build_runtime(project_root, experiment_name, max_iters=max_iters, val_interval=val_interval, seed=seed))
