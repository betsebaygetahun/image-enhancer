import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Sliders,
  Columns,
  Eye,
  Camera,
  FastForward,
} from 'lucide-react';
import { VideoEnhancementOptions } from '../types';
import {
  calculateTargetDimensions,
  renderEnhancedVideoFrame,
  capture4KSnapshot,
} from '../utils/videoEnhancer';

interface Props {
  videoUrl: string;
  filename: string;
  options: VideoEnhancementOptions;
  onSnapshotTaken?: (name: string) => void;
}

export const VideoComparisonPlayer: React.FC<Props> = ({
  videoUrl,
  filename,
  options,
  onSnapshotTaken,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const enhancedCanvasRef = useRef<HTMLCanvasElement>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Comparison & View state
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100%
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side' | 'enhanced-only'>('split');

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Video resolution metadata
  const [videoDims, setVideoDims] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080,
  });

  const targetDims = calculateTargetDimensions(
    videoDims.width,
    videoDims.height,
    options.targetResolution,
    options.scale
  );

  // Update canvas resolution when target dimensions change
  useEffect(() => {
    if (enhancedCanvasRef.current) {
      enhancedCanvasRef.current.width = targetDims.width;
      enhancedCanvasRef.current.height = targetDims.height;
    }
  }, [targetDims.width, targetDims.height]);

  // Video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const v = videoRef.current;
      setDuration(v.duration || 0);
      setVideoDims({
        width: v.videoWidth || 1920,
        height: v.videoHeight || 1080,
      });
      // Initial render of first frame to canvas
      if (enhancedCanvasRef.current) {
        renderEnhancedVideoFrame(v, enhancedCanvasRef.current, options, true);
      }
    }
  };

  // Continuous frame sync loop for enhanced canvas
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      if (videoRef.current && enhancedCanvasRef.current) {
        renderEnhancedVideoFrame(videoRef.current, enhancedCanvasRef.current, options, false);
        setCurrentTime(videoRef.current.currentTime);
      }
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [options]);

  // Play/Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Scrubber change
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      if (enhancedCanvasRef.current) {
        renderEnhancedVideoFrame(videoRef.current, enhancedCanvasRef.current, options, true);
      }
    }
  };

  // Frame step (+/- seconds)
  const stepTime = (delta: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Slider drag handling
  const handleSliderMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1 && e.button === 0 && !isDraggingSlider) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSlider) {
      handleSliderMove(e.clientX);
    } else if (isPanning && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingSlider(false);
    setIsPanning(false);
  };

  // Snapshot capture
  const handleTakeSnapshot = async () => {
    if (!videoRef.current) return;
    const snap = await capture4KSnapshot(videoRef.current, options, filename);
    if (onSnapshotTaken) {
      onSnapshotTaken(snap.filename);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full flex flex-col bg-slate-950 select-none overflow-hidden ${
        isFullscreen ? 'p-0' : 'rounded-2xl border border-slate-800'
      }`}
    >
      {/* Top Floating Info Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Resolution Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-lg text-xs">
            <span className="text-slate-400 font-mono">
              Source: <strong className="text-slate-200">{videoDims.width}×{videoDims.height}</strong>
            </span>
            <span className="text-cyan-400">➔</span>
            <span className="text-cyan-300 font-mono font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              4K Enhanced ({targetDims.width}×{targetDims.height})
            </span>
          </div>

          {/* Preset indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/80 backdrop-blur-md rounded-lg border border-cyan-500/30 text-[11px] text-cyan-300 font-medium">
            <span>Sharpness +{options.sharpness}%</span>
            <span>•</span>
            <span>Contrast {options.contrast}%</span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto">
          <button
            id="view-mode-split"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'split'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Interactive Split Comparison Slider"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split Slider</span>
          </button>

          <button
            id="view-mode-side-by-side"
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Side-by-Side Dual View"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Side by Side</span>
          </button>

          <button
            id="view-mode-enhanced-only"
            onClick={() => setViewMode('enhanced-only')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'enhanced-only'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Full 4K Enhanced Only"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">4K Only</span>
          </button>
        </div>
      </div>

      {/* Main Video Stage */}
      <div
        className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden cursor-default bg-black/60"
        onMouseDown={handleMouseDown}
      >
        {/* Hidden Master Video Element (Provides stream & time) */}
        <video
          ref={videoRef}
          src={videoUrl}
          playsInline
          loop={isLooping}
          muted={isMuted}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          className={viewMode === 'side-by-side' || viewMode === 'split' ? 'hidden' : 'hidden'}
        />

        {/* View Mode: Split Comparison Slider */}
        {viewMode === 'split' && (
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transformOrigin: 'center center',
            }}
          >
            {/* Enhanced 4K Canvas (Background Layer) */}
            <canvas
              ref={enhancedCanvasRef}
              className="max-w-full max-h-full object-contain pointer-events-none select-none shadow-2xl"
              style={{ width: '100%', height: '100%' }}
            />

            {/* Original Video (Foreground Clipped Layer) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              <video
                src={videoUrl}
                playsInline
                muted
                loop={isLooping}
                ref={(el) => {
                  if (el && videoRef.current) {
                    el.currentTime = videoRef.current.currentTime;
                    if (isPlaying && el.paused) el.play();
                    if (!isPlaying && !el.paused) el.pause();
                  }
                }}
                className="max-w-full max-h-full object-contain w-full h-full"
              />
            </div>

            {/* Split Handle Divider Line */}
            <div
              className="absolute top-0 bottom-0 z-20 cursor-ew-resize group"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDraggingSlider(true);
              }}
              onTouchStart={() => setIsDraggingSlider(true)}
            >
              {/* Vertical Glowing Line */}
              <div className="w-[3px] h-full bg-gradient-to-b from-cyan-400 via-white to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.9)]" />

              {/* Center Draggable Knob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-400 shadow-xl shadow-cyan-500/50 flex items-center justify-center text-cyan-300 transition-transform group-hover:scale-110 active:scale-95">
                <Sliders className="w-3.5 h-3.5" />
              </div>

              {/* Labels on each side */}
              <div className="absolute top-16 right-4 -translate-y-1/2 px-2 py-0.5 bg-black/75 backdrop-blur-md rounded border border-slate-700 text-[10px] font-bold text-slate-300 whitespace-nowrap pointer-events-none">
                Original
              </div>
              <div className="absolute top-16 left-4 -translate-y-1/2 px-2 py-0.5 bg-cyan-950/80 backdrop-blur-md rounded border border-cyan-500/40 text-[10px] font-bold text-cyan-300 whitespace-nowrap pointer-events-none">
                4K Ultra-Sharp
              </div>
            </div>
          </div>
        )}

        {/* View Mode: Side by Side Dual View */}
        {viewMode === 'side-by-side' && (
          <div
            className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-3 p-4"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transformOrigin: 'center center',
            }}
          >
            {/* Left: Original Video */}
            <div className="relative flex flex-col items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-slate-800">
              <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md text-[11px] font-semibold text-slate-300 border border-slate-700">
                Original Input ({videoDims.width}×{videoDims.height})
              </span>
              <video
                src={videoUrl}
                playsInline
                muted
                loop={isLooping}
                ref={(el) => {
                  if (el && videoRef.current) {
                    el.currentTime = videoRef.current.currentTime;
                    if (isPlaying && el.paused) el.play();
                    if (!isPlaying && !el.paused) el.pause();
                  }
                }}
                className="max-w-full max-h-full object-contain w-full h-full"
              />
            </div>

            {/* Right: 4K Enhanced Canvas */}
            <div className="relative flex flex-col items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-cyan-500/30">
              <span className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-cyan-950/90 text-cyan-300 backdrop-blur-md rounded-md text-[11px] font-bold border border-cyan-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                4K UHD ({targetDims.width}×{targetDims.height})
              </span>
              <canvas
                ref={enhancedCanvasRef}
                className="max-w-full max-h-full object-contain w-full h-full"
              />
            </div>
          </div>
        )}

        {/* View Mode: Enhanced Only */}
        {viewMode === 'enhanced-only' && (
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transformOrigin: 'center center',
            }}
          >
            <canvas
              ref={enhancedCanvasRef}
              className="max-w-full max-h-full object-contain w-full h-full"
            />
            <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-cyan-950/80 backdrop-blur-md rounded-lg border border-cyan-500/40 text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              4K Enhanced Mode
            </div>
          </div>
        )}
      </div>

      {/* Bottom Video Controls Toolbar */}
      <div className="z-30 w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/90 p-3 sm:p-4 flex flex-col gap-2">
        {/* Scrubber Progress Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400 min-w-[36px]">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1 flex items-center group">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.01}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />
          </div>
          <span className="text-[11px] font-mono text-slate-400 min-w-[36px]">
            {formatTime(duration)}
          </span>
        </div>

        {/* Playback Buttons & Utilities */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Left Controls: Play, Step, Volume */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Play/Pause Button */}
            <button
              id="btn-video-play-toggle"
              onClick={togglePlay}
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center shadow-md shadow-cyan-500/25 active:scale-95 transition-all"
              title={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            {/* Step Backward 1s */}
            <button
              onClick={() => stepTime(-1)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all text-xs"
              title="Step -1 second"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Step Forward 1s */}
            <button
              onClick={() => stepTime(1)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all text-xs"
              title="Step +1 second"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>

            {/* Volume / Mute */}
            <button
              onClick={() => {
                const next = !isMuted;
                setIsMuted(next);
                if (videoRef.current) videoRef.current.muted = next;
              }}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Speed Selector */}
            <select
              value={playbackRate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value);
                setPlaybackRate(rate);
                if (videoRef.current) videoRef.current.playbackRate = rate;
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>
          </div>

          {/* Right Controls: Snapshot 4K Frame, Zoom, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Take 4K Frame Snapshot */}
            <button
              id="btn-take-4k-snapshot"
              onClick={handleTakeSnapshot}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-all shadow-sm active:scale-95"
              title="Export current frame in 4K UHD"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Capture 4K Frame</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                disabled={zoomLevel <= 1}
                className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-400 px-1">{zoomLevel.toFixed(1)}x</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.5))}
                disabled={zoomLevel >= 3}
                className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
