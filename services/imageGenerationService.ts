/**
 * 圖片生成服務
 * 
 * 使用 Google Gemini API (Imagen) 生成圖片
 */

import { GoogleGenAI } from "@google/genai";
import type { PosterSize } from '../types';
import { fileToBase64 } from '../utils/fileUtils';
import { enhancePromptForTraditionalChinese, REFERENCE_IMAGE_ANALYSIS_PROMPT } from '../utils/prompts';

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
 * 檢測文字是否包含中文字符（繁體或簡體）
 */
const containsChinese = (text: string): boolean => {
  // 中文字符的 Unicode 範圍
  // CJK Unified Ideographs: \u4E00-\u9FFF
  // CJK Extension A: \u3400-\u4DBF
  // CJK Extension B: \u20000-\u2A6DF
  // CJK Compatibility Ideographs: \uF900-\uFAFF
  const chineseRegex = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/;
  return chineseRegex.test(text);
};

/**
 * 使用 Google Gemini API (Imagen) 生成圖片
 */
export const generatePosterImage = async (
  prompt: string,
  size: PosterSize,
  referenceImage?: File,
  apiKey?: string,
  forceChineseMode?: boolean // 強制使用中文模式
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key 未設定，請先設定 Gemini API Key");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const aspectRatio = convertSizeToAspectRatio(size);

    // 檢測是否為中文模式：如果強制中文模式，或者提示詞包含中文
    const isChineseMode = forceChineseMode !== undefined ? forceChineseMode : containsChinese(prompt);
    
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
                text: REFERENCE_IMAGE_ANALYSIS_PROMPT,
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

    // 如果是中文模式，增強提示詞以確保繁體中文渲染
    if (isChineseMode) {
      finalPrompt = enhancePromptForTraditionalChinese(finalPrompt);
    }

    // 根據語言模式選擇模型
    // 中文模式使用 gemini-3-pro-image-preview，英文模式使用 imagen-4.0-fast-generate-001
    const model = isChineseMode ? 'gemini-3-pro-image-preview' : 'imagen-4.0-fast-generate-001';
    
    console.log(`使用模型: ${model} (${isChineseMode ? '中文模式' : '英文模式'})`);

    // 使用選定的模型生成圖片
    const response = await ai.models.generateImages({
      model: model,
      prompt: finalPrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: aspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9',
        outputMimeType: 'image/jpeg',
        outputCompressionQuality: 90,
        includeRaiReason: true, // 啟用以獲取詳細的 RAI 過濾原因
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
      const raiReason = generatedImage.raiFilteredReason;
      throw new Error(`圖片生成被 RAI（負責任 AI）系統過濾。原因：${raiReason}。請調整提示詞內容，避免包含不當、敏感或違規的內容。`);
    }

    // 取得圖片資料
    if (!generatedImage.image?.imageBytes) {
      throw new Error('圖片生成失敗：圖片資料為空');
    }

    // 將 base64 圖片資料轉換為 Blob，然後創建 Blob URL
    // 這樣可以更有效地管理記憶體，避免長 data URL 造成的問題
    const base64Data = generatedImage.image.imageBytes;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const blobUrl = URL.createObjectURL(blob);
    
    return blobUrl;
  } catch (error: any) {
    console.error('圖片生成錯誤:', error);
    
    // 檢查是否為 RAI 過濾錯誤
    if (error.message?.includes('RAI') || error.message?.includes('過濾')) {
      // RAI 過濾錯誤直接拋出，不嘗試備用方案
      throw error;
    }
    
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
            // 將 base64 轉換為 Blob URL
            const base64Data = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/jpeg';
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            const blobUrl = URL.createObjectURL(blob);
            return blobUrl;
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

