import React, { useRef } from 'react';
import {
  Upload,
  Download,
  Wand2,
  Image as ImageIcon,
  Film,
  Sparkles,
  ChevronDown,
  Camera,
} from 'lucide-react';
import { MediaMode } from '../types';

interface Props {
  mediaMode: MediaMode;
  onMediaModeChange: (mode: MediaMode) => void;
  onImageUploaded: (dataUrl: string, filename: string) => void;
  onVideoUploaded: (file: File) => void;
  onOpenAiStudio: () => void;
  onExportImage: (format: 'image/png' | 'image/jpeg' | 'image/webp') => void;
  onExportVideo: () => void;
  onCaptureVideoFrame?: () => void;
  isProcessing: boolean;
  filename: string;
}

export const Header: React.FC<Props> = ({
  mediaMode,
  onMediaModeChange,
  onImageUploaded,
  onVideoUploaded,
  onOpenAiStudio,
  onExportImage,
  onExportVideo,
  onCaptureVideoFrame,
  isProcessing,
  filename,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [showExportMenu, setShowExportMenu] = React.useState<boolean>(false);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onImageUploaded(result, file.name);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onVideoUploaded(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/90 px-3 sm:px-8 py-3 flex items-center justify-between shadow-lg gap-2">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/25 border border-cyan-400/30 shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            UltraHD Enhancer
            <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-full">
              4K Studio
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden md:block truncate max-w-[260px]">
            {filename ? `Active: ${filename}` : 'Ultra-high quality 4K upscaler'}
          </p>
        </div>
      </div>

      {/* Center Media Mode Switcher (Image 4K vs Video 4K) */}
      <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
        <button
          id="tab-mode-image"
          onClick={() => onMediaModeChange('image')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mediaMode === 'image'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Image 4K</span>
        </button>

        <button
          id="tab-mode-video"
          onClick={() => onMediaModeChange('video')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mediaMode === 'video'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Video 4K</span>
          <span className="text-[9px] px-1 bg-cyan-400/20 text-cyan-300 rounded font-mono">
            UHD
          </span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Hidden File Inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFileChange}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoFileChange}
        />

        {/* Upload Button based on mode */}
        {mediaMode === 'image' ? (
          <button
            id="btn-upload-image"
            onClick={() => imageInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/70 transition-all shadow-sm active:scale-95"
            title="Upload an image to enhance"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Upload Image</span>
          </button>
        ) : (
          <button
            id="btn-upload-video"
            onClick={() => videoInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/70 transition-all shadow-sm active:scale-95"
            title="Upload a video to upscale to 4K"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Upload Video</span>
          </button>
        )}

        {/* Gemini AI Studio Button */}
        <button
          id="btn-open-ai-studio"
          onClick={onOpenAiStudio}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 rounded-xl text-xs font-bold border border-cyan-500/40 transition-all shadow-sm active:scale-95"
        >
          <Wand2 className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">Gemini AI Studio</span>
          <span className="md:hidden">AI</span>
        </button>

        {/* Export Button / Dropdown */}
        {mediaMode === 'image' ? (
          <div className="relative">
            <button
              id="btn-export-dropdown"
              onClick={() => setShowExportMenu((v) => !v)}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Export (≤ 50 MB)</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {showExportMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <div className="px-3.5 pb-2 mb-1 border-b border-slate-800 text-[11px] text-slate-400">
                  <span className="font-semibold text-emerald-400">High Quality Guarantee:</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Optimized for highest resolution &amp; clarity strictly within 50 MB limit.
                  </p>
                </div>

                <button
                  id="export-png-4k"
                  onClick={() => {
                    onExportImage('image/png');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-800/80 text-xs text-slate-200 hover:text-white flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">Ultra-HD PNG</div>
                    <div className="text-[10px] text-slate-400">Max resolution lossless (≤ 50 MB)</div>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    Lossless
                  </span>
                </button>

                <button
                  id="export-jpeg-max"
                  onClick={() => {
                    onExportImage('image/jpeg');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-800/80 text-xs text-slate-200 hover:text-white flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">Studio JPEG (100%)</div>
                    <div className="text-[10px] text-slate-400">High fidelity photo export (≤ 50 MB)</div>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                    100% Q
                  </span>
                </button>

                <button
                  id="export-webp"
                  onClick={() => {
                    onExportImage('image/webp');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-800/80 text-xs text-slate-200 hover:text-white flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">High-DPI WebP</div>
                    <div className="text-[10px] text-slate-400">Ultra-sharp web standard (≤ 50 MB)</div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Ultra-Crisp
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              id="btn-header-export-video"
              onClick={onExportVideo}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Export 4K Video</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
