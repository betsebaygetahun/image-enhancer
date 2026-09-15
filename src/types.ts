export type MediaMode = 'image' | 'video';

export interface ImageEnhancementOptions {
  scale: 1 | 2 | 4;
  sharpness: number; // 0 to 100
  denoise: number; // 0 to 100
  clarity: number; // 0 to 100
  detailBoost: number; // 0 to 100
  preserveColors: boolean;
  exposureFix: number; // -50 to +50
}

export type VideoResolutionTarget = '4k' | '2k' | '1080p' | 'original';

export interface VideoEnhancementOptions {
  scale: 1 | 2 | 4;
  targetResolution: VideoResolutionTarget;
  sharpness: number; // 0 to 100
  denoise: number; // 0 to 100
  clarity: number; // 0 to 100
  contrast: number; // 80 to 150 (%)
  saturation: number; // 80 to 150 (%)
  brightness: number; // 80 to 130 (%)
  detailBoost: number; // 0 to 100
  fps: 24 | 30 | 60;
  highQualityFilter: boolean;
}

export interface VideoPreset {
  id: string;
  name: string;
  desc: string;
  badge?: string;
  options: VideoEnhancementOptions;
}

export interface VideoMetadata {
  name: string;
  width: number;
  height: number;
  duration: number;
  fileSizeBytes?: number;
  url: string;
}

export interface VideoExportProgress {
  isExporting: boolean;
  progressPercent: number; // 0 to 100
  currentFrame?: number;
  totalFrames?: number;
  elapsedSeconds?: number;
  statusText: string;
  outputBlobUrl?: string;
  outputSizeBytes?: number;
}
