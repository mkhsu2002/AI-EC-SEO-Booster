# 提示詞生成邏輯提取說明

## 📋 提取概述

已將 `App.tsx` 中的提示詞生成邏輯提取到獨立檔案 `PROMPT_GENERATION_EXTRACTED.ts`，供檢視和討論。

## 🔍 提取的內容

### 1. **輔助函數**
- `formatPersonaDetailsForGamma()` - 格式化買家人設資訊（Gamma 格式）
- `formatPersonaDetailsForAIStudio()` - 格式化買家人設資訊（AI Studio 格式）

### 2. **主要函數**
- `generateGammaPrompt()` - 生成 Gamma.app 提示詞
- `generateAIStudioPrompt()` - 生成 AI Studio 提示詞
- `generateAllPromptsMarkdown()` - 生成所有提示詞的 Markdown 文件

## 📊 原始程式碼位置

### App.tsx 中的原始位置：
- `handleGenerateGammaPrompt` (723-806行) → 提取為 `generateGammaPrompt()`
- `handleGenerateAIStudioPrompt` (808-977行) → 提取為 `generateAIStudioPrompt()`
- `generateAIStudioPromptText` (980-1145行) → 合併到 `generateAIStudioPrompt()`
- `generateGammaPromptText` (1148-1228行) → 合併到 `generateGammaPrompt()`
- `handleDownloadAllPrompts` (1231-1267行) → 提取為 `generateAllPromptsMarkdown()`

## ✨ 優化改進

### 1. **程式碼組織**
- ✅ 將提示詞生成邏輯從元件中分離
- ✅ 提取重複的格式化邏輯為獨立函數
- ✅ 統一函數命名（移除 `handle` 前綴，因為這些是純函數）

### 2. **可維護性**
- ✅ 每個函數都有清楚的 JSDoc 註解
- ✅ 函數參數明確，不依賴元件狀態
- ✅ 易於進行單元測試

### 3. **程式碼重複**
- ✅ 合併了 `generateAIStudioPromptText` 和 `handleGenerateAIStudioPrompt`（兩者邏輯相同）
- ✅ 合併了 `generateGammaPromptText` 和 `handleGenerateGammaPrompt`（兩者邏輯相同）
- ✅ 提取了買家人設格式化邏輯，避免重複

## 📝 使用方式

### 在 App.tsx 中的整合範例：

```typescript
import { 
  generateGammaPrompt, 
  generateAIStudioPrompt, 
  generateAllPromptsMarkdown 
} from './utils/promptTemplates';

// 1. 生成 Gamma 提示詞
const handleGenerateGammaPrompt = useCallback((topic: ContentTopic) => {
  if (!productInfo || !analysisResult || !contentStrategy) return;
  
  const prompt = generateGammaPrompt(
    productInfo, 
    analysisResult, 
    topic, 
    contentStrategy
  );
  
  setPromptModalTitle('Gamma 生成提示詞');
  setPromptModalContent(prompt);
}, [productInfo, analysisResult, contentStrategy]);

// 2. 生成 AI Studio 提示詞
const handleGenerateAIStudioPrompt = useCallback((topic: ContentTopic) => {
  if (!productInfo || !analysisResult || !contentStrategy) return;
  
  const prompt = generateAIStudioPrompt(
    productInfo, 
    analysisResult, 
    topic, 
    contentStrategy
  );
  
  setPromptModalTitle('AI Studio 生成提示詞');
  setPromptModalContent(prompt);
}, [productInfo, analysisResult, contentStrategy]);

// 3. 下載所有提示詞
const handleDownloadAllPrompts = useCallback(() => {
  if (!productInfo || !analysisResult || !contentStrategy) return;
  
  const markdownContent = generateAllPromptsMarkdown(
    productInfo, 
    analysisResult, 
    contentStrategy
  );
  
  const blob = new Blob([markdownContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `完整提示詞集合-${productInfo.name.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}, [productInfo, analysisResult, contentStrategy]);
```

## 🔄 後續步驟

### 選項 1：直接使用提取的檔案
1. 將 `PROMPT_GENERATION_EXTRACTED.ts` 重新命名為 `utils/promptTemplates.ts`
2. 在 `App.tsx` 中導入並使用這些函數
3. 移除 `App.tsx` 中原本的提示詞生成邏輯

### 選項 2：進一步優化
1. 考慮將提示詞模板拆分為更小的片段
2. 使用模板引擎（如 Handlebars）來管理複雜的模板
3. 建立提示詞版本管理機制

## 💡 討論重點

### 1. **函數命名**
- 目前使用 `generateGammaPrompt` 和 `generateAIStudioPrompt`
- 是否要統一命名風格？例如：`generatePromptForGamma` 和 `generatePromptForAIStudio`

### 2. **參數傳遞**
- 目前需要傳遞 4 個參數（productInfo, analysisResult, topic, contentStrategy）
- 是否考慮建立一個統一的參數物件？

### 3. **錯誤處理**
- 目前函數內部沒有錯誤處理
- 是否需要在函數內部加入參數驗證？

### 4. **提示詞模板管理**
- 目前提示詞模板是硬編碼在函數中
- 是否考慮將模板提取到外部檔案（如 JSON 或 Markdown）？

## 📌 注意事項

⚠️ **此檔案僅供檢視和討論，尚未整合到專案中**

- 檔案中的函數尚未實際測試
- 需要確認型別定義是否正確
- 需要確認與現有程式碼的相容性

---

**請檢視 `PROMPT_GENERATION_EXTRACTED.ts` 檔案，並提供您的意見和建議！**


