import React from 'react';
import {
  Sparkles,
  Sliders,
  RotateCcw,
  Zap,
  Film,
  Download,
  Camera,
  Activity,
  Layers,
  Sun,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import { VideoEnhancementOptions, VideoResolutionTarget } from '../types';
import { VIDEO_PRESETS, DEFAULT_VIDEO_OPTIONS } from '../utils/videoEnhancer';

interface Props {
  options: VideoEnhancementOptions;
  onOptionsChange: (newOptions: VideoEnhancementOptions) => void;
  activePreset: string | null;
  onSelectPreset: (presetKey: string) => void;
  onReset: () => void;
  onExportClick: () => void;
  isExporting: boolean;
  srcResolution?: { width: number; height: number };
}

export const VideoEnhancementControls: React.FC<Props> = ({
  options,
  onOptionsChange,
  activePreset,
  onSelectPreset,
  onReset,
  onExportClick,
  isExporting,
  srcResolution,
}) => {
  const handleResolutionChange = (target: VideoResolutionTarget) => {
    onOptionsChange({
      ...options,
      targetResolution: target,
      scale: target === '4k' ? 2 : target === '2k' ? 2 : 1,
    });
  };

  const handleSliderChange = (key: keyof VideoEnhancementOptions, val: number) => {
    onOptionsChange({
      ...options,
      [key]: val,
    });
  };

  return (
    <aside className="w-full lg:w-84 xl:w-96 bg-slate-950/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-5 shadow-2xl overflow-y-auto max-h-[calc(100vh-100px)]">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              4K Video Enhancement
            </h2>
            <span className="text-[10px] text-slate-400">
              Super-resolution neural pipeline
            </span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-slate-800/60 transition-colors"
          title="Reset to default video settings"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Target Resolution Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Target Upscale Resolution
          </span>
          <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">
            {options.targetResolution.toUpperCase()}
          </span>
        </label>

        <div className="grid grid-cols-3 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleResolutionChange('4k')}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
              options.targetResolution === '4k'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>4K UHD</span>
            <span className="text-[9px] font-normal opacity-80">3840×2160</span>
          </button>

          <button
            onClick={() => handleResolutionChange('2k')}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
              options.targetResolution === '2k'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>2K QHD</span>
            <span className="text-[9px] font-normal opacity-80">2560×1440</span>
          </button>

          <button
            onClick={() => handleResolutionChange('1080p')}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
              options.targetResolution === '1080p'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>1080p</span>
            <span className="text-[9px] font-normal opacity-80">1920×1080</span>
          </button>
        </div>
      </div>

      {/* 4K Video Presets */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Enhancement Presets
          </span>
          <span className="text-[10px] text-slate-400">100% composition kept</span>
        </label>

        <div className="grid grid-cols-1 gap-1.5">
          {Object.entries(VIDEO_PRESETS).map(([key, preset]) => {
            const isSelected = activePreset === key;
            return (
              <button
                key={key}
                onClick={() => onSelectPreset(key)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-cyan-300' : 'text-slate-200'
                      }`}
                    >
                      {preset.name}
                    </span>
                    {preset.badge && (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                        {preset.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {preset.desc}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders: Fine-Tuning */}
      <div className="flex flex-col gap-4 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Neural Fine-Tuning
          </span>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Live Real-time
          </span>
        </div>

        {/* Sharpness & Edge Definition */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Sharpness &amp; Edge Definition</span>
            <span className="text-cyan-400 font-mono font-bold">{options.sharpness}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={options.sharpness}
            onChange={(e) => handleSliderChange('sharpness', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Subtle</span>
            <span>Balanced</span>
            <span>Ultra Crisp</span>
          </div>
        </div>

        {/* Motion & Temporal De-Noising */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">De-Noise &amp; Compression Fix</span>
            <span className="text-cyan-400 font-mono font-bold">{options.denoise}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={options.denoise}
            onChange={(e) => handleSliderChange('denoise', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Raw</span>
            <span>Clean Artifacts</span>
            <span>Ultra Smooth</span>
          </div>
        </div>

        {/* Micro-Contrast & Clarity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Micro-Contrast &amp; Clarity</span>
            <span className="text-cyan-400 font-mono font-bold">{options.clarity}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={options.clarity}
            onChange={(e) => handleSliderChange('clarity', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Dynamic Contrast */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Contrast Curve</span>
            <span className="text-cyan-400 font-mono font-bold">{options.contrast}%</span>
          </div>
          <input
            type="range"
            min={80}
            max={140}
            value={options.contrast}
            onChange={(e) => handleSliderChange('contrast', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Color Saturation / Vibrance */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Color Vibrance</span>
            <span className="text-cyan-400 font-mono font-bold">{options.saturation}%</span>
          </div>
          <input
            type="range"
            min={80}
            max={140}
            value={options.saturation}
            onChange={(e) => handleSliderChange('saturation', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Exposure / Brightness */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Exposure &amp; Shadow Lift</span>
            <span className="text-cyan-400 font-mono font-bold">{options.brightness}%</span>
          </div>
          <input
            type="range"
            min={85}
            max={125}
            value={options.brightness}
            onChange={(e) => handleSliderChange('brightness', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* Big Action: Export 4K Video */}
      <div className="pt-2 flex flex-col gap-2">
        <button
          id="btn-export-4k-video"
          onClick={onExportClick}
          disabled={isExporting}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export 4K Video (≤ 50 MB)</span>
        </button>

        <p className="text-[11px] text-center text-slate-400 leading-tight">
          Guaranteed high-quality 4K UHD export strictly under the 50 MB file limit. Audio preserved.
        </p>
      </div>
    </aside>
  );
};
