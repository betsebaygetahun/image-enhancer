import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Enhance existing image
app.post('/api/images/enhance', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', resolution = '2K', customInstructions } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 in request body' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in server environment. Use client-side high-definition enhancement or set your API key in Settings > Secrets.',
      });
    }

    // Clean base64 string if it contains data URI prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[^;]+;base64,/, '');

    // Detect MIME type if in data URI
    let detectedMime = mimeType || 'image/jpeg';
    const mimeMatch = imageBase64.match(/^data:(image\/[^;]+);base64,/);
    if (mimeMatch && mimeMatch[1]) {
      detectedMime = mimeMatch[1];
    }

    const basePrompt = `Enhance the uploaded image to the highest possible quality and resolution. Keep the image 100% identical to the original. Do not change, add, remove, replace, or rearrange anything. Preserve the exact composition, people, faces, facial features, expressions, clothing, colors, background, text, objects, lighting, and proportions. Only improve technical quality: increase sharpness, clarity, resolution, and fine details; reduce noise, blur, pixelation, and compression artifacts. Make it look clean, crisp, and professionally high-resolution while maintaining the exact original appearance. No creative alterations or AI-generated changes.`;
    const prompt = customInstructions ? `${basePrompt}\nAdditional detail focus: ${customInstructions}` : basePrompt;

    let targetSize: '512px' | '1K' | '2K' | '4K' = '2K';
    if (resolution === '4K' || resolution === '4k') targetSize = '4K';
    else if (resolution === '1K' || resolution === '1k') targetSize = '1K';

    // Call gemini-3.1-flash-image (or fallback)
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: detectedMime,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            imageSize: targetSize,
          },
        },
      });

      let generatedImageUrl: string | null = null;
      let textFeedback: string = '';

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const outMime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${outMime};base64,${part.inlineData.data}`;
          } else if (part.text) {
            textFeedback += part.text;
          }
        }
      }

      if (generatedImageUrl) {
        return res.json({
          success: true,
          imageUrl: generatedImageUrl,
          text: textFeedback,
          model: 'gemini-3.1-flash-image',
        });
      }

      // If no image part returned, try fallback model
      throw new Error(textFeedback || 'No image data returned from primary model');
    } catch (modelErr: any) {
      console.warn('Primary enhancement failed, trying gemini-3.1-flash-lite-image fallback:', modelErr.message);

      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: detectedMime,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      let fallbackImageUrl: string | null = null;
      if (fallbackResponse.candidates?.[0]?.content?.parts) {
        for (const part of fallbackResponse.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const outMime = part.inlineData.mimeType || 'image/png';
            fallbackImageUrl = `data:${outMime};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (fallbackImageUrl) {
        return res.json({
          success: true,
          imageUrl: fallbackImageUrl,
          model: 'gemini-3.1-flash-lite-image',
        });
      }

      throw modelErr;
    }
  } catch (error: any) {
    console.error('Enhancement error:', error);
    const msg = error?.message || 'Failed to enhance image with AI model';
    const isQuota = msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429') || msg.includes('quota');
    res.status(isQuota ? 429 : 500).json({
      error: isQuota
        ? 'Gemini Cloud image quota exhausted for this API key. Using local 4K Ultra-Sharp super-resolution pipeline.'
        : msg,
      isQuotaExceeded: isQuota,
    });
  }
});

// Edit image with text prompt
app.post('/api/images/edit', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', prompt, resolution = '2K', aspectRatio } = req.body;

    if (!imageBase64 || !prompt) {
      return res.status(400).json({ error: 'imageBase64 and prompt are required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in server environment. Set your API key in Settings > Secrets.',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[^;]+;base64,/, '');

    // Detect MIME type if in data URI
    let detectedMime = mimeType || 'image/jpeg';
    const mimeMatch = imageBase64.match(/^data:(image\/[^;]+);base64,/);
    if (mimeMatch && mimeMatch[1]) {
      detectedMime = mimeMatch[1];
    }

    const targetSize: '512px' | '1K' | '2K' | '4K' =
      resolution === '4K' ? '4K' : resolution === '1K' ? '1K' : '2K';

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: detectedMime,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          imageSize: targetSize,
          ...(aspectRatio ? { aspectRatio } : {}),
        },
      },
    });

    let generatedImageUrl: string | null = null;
    let textFeedback: string = '';

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const outMime = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${outMime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textFeedback += part.text;
        }
      }
    }

    if (!generatedImageUrl) {
      return res.status(500).json({
        error: textFeedback || 'No image returned by Gemini model',
      });
    }

    res.json({
      success: true,
      imageUrl: generatedImageUrl,
      text: textFeedback,
      model: 'gemini-3.1-flash-image',
    });
  } catch (error: any) {
    console.error('Edit error:', error);
    const msg = error?.message || 'Failed to edit image';
    const isQuota = msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429') || msg.includes('quota');
    res.status(isQuota ? 429 : 500).json({
      error: isQuota
        ? 'Gemini Cloud image quota exhausted for this API key. Provide a paid API key or use the 4K Ultra-Sharp Enhancer.'
        : msg,
      isQuotaExceeded: isQuota,
    });
  }
});

// Create / Generate image from text prompt
app.post('/api/images/generate', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9', resolution = '2K' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured. Set your API key in Settings > Secrets.',
      });
    }

    const targetSize: '512px' | '1K' | '2K' | '4K' =
      resolution === '4K' ? '4K' : resolution === '1K' ? '1K' : '2K';

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: targetSize,
        },
      },
    });

    let generatedImageUrl: string | null = null;
    let textFeedback: string = '';

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const outMime = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${outMime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textFeedback += part.text;
        }
      }
    }

    if (!generatedImageUrl) {
      return res.status(500).json({
        error: textFeedback || 'No image returned by Gemini model',
      });
    }

    res.json({
      success: true,
      imageUrl: generatedImageUrl,
      text: textFeedback,
      model: 'gemini-3.1-flash-image',
    });
  } catch (error: any) {
    console.error('Generate error:', error);
    const msg = error?.message || 'Failed to generate image';
    const isQuota = msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429') || msg.includes('quota');
    res.status(isQuota ? 429 : 500).json({
      error: isQuota
        ? 'Gemini Cloud image quota exhausted for this API key. Provide a paid API key or use the 4K Ultra-Sharp Enhancer.'
        : msg,
      isQuotaExceeded: isQuota,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
