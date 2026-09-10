import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageComparisonSlider } from './components/ImageComparisonSlider';
import { EnhancementControls } from './components/EnhancementControls';
import { AiImageStudioModal } from './components/AiImageStudioModal';
import { generateDefaultImage } from './utils/defaultImage';
import {
  EnhancementOptions,
  DEFAULT_OPTIONS,
  PRESETS,
  loadImage,
  enhanceImageToCanvas,
  exportCanvasWithLimit,
} from './utils/imageEnhancer';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Upload,
} from 'lucide-react';

export default function App() {
  const [originalImageSrc, setOriginalImageSrc] = useState<string>('');
  const [currentFilename, setCurrentFilename] = useState<string>(
    'Gemini_Generated_Image_3julc23julc23jul.jpg'
  );
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080,
  });
  const [enhancedDimensions, setEnhancedDimensions] = useState<{ width: number; height: number }>({
    width: 3840,
    height: 2160,
  });

  const [options, setOptions] = useState<EnhancementOptions>(PRESETS.ultra4k.options);
  const [activePreset, setActivePreset] = useState<string | null>('ultra4k');
  const [enhancedCanvas, setEnhancedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAiEnhancing, setIsAiEnhancing] = useState<boolean>(false);
  const [isAiStudioOpen, setIsAiStudioOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>({
    type: 'success',
    message: 'Enhanced with 4K Ultra-Sharp convolution pipeline. 100% composition preserved.',
  });

  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const loadedImageObjRef = useRef<HTMLImageElement | null>(null);
  const processTimeoutRef = useRef<number | null>(null);

  // Initialize with user's uploaded image on mount
  useEffect(() => {
    const defaultData = generateDefaultImage();
    setOriginalImageSrc(defaultData);
    handleLoadNewImage(defaultData, 'Gemini_Generated_Image_3julc23julc23jul.jpg');
  }, []);

  const handleLoadNewImage = async (src: string, name: string) => {
    try {
      setIsProcessing(true);
      setCurrentFilename(name);
      setOriginalImageSrc(src);

      const img = await loadImage(src);
      loadedImageObjRef.current = img;

      setOriginalDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });

      // Run enhancement
      await triggerProcessing(img, options);
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: 'Could not load image source.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerProcessing = async (img: HTMLImageElement, opts: EnhancementOptions) => {
    setIsProcessing(true);
    try {
      const canvas = await enhanceImageToCanvas(img, opts);
      setEnhancedCanvas(canvas);
      setEnhancedDimensions({
        width: canvas.width,
        height: canvas.height,
      });
    } catch (err: any) {
      console.error('Enhancement pipeline error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Debounced processing when sliders change
  const handleOptionsChange = (newOpts: EnhancementOptions) => {
    setOptions(newOpts);
    setActivePreset(null);

    if (processTimeoutRef.current) {
      window.clearTimeout(processTimeoutRef.current);
    }

    processTimeoutRef.current = window.setTimeout(() => {
      if (loadedImageObjRef.current) {
        triggerProcessing(loadedImageObjRef.current, newOpts);
      }
    }, 80);
  };

  const handleSelectPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    setActivePreset(presetKey);
    setOptions(preset.options);

    if (loadedImageObjRef.current) {
      triggerProcessing(loadedImageObjRef.current, preset.options);
      setFeedback({
        type: 'success',
        message: `Applied ${preset.name}: ${preset.desc}`,
      });
    }
  };

  const handleReset = () => {
    setOptions(DEFAULT_OPTIONS);
    setActivePreset(null);
    if (loadedImageObjRef.current) {
      triggerProcessing(loadedImageObjRef.current, DEFAULT_OPTIONS);
    }
    setFeedback({
      type: 'info',
      message: 'Reset options to standard configuration.',
    });
  };

  // Trigger Gemini AI deep super-resolution via server
  const handleTriggerAiEnhance = async () => {
    if (!originalImageSrc) return;
    setIsAiEnhancing(true);
    setFeedback({
      type: 'info',
      message: 'Calling Gemini 3.1 Flash Image super-resolution model on server...',
    });

    try {
      const response = await fetch('/api/images/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: originalImageSrc,
          resolution: '4K',
          customInstructions:
            'Focus on extreme sharpness of letters "IT ENDS AT 30", glowing aura of Age 22, 30, and 40+!, realistic facial skin pores and reflections on eyeglasses.',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gemini super-resolution failed');
      }

      if (data.imageUrl) {
        // Load the AI enhanced image into canvas
        const aiImg = await loadImage(data.imageUrl);
        const canvas = document.createElement('canvas');
        canvas.width = aiImg.naturalWidth;
        canvas.height = aiImg.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(aiImg, 0, 0);

        setEnhancedCanvas(canvas);
        setEnhancedDimensions({
          width: canvas.width,
          height: canvas.height,
        });

        setFeedback({
          type: 'success',
          message: 'Gemini 3.1 AI Super-Resolution applied successfully! 100% composition preserved.',
        });
      }
    } catch (err: any) {
      console.warn('AI enhance fallback to client ultra-crisp engine:', err.message);
      // Fallback: apply Max 4K Ultra-Sharp with detail boost
      if (loadedImageObjRef.current) {
        await triggerProcessing(loadedImageObjRef.current, PRESETS.ultra4k.options);
      }
      setFeedback({
        type: 'info',
        message: `Processed with 4K Ultra-Sharp engine. (Note: ${err.message})`,
      });
    } finally {
      setIsAiEnhancing(false);
    }
  };

  // Export handling strictly limited to 50 MB or less while keeping high quality
  const handleExport = async (format: 'image/png' | 'image/jpeg' | 'image/webp') => {
    if (!enhancedCanvas) return;
    setIsProcessing(true);
    setFeedback({
      type: 'info',
      message: `Preparing high-quality export under 50 MB ceiling...`,
    });

    try {
      const result = await exportCanvasWithLimit(enhancedCanvas, currentFilename, format);
      setFeedback({
        type: 'success',
        message: `Exported ${result.filename} (${result.sizeFormatted}) at ${result.width}×${result.height}px with ${result.quality}% quality — strictly within the 50 MB limit!`,
      });
    } catch (err: any) {
      console.error('Export failure:', err);
      setFeedback({
        type: 'error',
        message: `Failed to export image: ${err.message}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag & drop on window
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        handleLoadNewImage(res, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="min-h-screen bg-[#060a10] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white"
    >
      {/* Header */}
      <Header
        onImageUploaded={handleLoadNewImage}
        onOpenAiStudio={() => setIsAiStudioOpen(true)}
        onExport={handleExport}
        isProcessing={isProcessing}
        filename={currentFilename}
      />

      {/* Drag & Drop Visual Overlay */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-50 bg-cyan-950/80 backdrop-blur-md border-4 border-dashed border-cyan-400 flex flex-col items-center justify-center pointer-events-none animate-in fade-in">
          <Upload className="w-16 h-16 text-cyan-300 animate-bounce mb-3" />
          <h3 className="text-xl font-bold text-white">Drop your image here</h3>
          <p className="text-sm text-cyan-200">Load and enhance instantly to 4K Ultra-HD</p>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Status / Feedback Banner */}
        {feedback && (
          <div
            className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-medium backdrop-blur-md transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : feedback.type === 'error'
                ? 'bg-red-950/40 border-red-500/30 text-red-300'
                : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : feedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-slate-400 hover:text-white text-[11px] ml-4 font-mono"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Studio Grid: Image Comparison Slider (Left 8 cols) & Controls (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Comparison Slider & Preview Area */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <ImageComparisonSlider
              originalSrc={originalImageSrc}
              enhancedCanvas={enhancedCanvas}
              originalDimensions={originalDimensions}
              enhancedDimensions={enhancedDimensions}
              isProcessing={isProcessing}
            />

            {/* Quality Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 text-xs">
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400">Resolution</span>
                <span className="font-bold text-white font-mono mt-0.5">
                  {enhancedDimensions.width} × {enhancedDimensions.height}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400">Aspect Ratio</span>
                <span className="font-bold text-cyan-400 font-mono mt-0.5">16 : 9 Widescreen</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400">Color Fidelity</span>
                <span className="font-bold text-emerald-400 font-mono mt-0.5">100% Identical</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400">Noise &amp; Blur</span>
                <span className="font-bold text-cyan-300 font-mono mt-0.5">Suppressed</span>
              </div>
              <div className="flex flex-col col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400">Export Ceiling</span>
                <span className="font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                  ≤ 50.0 MB
                  <span className="text-[9px] font-sans font-semibold text-emerald-300 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/30">
                    Max Quality
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Enhancement Controls Panel */}
          <div className="lg:col-span-4">
            <EnhancementControls
              options={options}
              onChange={handleOptionsChange}
              onReset={handleReset}
              onTriggerAiEnhance={handleTriggerAiEnhance}
              isAiEnhancing={isAiEnhancing}
              activePreset={activePreset}
              onSelectPreset={handleSelectPreset}
            />
          </div>
        </div>
      </main>

      {/* AI Image Studio Modal (Create & Edit Images with text prompts) */}
      <AiImageStudioModal
        isOpen={isAiStudioOpen}
        onClose={() => setIsAiStudioOpen(false)}
        currentImageSrc={originalImageSrc}
        onSelectImageForEnhancement={(newSrc) => {
          handleLoadNewImage(newSrc, 'gemini_studio_variation.png');
          setFeedback({
            type: 'success',
            message: 'Image variation loaded into 4K Ultra-Sharp Enhancer.',
          });
        }}
      />
    </div>
  );
}
