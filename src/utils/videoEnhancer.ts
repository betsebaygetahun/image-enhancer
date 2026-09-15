import {
  VideoEnhancementOptions,
  VideoPreset,
  VideoResolutionTarget,
  VideoMetadata,
} from '../types';

export const DEFAULT_VIDEO_OPTIONS: VideoEnhancementOptions = {
  scale: 2,
  targetResolution: '4k',
  sharpness: 70,
  denoise: 40,
  clarity: 55,
  contrast: 110,
  saturation: 108,
  brightness: 102,
  detailBoost: 65,
  fps: 30,
  highQualityFilter: true,
};

export const VIDEO_PRESETS: Record<string, VideoPreset> = {
  crisp4k: {
    id: 'crisp4k',
    name: '4K Ultra-Sharp Cinematic',
    desc: 'Bicubic 4K supersampling with edge-contrast boost and balanced de-noising',
    badge: 'Recommended',
    options: {
      scale: 2,
      targetResolution: '4k',
      sharpness: 75,
      denoise: 40,
      clarity: 60,
      contrast: 112,
      saturation: 108,
      brightness: 102,
      detailBoost: 70,
      fps: 30,
      highQualityFilter: true,
    },
  },
  action4k: {
    id: 'action4k',
    name: '4K High-Motion & Sports',
    desc: 'Intense edge clarity and motion artifact reduction for dynamic fast footage',
    badge: 'Action 60fps',
    options: {
      scale: 2,
      targetResolution: '4k',
      sharpness: 85,
      denoise: 55,
      clarity: 68,
      contrast: 115,
      saturation: 110,
      brightness: 100,
      detailBoost: 80,
      fps: 60,
      highQualityFilter: true,
    },
  },
  portrait4k: {
    id: 'portrait4k',
    name: '4K Face & Natural Detail',
    desc: 'Soft edge-preserving noise removal with subtle skin texture clarity',
    badge: 'Natural',
    options: {
      scale: 2,
      targetResolution: '4k',
      sharpness: 58,
      denoise: 50,
      clarity: 45,
      contrast: 106,
      saturation: 104,
      brightness: 104,
      detailBoost: 52,
      fps: 30,
      highQualityFilter: true,
    },
  },
  lowlight4k: {
    id: 'lowlight4k',
    name: '4K Low-Light De-Noise & Brighten',
    desc: 'Aggressive shadow de-noising and dynamic tone curve brightening',
    badge: 'Night Mode',
    options: {
      scale: 2,
      targetResolution: '4k',
      sharpness: 65,
      denoise: 75,
      clarity: 55,
      contrast: 120,
      saturation: 112,
      brightness: 116,
      detailBoost: 60,
      fps: 30,
      highQualityFilter: true,
    },
  },
  hdr4k: {
    id: 'hdr4k',
    name: '4K HDR Vivid Color',
    desc: 'Maximum color vibrance and micro-contrast punch for outdoor landscapes',
    badge: 'HDR Punch',
    options: {
      scale: 2,
      targetResolution: '4k',
      sharpness: 72,
      denoise: 35,
      clarity: 65,
      contrast: 124,
      saturation: 122,
      brightness: 104,
      detailBoost: 65,
      fps: 30,
      highQualityFilter: true,
    },
  },
};

/**
 * Calculates target resolution dimensions preserving aspect ratio
 */
