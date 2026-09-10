import React, { useState } from 'react';
import {
  X,
  Wand2,
  Sparkles,
  PlusCircle,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Download,
  Ratio,
  Layers,
} from 'lucide-react';
import { exportCanvasWithLimit } from '../utils/imageEnhancer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentImageSrc: string;
  onSelectImageForEnhancement: (imageSrc: string) => void;
}

export const AiImageStudioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentImageSrc,
  onSelectImageForEnhancement,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'create'>('edit');
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [resolution, setResolution] = useState<'1K' | '2K' | '4K'>('2K');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<
    Array<{ id: string; url: string; prompt: string; type: 'edit' | 'create'; timestamp: string }>
  >([]);

  if (!isOpen) return null;

  const quickEditPrompts = [
    'Enhance overall sharpness, clarity, and fine details to maximum studio quality.',
    'Enhance the text contrast and make glowing neon aura more luminous.',
    'Sharpen the facial features, skin texture, and glasses reflections.',
    'Remove all compression artifacts and noise while maintaining exact composition.',
  ];

  const quickCreatePrompts = [
    'A high-tech digital studio portrait with futuristic neon light trails, 8k hyper-realistic.',
    'Cinematic 4K portrait of a senior tech innovator with glasses and determined gaze.',
    'Ultra-sharp typography poster with glowing cybernetic energy nodes and dark background.',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (activeTab === 'edit') {
        const res = await fetch('/api/images/edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: currentImageSrc,
            prompt: prompt.trim(),
            resolution,
            aspectRatio,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to edit image');
        }

        const newImg = {
          id: Date.now().toString(),
          url: data.imageUrl,
          prompt: prompt.trim(),
          type: 'edit' as const,
          timestamp: new Date().toLocaleTimeString(),
        };
        setGeneratedImages((prev) => [newImg, ...prev]);
      } else {
        const res = await fetch('/api/images/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: prompt.trim(),
            aspectRatio,
            resolution,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to generate image');
        }

        const newImg = {
          id: Date.now().toString(),
          url: data.imageUrl,
          prompt: prompt.trim(),
          type: 'create' as const,
          timestamp: new Date().toLocaleTimeString(),
        };
        setGeneratedImages((prev) => [newImg, ...prev]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while contacting Gemini 3.1 Flash Image model.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async (imgUrl: string, id: string) => {
    try {
      const img = new Image();
      if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
        img.crossOrigin = 'anonymous';
      }
      img.src = imgUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      await exportCanvasWithLimit(canvas, `gemini_studio_${id}`, 'image/png');
    } catch (e) {
      // Fallback
      const a = document.createElement('a');
      a.href = imgUrl;
      a.download = `gemini_studio_${id}.png`;
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Gemini 3.1 Image Studio
                <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  gemini-3.1-flash-image
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Use text prompts to edit your image or generate high-fidelity visuals
              </p>
            </div>
          </div>
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6">
          <button
            id="tab-edit-image"
            onClick={() => {
              setActiveTab('edit');
              setErrorMsg(null);
            }}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'edit'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Edit Current Image
          </button>
          <button
            id="tab-create-image"
            onClick={() => {
              setActiveTab('create');
              setErrorMsg(null);
            }}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'create'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Generate New Visual
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prompt Input Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {activeTab === 'edit'
                  ? 'Instruction Prompt (How Gemini should refine/modify the image)'
                  : 'Image Prompt (Describe the visual to create from scratch)'}
              </label>
              <textarea
                id="input-ai-prompt"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  activeTab === 'edit'
                    ? 'e.g. Enhance clarity, sharpen text edges, reduce noise and enrich the cyan light streaks...'
                    : 'e.g. A hyper-realistic 4K futuristic cinematic portrait with glowing light trails and bold typography...'
                }
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none font-sans"
              />
            </div>

            {/* Quick Prompt Suggestions */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Quick Inspiration Prompts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(activeTab === 'edit' ? quickEditPrompts : quickCreatePrompts).map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(p)}
                    className="text-[11px] bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg transition-colors text-left"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>

            {/* Configuration Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Aspect Ratio */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Ratio className="w-3.5 h-3.5 text-cyan-400" />
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {['16:9', '1:1', '4:3', '9:16'].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        aspectRatio === ratio
                          ? 'bg-cyan-500 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Target */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Quality &amp; Resolution
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {(['1K', '2K', '4K'] as const).map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setResolution(res)}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        resolution === res
                          ? 'bg-cyan-500 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {res} Ultra
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Generation Notice:</p>
                  <p className="mt-0.5 text-red-300/90">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="btn-submit-ai-studio"
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing with Gemini 3.1 Flash Image...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>
                    {activeTab === 'edit'
                      ? 'Apply AI Edit to Image'
                      : 'Generate New Image with Gemini 3.1'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Generated Variations Gallery */}
          {generatedImages.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Studio History &amp; Variations ({generatedImages.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedImages.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-3 flex flex-col gap-2.5 group"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
                      <img
                        src={item.url}
                        alt={item.prompt}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
                        {item.type === 'edit' ? 'AI Edit' : 'Generated'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium line-clamp-2">
                      "{item.prompt}"
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onSelectImageForEnhancement(item.url);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          Set in Enhancer
                        </button>
                        <button
                          onClick={() => handleDownloadImage(item.url, item.id)}
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                          title="Download high quality (≤ 50 MB)"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
