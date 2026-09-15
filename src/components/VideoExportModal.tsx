import React from 'react';
import {
  Film,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Loader2,
  HardDrive,
} from 'lucide-react';
import { VideoExportProgress } from '../types';

interface Props {
  exportProgress: VideoExportProgress;
  onClose: () => void;
}

export const VideoExportModal: React.FC<Props> = ({ exportProgress, onClose }) => {
  if (!exportProgress.isExporting && !exportProgress.outputBlobUrl) {
    return null;
  }

  const isDone = exportProgress.progressPercent >= 100 && !!exportProgress.outputBlobUrl;
  const sizeMb = exportProgress.outputSizeBytes
    ? (exportProgress.outputSizeBytes / (1024 * 1024)).toFixed(2)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 flex flex-col gap-5 overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {isDone ? '4K Video Ready' : 'Exporting 4K UHD Video'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isDone ? 'Encoding finished successfully' : 'Real-time super-sampling in progress'}
              </p>
            </div>
          </div>

          {isDone && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Graphic & Progress */}
        <div className="flex flex-col items-center justify-center py-4 gap-3 text-center">
          {isDone ? (
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-in zoom-in-95">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          ) : (
            <div className="relative w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              <Sparkles className="w-4 h-4 absolute top-2 right-2 text-cyan-300 animate-pulse" />
            </div>
          )}

          <div className="flex flex-col gap-1 max-w-[320px]">
            <span className="text-sm font-semibold text-white">
              {exportProgress.statusText}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Progress: {exportProgress.progressPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress.progressPercent}%` }}
            />
          </div>
        </div>

        {/* File Size Guarantee Info */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span>Target Size Limit:</span>
          </div>
          <div className="font-mono">
            {sizeMb ? (
              <span className="text-emerald-400 font-bold">{sizeMb} MB (≤ 50 MB)</span>
            ) : (
              <span className="text-slate-400">Strictly ≤ 50 MB</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isDone && exportProgress.outputBlobUrl ? (
          <div className="flex items-center gap-3">
            <a
              id="btn-download-exported-video"
              href={exportProgress.outputBlobUrl}
              download="enhanced_4k_video.webm"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download 4K Video</span>
            </a>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        ) : (
          <p className="text-[11px] text-center text-slate-500">
            Please keep this tab active while the 4K frames are rendering into the stream.
          </p>
        )}
      </div>
    </div>
  );
};