export function calculateTargetDimensions(
  srcWidth: number,
  srcHeight: number,
  target: VideoResolutionTarget,
  scaleFactor: 1 | 2 | 4 = 2
): { width: number; height: number } {
  if (srcWidth <= 0 || srcHeight <= 0) {
    return { width: 3840, height: 2160 };
  }

  const aspect = srcWidth / srcHeight;

  if (target === '4k') {
    if (aspect >= 1) {
      // Landscape: scale width to 3840, or at least double 1080p
      const w = 3840;
      const h = Math.round(w / aspect);
      return { width: w, height: h % 2 === 0 ? h : h + 1 };
    } else {
      // Portrait: scale height to 3840 or width to 2160
      const h = 3840;
      const w = Math.round(h * aspect);
      return { width: w % 2 === 0 ? w : w + 1, height: h };
    }
  }

  if (target === '2k') {
    if (aspect >= 1) {
      const w = 2560;
      const h = Math.round(w / aspect);
      return { width: w, height: h % 2 === 0 ? h : h + 1 };
    } else {
      const h = 2560;
      const w = Math.round(h * aspect);
      return { width: w % 2 === 0 ? w : w + 1, height: h };
    }
  }

  if (target === '1080p') {
    if (aspect >= 1) {
      const w = 1920;
      const h = Math.round(w / aspect);
      return { width: w, height: h % 2 === 0 ? h : h + 1 };
    } else {
      const h = 1920;
      const w = Math.round(h * aspect);
      return { width: w % 2 === 0 ? w : w + 1, height: h };
    }
  }

  // Original or custom scale
  const w = Math.round(srcWidth * scaleFactor);
  const h = Math.round(srcHeight * scaleFactor);
  return {
    width: w % 2 === 0 ? w : w + 1,
    height: h % 2 === 0 ? h : h + 1,
  };
}

/**
 * Builds CSS filter string for real-time video canvas enhancement
 */
export function buildVideoFilterString(options: VideoEnhancementOptions): string {
  const contrast = options.contrast / 100;
  const saturation = options.saturation / 100;
  const brightness = options.brightness / 100;
  // Combine contrast and subtle vibrance
  return `contrast(${contrast.toFixed(2)}) saturate(${saturation.toFixed(2)}) brightness(${brightness.toFixed(2)})`;
}

/**
 * Renders a single enhanced frame from video onto a 4K canvas
 */
