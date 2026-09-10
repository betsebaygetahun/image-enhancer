import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Move, Eye, Sparkles } from 'lucide-react';

interface Props {
  originalSrc: string;
  enhancedCanvas: HTMLCanvasElement | null;
  originalDimensions: { width: number; height: number };
  enhancedDimensions: { width: number; height: number };
  isProcessing: boolean;
}

export const ImageComparisonSlider: React.FC<Props> = ({
  originalSrc,
  enhancedCanvas,
  originalDimensions,
  enhancedDimensions,
  isProcessing,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1x, 2x, 3x, 4x
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side' | 'enhanced-only'>('split');
  const [enhancedDataUrl, setEnhancedDataUrl] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync enhanced canvas to dataURL for rendering
  useEffect(() => {
    if (enhancedCanvas) {
      try {
        setEnhancedDataUrl(enhancedCanvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Could not generate dataURL from enhancedCanvas:', err);
      }
    }
  }, [enhancedCanvas]);

  const handleSliderMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1 && e.button === 0 && !isDragging) {
      // Pan mode
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    } else if (isPanning && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#0a0f16] rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-slate-800/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            {enhancedDimensions.width > 0
              ? `${enhancedDimensions.width} × ${enhancedDimensions.height} px (${Math.round((enhancedDimensions.width * enhancedDimensions.height) / 1000000)} MP UHD)`
              : 'Enhancer Ready'}
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
            Input: {originalDimensions.width} × {originalDimensions.height} px
          </span>
        </div>

        {/* View & Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-800/90 p-0.5 rounded-lg border border-slate-700/60">
            <button
              id="mode-split"
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'split'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Split View
            </button>
            <button
              id="mode-side-by-side"
              onClick={() => setViewMode('side-by-side')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side-by-Side
            </button>
            <button
              id="mode-enhanced-only"
              onClick={() => setViewMode('enhanced-only')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'enhanced-only'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Enhanced Only
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-800/90 rounded-lg border border-slate-700/60 px-1 py-0.5">
            <button
              id="btn-zoom-out"
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
              disabled={zoomLevel <= 1}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-medium text-slate-300 px-1.5 min-w-[32px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              id="btn-zoom-in"
              onClick={() => setZoomLevel((z) => Math.min(4, z + 0.5))}
              disabled={zoomLevel >= 4}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel > 1 && (
              <button
                id="btn-reset-zoom"
                onClick={resetZoom}
                className="text-[10px] text-cyan-400 hover:underline ml-1 px-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Canvas / Image Preview Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsDragging(false)}
        className={`relative flex-1 w-full h-[520px] md:h-[620px] overflow-hidden select-none bg-[#070b10] flex items-center justify-center ${
          zoomLevel > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
        }`}
      >
        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border-3 border-cyan-500 border-t-transparent animate-spin" />
            <p className="text-sm font-semibold text-white tracking-wide">
              Rendering High-Resolution Super-Sample...
            </p>
            <span className="text-xs text-cyan-300/80">
              Applying unsharp mask, bilateral denoising, and micro-contrast
            </span>
          </div>
        )}

        {/* View Mode: Side by Side */}
        {viewMode === 'side-by-side' && (
          <div
            className="w-full h-full grid grid-cols-2 gap-2 p-3"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <div className="relative flex flex-col items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-slate-800">
              <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-md text-[11px] font-semibold text-slate-300 border border-slate-700">
                Original Input
              </span>
              <img
                src={originalSrc}
                alt="Original"
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative flex flex-col items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-slate-800">
              <span className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-cyan-950/80 text-cyan-300 backdrop-blur-md rounded-md text-[11px] font-semibold border border-cyan-500/30">
                Enhanced 4K UHD
              </span>
              <img
                src={enhancedDataUrl || originalSrc}
                alt="Enhanced"
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}

        {/* View Mode: Enhanced Only */}
        {viewMode === 'enhanced-only' && (
          <div
            className="relative w-full h-full flex items-center justify-center p-2"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <span className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-cyan-950/80 text-cyan-300 backdrop-blur-md rounded-lg text-xs font-bold border border-cyan-500/30 shadow-lg">
              ✨ 100% Enhanced Ultra-HD
            </span>
            <img
              src={enhancedDataUrl || originalSrc}
              alt="Enhanced 100%"
              className="max-w-full max-h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* View Mode: Interactive Split Slider */}
        {viewMode === 'split' && (
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            {/* Enhanced Image (Base layer) */}
            <img
              src={enhancedDataUrl || originalSrc}
              alt="Enhanced Preview"
              className="absolute max-w-full max-h-full object-contain pointer-events-none"
              referrerPolicy="no-referrer"
            />

            {/* Original Image (Clipped layer on left) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              <img
                src={originalSrc}
                alt="Original Preview"
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none px-3 py-1.5 bg-black/75 backdrop-blur-md rounded-lg text-xs font-bold text-slate-300 border border-slate-700/80 shadow-md">
              Original
            </div>
            <div className="absolute top-4 right-4 z-20 pointer-events-none px-3 py-1.5 bg-cyan-950/85 backdrop-blur-md rounded-lg text-xs font-bold text-cyan-300 border border-cyan-500/40 shadow-md">
              Enhanced (Ultra-Sharp)
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 z-30 flex items-center justify-center cursor-ew-resize touch-none"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDragging(true);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                setIsDragging(true);
              }}
            >
              {/* Divider vertical glow line */}
              <div className="w-[3px] h-full bg-gradient-to-b from-cyan-400 via-white to-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />

              {/* Slider Handle Knob */}
              <div className="absolute w-9 h-9 rounded-full bg-white text-slate-900 border-2 border-cyan-400 shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
                <Move className="w-4 h-4 text-slate-800" />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Helper Bar */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700/60 text-[11px] text-slate-400 flex items-center gap-2">
          <span>Drag the central divider to inspect sharpness and noise cleanup</span>
          {zoomLevel > 1 && <span className="text-cyan-400 font-semibold">• Click & drag to pan image</span>}
        </div>
      </div>
    </div>
  );
};
