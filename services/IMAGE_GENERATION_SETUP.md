# 圖片生成功能設定說明

## 📋 概述

目前第四步驟的海報圖片生成功能使用模擬實現，返回佔位符圖片。要啟用實際的圖片生成功能，您需要整合真實的圖片生成 API。

## 🔧 整合選項

### 選項 1：使用 DALL-E API（OpenAI）

```typescript
// services/imageGenerationService.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generatePosterImage = async (
  prompt: string,
  size: PosterSize,
  referenceImage?: File,
  apiKey?: string
): Promise<string> => {
  const [width, height] = size.split('x').map(Number);
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: `${width}x${height}` as any,
    quality: "standard",
    n: 1,
  });

  return response.data[0].url;
};
```

### 選項 2：使用 Midjourney API

需要透過第三方服務或 API 整合 Midjourney。

### 選項 3：使用 Stable Diffusion API

```typescript
// 使用 Replicate 或其他 Stable Diffusion API 服務
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const generatePosterImage = async (
  prompt: string,
  size: PosterSize,
  referenceImage?: File,
  apiKey?: string
): Promise<string> => {
  const [width, height] = size.split('x').map(Number);
  
  const output = await replicate.run(
    "stability-ai/stable-diffusion:...",
    {
      input: {
        prompt: prompt,
        width,
        height,
      }
    }
  );

  return output[0];
};
```

### 選項 4：使用 Gemini 圖片生成（如果可用）

如果 Google Gemini API 支援圖片生成，可以直接使用。

## 📝 目前實作

目前 `services/imageGenerationService.ts` 中的 `generatePosterImage` 函數返回佔位符圖片 URL。要啟用實際功能：

1. 選擇一個圖片生成 API 服務
2. 安裝對應的 SDK
3. 在 `imageGenerationService.ts` 中實作真實的 API 呼叫
4. 設定環境變數（API Key）
5. 處理參考圖片的整合（如果 API 支援）

## ⚠️ 注意事項

- 圖片生成 API 通常需要付費
- 不同 API 的提示詞格式可能不同
- 參考圖片的處理方式因 API 而異
- 需要考慮 API 配額和速率限制