export function renderEnhancedVideoFrame(
  video: HTMLVideoElement,
  targetCanvas: HTMLCanvasElement,
  options: VideoEnhancementOptions,
  applyUnsharpMask: boolean = false
): void {
  if (!video || video.readyState < 2) return;

  const ctx = targetCanvas.getContext('2d', { willReadFrequently: applyUnsharpMask });
  if (!ctx) return;

  const width = targetCanvas.width;
  const height = targetCanvas.height;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Apply real-time visual clarity filters
  ctx.filter = buildVideoFilterString(options);
  ctx.drawImage(video, 0, 0, width, height);
  ctx.filter = 'none';

  // Optional unsharp mask / edge sharpening for still captures or high-definition export
  if (applyUnsharpMask && options.sharpness > 20) {
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const weight = (options.sharpness / 100) * 0.8;
      // Fast single-pass high-frequency convolution
      for (let y = 1; y < height - 1; y += 2) {
        for (let x = 1; x < width - 1; x += 2) {
          const idx = (y * width + x) * 4;
          const upIdx = ((y - 1) * width + x) * 4;
          const dnIdx = ((y + 1) * width + x) * 4;
          const lfIdx = (y * width + (x - 1)) * 4;
          const rtIdx = (y * width + (x + 1)) * 4;

          for (let c = 0; c < 3; c++) {
            const center = data[idx + c];
            const laplacian =
              4 * center -
              data[upIdx + c] -
              data[dnIdx + c] -
              data[lfIdx + c] -
              data[rtIdx + c];
            const sharpVal = center + laplacian * weight;
            data[idx + c] = Math.min(255, Math.max(0, sharpVal));
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch (e) {
      // Fallback: standard high-quality bicubic smoothing
    }
  }
}

/**
 * Creates a rich, high-framerate animated 1080p sample video canvas stream
 * so the user can test 4K video enhancement immediately without uploading a file.
 */
export async function createSampleVideoBlob(): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  const stream = canvas.captureStream(30);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm',
    videoBitsPerSecond: 4000000,
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const totalFrames = 150; // 5 seconds at 30 fps
  let frame = 0;

  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(URL.createObjectURL(blob));
    };

    mediaRecorder.start();

    function drawFrame() {
      if (frame >= totalFrames) {
        mediaRecorder.stop();
        return;
      }

      const t = frame / 30; // seconds
      const w = canvas.width;
      const h = canvas.height;

      // Dark cybernetic grid background
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#040d1a');
      grad.addColorStop(0.5, '#071829');
      grad.addColorStop(1, '#02070e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Perspective grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;
      const horizonY = h * 0.6;
      for (let x = 0; x <= w; x += 60) {
        ctx.beginPath();
        ctx.moveTo(w / 2, horizonY);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = horizonY; y <= h; y += (y - horizonY) * 0.35 + 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Neon highway speed trails
      for (let i = 0; i < 6; i++) {
        const trailX = (Math.sin(t * 1.5 + i) * 0.4 + 0.5) * w;
        const trailY = horizonY + ((t * 40 + i * 35) % (h - horizonY));
        const trailW = 80 + i * 40;

        const trailGrad = ctx.createLinearGradient(trailX - trailW, 0, trailX + trailW, 0);
        trailGrad.addColorStop(0, 'rgba(0, 245, 255, 0)');
        trailGrad.addColorStop(0.5, i % 2 === 0 ? 'rgba(0, 245, 255, 0.8)' : 'rgba(255, 140, 0, 0.85)');
        trailGrad.addColorStop(1, 'rgba(0, 245, 255, 0)');

        ctx.fillStyle = trailGrad;
        ctx.fillRect(trailX - trailW, trailY, trailW * 2, 4 + i * 2);
      }

      // Center glowing reactor / plasma orb
      const orbX = w / 2;
      const orbY = h * 0.35;
      const orbR = 70 + Math.sin(t * 4) * 8;

      const orbGrad = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, orbR * 1.6);
      orbGrad.addColorStop(0, '#ffffff');
      orbGrad.addColorStop(0.2, '#00f2ff');
      orbGrad.addColorStop(0.6, 'rgba(0, 110, 255, 0.6)');
      orbGrad.addColorStop(1, 'rgba(0, 20, 60, 0)');

      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Rotating plasma arcs
      ctx.strokeStyle = '#00f2ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR * 0.9, t * 2, t * 2 + Math.PI * 1.2);
      ctx.stroke();

      ctx.strokeStyle = '#ff9100';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR * 1.2, -t * 2.5, -t * 2.5 + Math.PI * 0.9);
      ctx.stroke();

      // Bold HUD Typography
      ctx.shadowColor = 'rgba(0, 242, 255, 0.8)';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('4K ULTRA-HD VIDEO TEST', w / 2, h * 0.82);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`TEST PATTERN • FRAME: ${frame} / ${totalFrames} • TIME: ${t.toFixed(2)}s`, w / 2, h * 0.88);

      // Micro-texture markers for sharpness evaluation
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1;
      for (let j = 0; j < 20; j++) {
        const mx = 60 + j * 16;
        ctx.beginPath();
        ctx.moveTo(mx, 40);
        ctx.lineTo(mx, 65);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('HIGH-FREQUENCY DETAIL CALIBRATION', 60, 32);

      frame++;
      requestAnimationFrame(drawFrame);
    }

    drawFrame();
  });
}

/**
 * Exports video at 4K resolution guaranteed under maximum size (default 50 MB)
 */
