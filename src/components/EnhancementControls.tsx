import React from 'react';
import {
  Sparkles,
  Sliders,
  ShieldCheck,
  Zap,
  RotateCcw,
  Layers,
  Sun,
  Wand2,
} from 'lucide-react';
import { EnhancementOptions, PRESETS, DEFAULT_OPTIONS } from '../utils/imageEnhancer';

interface Props {
  options: EnhancementOptions;
  onChange: (options: EnhancementOptions) => void;
  onReset: () => void;
  onTriggerAiEnhance: () => void;
  isAiEnhancing: boolean;
  activePreset: string | null;
  onSelectPreset: (presetKey: string) => void;
}

export const EnhancementControls: React.FC<Props> = ({
  options,
  onChange,
  onReset,
  onTriggerAiEnhance,
  isAiEnhancing,
  activePreset,
  onSelectPreset,
}) => {
  const updateOption = <K extends keyof EnhancementOptions>(key: K, value: EnhancementOptions[K]) => {
    onChange({
      ...options,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col gap-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800/80 shadow-xl backdrop-blur-md">
      {/* Header & Quick Action */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white tracking-wide">Enhancement Studio</h2>
        </div>
        <button
          id="btn-reset-enhancements"
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          title="Reset to default settings"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* AI One-Click Deep Enhance Action */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 border border-cyan-500/30 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
              <Wand2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-white">Gemini 3.1 Neural Enhance</h3>
              <p className="text-[11px] text-slate-300">
                AI deep reconstruction: 100% composition fidelity
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
            Cloud AI
          </span>
        </div>

        <button
          id="btn-ai-deep-enhance"
          onClick={onTriggerAiEnhance}
          disabled={isAiEnhancing}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {isAiEnhancing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Synthesizing Ultra-Res with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Gemini 3.1 AI Super-Resolution</span>
            </>
          )}
        </button>
      </div>

      {/* Instant Presets */}
      <div>
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Optimization Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              id={`preset-${key}`}
              onClick={() => onSelectPreset(key)}
              className={`text-left p-2.5 rounded-xl border transition-all ${
                activePreset === key
                  ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Zap className="w-3 h-3 text-cyan-400" />
                {p.name}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                {p.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Scale & Super-Sampling Target */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Target Resolution Scale
          </span>
          <span className="font-mono text-cyan-400 font-bold">
            {options.scale === 4 ? '4x Ultra-HD 4K' : options.scale === 2 ? '2x Quad-HD' : '1x Native'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            id="scale-1x"
            onClick={() => updateOption('scale', 1)}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              options.scale === 1 ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            1x Native
          </button>
          <button
            id="scale-2x"
            onClick={() => updateOption('scale', 2)}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              options.scale === 2 ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            2x HD
          </button>
          <button
            id="scale-4x"
            onClick={() => updateOption('scale', 4)}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              options.scale === 4 ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            4x 4K UHD
          </button>
        </div>
      </div>

      {/* Manual Fine-Tuning Sliders */}
      <div className="space-y-4 pt-2 border-t border-slate-800/90">
        {/* Sharpness & Edge Crispness */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-slate-300">Sharpness &amp; De-blur</span>
            <span className="font-mono text-cyan-400 font-bold">{options.sharpness}%</span>
          </div>
          <input
            id="slider-sharpness"
            type="range"
            min="0"
            max="100"
            value={options.sharpness}
            onChange={(e) => updateOption('sharpness', Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block">
            Recovers high-frequency edges for letters, eyes, and wrinkles
          </span>
        </div>

        {/* Noise & Artifact Removal */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-slate-300">Denoise &amp; Artifact Cleaner</span>
            <span className="font-mono text-cyan-400 font-bold">{options.denoise}%</span>
          </div>
          <input
            id="slider-denoise"
            type="range"
            min="0"
            max="100"
            value={options.denoise}
            onChange={(e) => updateOption('denoise', Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block">
            Bilateral filter removes JPEG blocks &amp; grain without blurring edges
          </span>
        </div>

        {/* Micro-Contrast / Clarity */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-slate-300">Clarity &amp; Micro-Contrast</span>
            <span className="font-mono text-cyan-400 font-bold">{options.clarity}%</span>
          </div>
          <input
            id="slider-clarity"
            type="range"
            min="0"
            max="100"
            value={options.clarity}
            onChange={(e) => updateOption('clarity', Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block">
            Dehazes and enhances local dynamic depth without blowing highlights
          </span>
        </div>

        {/* Texture & Detail Boost */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-slate-300">Texture &amp; Fine Detail</span>
            <span className="font-mono text-cyan-400 font-bold">{options.detailBoost}%</span>
          </div>
          <input
            id="slider-detail-boost"
            type="range"
            min="0"
            max="100"
            value={options.detailBoost}
            onChange={(e) => updateOption('detailBoost', Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block">
            Enhances skin pores, hair strands, fabric weave, and glowing neon
          </span>
        </div>

        {/* Dynamic Exposure Balancer */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-slate-300 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" />
              Exposure Balance
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              {options.exposureFix > 0 ? `+${options.exposureFix}` : options.exposureFix}
            </span>
          </div>
          <input
            id="slider-exposure"
            type="range"
            min="-30"
            max="30"
            value={options.exposureFix}
            onChange={(e) => updateOption('exposureFix', Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Fidelity Guarantee Badge */}
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-300 leading-snug space-y-1">
          <div>
            <span className="font-bold text-emerald-300">100% Identity Preserved:</span> Exact composition,
            typography, facial features, and lighting are maintained.
          </div>
          <div className="text-[10px] text-emerald-400/90 font-medium">
            <span className="font-bold">File Size Bounded:</span> High-quality exports are strictly guaranteed at ≤ 50 MB with adaptive lossless and ultra-high dynamic compression.
          </div>
        </div>
      </div>
    </div>
  );
};
