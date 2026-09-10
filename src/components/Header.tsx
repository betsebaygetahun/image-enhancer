import React, { useRef } from 'react';
import {
  Upload,
  Download,
  Wand2,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  FileCheck,
} from 'lucide-react';

interface Props {
  onImageUploaded: (dataUrl: string, filename: string) => void;
  onOpenAiStudio: () => void;
  onExport: (format: 'image/png' | 'image/jpeg' | 'image/webp') => void;
  isProcessing: boolean;
  filename: string;
}

export const Header: React.FC<Props> = ({
  onImageUploaded,
  onOpenAiStudio,
  onExport,
  isProcessing,
  filename,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExportMenu, setShowExportMenu] = React.useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // Reset file input value so same file can be re-uploaded if needed
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/90 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/25 border border-cyan-400/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            UltraHD Image Enhancer
            <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-full">
              4K Studio
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-[280px]">
            {filename ? `Active: ${filename}` : 'Ultra-high quality & resolution engine'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Upload Button */}
        <button
          id="btn-upload-image"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/70 transition-all shadow-sm active:scale-95"
          title="Upload an image to enhance"
        >
          <Upload className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Upload Image</span>
        </button>

        {/* Gemini AI Studio Button */}
        <button
          id="btn-open-ai-studio"
          onClick={onOpenAiStudio}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 rounded-xl text-xs font-bold border border-cyan-500/40 transition-all shadow-sm active:scale-95"
        >
          <Wand2 className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">Gemini AI Studio</span>
          <span className="md:hidden">AI Studio</span>
        </button>

        {/* Export Menu Dropdown */}
        <div className="relative">
          <button
            id="btn-export-dropdown"
            onClick={() => setShowExportMenu((v) => !v)}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all active:scale-95 disabled:opacity-50"
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
                  onExport('image/png');
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
                  onExport('image/jpeg');
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
                  onExport('image/webp');
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
      </div>
    </header>
  );
};