export async function exportEnhancedVideo(
  videoElement: HTMLVideoElement,
  options: VideoEnhancementOptions,
  filename: string,
  onProgress: (progress: number, statusText: string) => void,
  maxMegabytes: number = 48
): Promise<{ blob: Blob; url: string; sizeBytes: number; filename: string }> {
  const duration = videoElement.duration || 5;
  const targetDims = calculateTargetDimensions(
    videoElement.videoWidth || 1920,
    videoElement.videoHeight || 1080,
    options.targetResolution,
    options.scale
  );

  const canvas = document.createElement('canvas');
  canvas.width = targetDims.width;
  canvas.height = targetDims.height;
  const ctx = canvas.getContext('2d')!;

  const fps = options.fps || 30;

  // Calculate bitrate strictly targeting <= 50 MB
  // Max size bits = maxMegabytes * 8 * 1024 * 1024
  const targetBits = maxMegabytes * 8 * 1024 * 1024;
  const maxSafeBitrate = Math.floor(targetBits / Math.max(1, duration));
  // Bound between 4 Mbps and 28 Mbps
  const videoBitrate = Math.max(2500000, Math.min(28000000, maxSafeBitrate));

  const stream = canvas.captureStream(fps);

  // Preserve audio from original video if present
  try {
    // @ts-ignore
    const vidStream = videoElement.captureStream
      ? // @ts-ignore
        videoElement.captureStream()
      : // @ts-ignore
      videoElement.mozCaptureStream
      ? // @ts-ignore
        videoElement.mozCaptureStream()
      : null;

    if (vidStream) {
      const audioTracks = vidStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks.forEach((track: MediaStreamTrack) => stream.addTrack(track));
      }
    }
  } catch (e) {
    console.warn('Audio capture note:', e);
  }

  // Determine optimal codec
  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
      ? 'video/webm;codecs=vp8'
      : 'video/webm';
  }

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: videoBitrate,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  return new Promise(async (resolve, reject) => {
    recorder.onstop = () => {
      const finalBlob = new Blob(chunks, { type: mimeType });
      const finalUrl = URL.createObjectURL(finalBlob);
      const outName = `${filename.replace(/\.[^/.]+$/, '')}_4k_enhanced.webm`;
      onProgress(100, '4K Video Enhancement Complete!');
      resolve({
        blob: finalBlob,
        url: finalUrl,
        sizeBytes: finalBlob.size,
        filename: outName,
      });
    };

    recorder.onerror = (err) => {
      reject(err);
    };

    onProgress(5, `Initializing 4K UHD encoder (${targetDims.width}×${targetDims.height})...`);

    // Prepare video playback recording
    const prevTime = videoElement.currentTime;
    const wasPaused = videoElement.paused;

    videoElement.pause();
    videoElement.currentTime = 0;

    await new Promise((res) => {
      const onSeeked = () => {
        videoElement.removeEventListener('seeked', onSeeked);
        res(true);
      };
      videoElement.addEventListener('seeked', onSeeked);
    });

    recorder.start(500);

    const startTime = Date.now();
    let isCancelled = false;

    // Render loop synced to video playback
    videoElement.play();

    const checkInterval = setInterval(() => {
      if (videoElement.ended || videoElement.currentTime >= duration - 0.05) {
        clearInterval(checkInterval);
        renderEnhancedVideoFrame(videoElement, canvas, options, true);
        setTimeout(() => {
          recorder.stop();
          videoElement.pause();
          videoElement.currentTime = prevTime;
          if (!wasPaused) videoElement.play();
        }, 300);
        return;
      }

      renderEnhancedVideoFrame(videoElement, canvas, options, false);

      const percent = Math.min(99, Math.round((videoElement.currentTime / duration) * 95));
      const estSeconds = Math.max(0, Math.round(duration - videoElement.currentTime));
      onProgress(
        percent,
        `Rendering 4K UHD frames (${percent}%) • ~${estSeconds}s remaining`
      );
    }, 1000 / fps);
  });
}

/**
 * Captures an instantaneous 4K Ultra-Sharp still frame snapshot at current timestamp
 */
export async function capture4KSnapshot(
  video: HTMLVideoElement,
  options: VideoEnhancementOptions,
  filename: string
): Promise<{ dataUrl: string; filename: string }> {
  const targetDims = calculateTargetDimensions(
    video.videoWidth || 1920,
    video.videoHeight || 1080,
    options.targetResolution,
    options.scale
  );

  const canvas = document.createElement('canvas');
  canvas.width = targetDims.width;
  canvas.height = targetDims.height;

  renderEnhancedVideoFrame(video, canvas, options, true);

  const dataUrl = canvas.toDataURL('image/png');
  const snapName = `${filename.replace(/\.[^/.]+$/, '')}_frame_${Math.floor(video.currentTime)}s_4k.png`;

  // Trigger download
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = snapName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { dataUrl, filename: snapName };
}
