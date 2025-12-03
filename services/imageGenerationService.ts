/**
 * 圖片生成服務
 * 
 * 使用 Google Gemini API (Imagen) 生成圖片
 */

import { GoogleGenAI } from "@google/genai";
import type { PosterSize } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

/**
 * 將 PosterSize 轉換為 API 支援的長寬比
 */
const convertSizeToAspectRatio = (size: PosterSize): string => {
  const sizeMap: Record<PosterSize, string> = {
    '1080x1080': '1:1',      // 正方形
    '1080x1350': '4:5',      // 直式（接近 3:4）
    '1080x1920': '9:16',     // 手機直式
    '1920x1080': '16:9',     // 橫式
  };
  return sizeMap[size] || '1:1';
};

/**
 * 使用 Google Gemini API (Imagen) 生成圖片
 */
export const generatePosterImage = async (
  prompt: string,
  size: PosterSize,
  referenceImage?: File,
  apiKey?: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key 未設定，請先設定 Gemini API Key");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const aspectRatio = convertSizeToAspectRatio(size);

    // 準備提示詞
    let finalPrompt = prompt;
    
    // 如果有參考圖片，先使用 Gemini Vision 分析圖片特徵並增強提示詞
    if (referenceImage) {
      try {
        const base64 = await fileToBase64(referenceImage);
        const mimeType = referenceImage.type || 'image/jpeg';
        
        // 使用 Gemini Vision 分析參考圖片
        const visionResult = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64.split(',')[1] || base64, // 移除 data URL 前綴（如果有的話）
                },
              },
              {
                text: `請分析這張參考圖片的視覺風格、色彩搭配、構圖方式和設計元素。然後用繁體中文描述這些特徵，這些資訊將用於生成類似風格的海報圖片。`,
              },
            ],
          },
        });

        const imageAnalysis = visionResult.text;
        finalPrompt = `${prompt}\n\n參考圖片的視覺特徵：${imageAnalysis}`;
      } catch (error) {
        console.warn('參考圖片分析失敗，將使用原始提示詞:', error);
        // 如果分析失敗，繼續使用原始提示詞
      }
    }

    // 使用 Imagen 生成圖片
    // 注意：Imagen 目前主要支援英文提示詞，但我們可以嘗試使用中文
    // 如果失敗，可以考慮將提示詞翻譯成英文
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-fast-generate-001',
      prompt: finalPrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: aspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9',
        outputMimeType: 'image/jpeg',
        outputCompressionQuality: 90,
        includeRaiReason: false,
        personGeneration: 'allow_adult', // 允許生成成人人物
      },
    });

    // 檢查回應
    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error('圖片生成失敗：未收到生成的圖片');
    }

    const generatedImage = response.generatedImages[0];
    
    // 檢查是否有 RAI 過濾原因
    if (generatedImage.raiFilteredReason) {
      throw new Error(`圖片生成被過濾：${generatedImage.raiFilteredReason}`);
    }

    // 取得圖片資料
    if (!generatedImage.image?.imageBytes) {
      throw new Error('圖片生成失敗：圖片資料為空');
    }

    // 將 base64 圖片資料轉換為 data URL
    const imageDataUrl = `data:image/jpeg;base64,${generatedImage.image.imageBytes}`;
    
    return imageDataUrl;
  } catch (error: any) {
    console.error('圖片生成錯誤:', error);
    
    // 如果是因為語言問題導致的錯誤，嘗試使用 Gemini 2.5 Flash
    if (error.message?.includes('language') || error.message?.includes('Language')) {
      console.log('嘗試使用 Gemini 2.5 Flash 生成圖片...');
      return await generateImageWithGemini(prompt, size, referenceImage, apiKey);
    }
    
    throw new Error(`圖片生成失敗：${error.message || '未知錯誤'}`);
  }
};

/**
 * 使用 Gemini 2.5 Flash 生成圖片（備用方案）
 * 這個方法使用 generateContent 並指定 responseModalities 為 IMAGE
 */
const generateImageWithGemini = async (
  prompt: string,
  size: PosterSize,
  referenceImage?: File,
  apiKey?: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key 未設定");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // 準備內容
    const parts: any[] = [{ text: prompt }];
    
    // 如果有參考圖片，加入圖片
    if (referenceImage) {
      const base64 = await fileToBase64(referenceImage);
      const mimeType = referenceImage.type || 'image/jpeg';
      parts.unshift({
        inlineData: {
          mimeType,
          data: base64.split(',')[1] || base64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    // 檢查回應中是否有圖片
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
    }

    throw new Error('未在回應中找到圖片資料');
  } catch (error: any) {
    console.error('Gemini 圖片生成錯誤:', error);
    throw new Error(`圖片生成失敗：${error.message || '未知錯誤'}`);
  }
};

/**
 * 使用參考圖片增強提示詞（已整合到 generatePosterImage 中）
 * 保留此函數以保持向後兼容
 */
export const enhancePromptWithReference = async (
  basePrompt: string,
  referenceImage?: File
): Promise<string> => {
  if (!referenceImage) {
    return basePrompt;
  }

  // 此功能已整合到 generatePosterImage 中
  // 這裡保留一個簡單的實作以保持向後兼容
  return `${basePrompt}\n\n參考圖片風格和構圖元素。`;
};

