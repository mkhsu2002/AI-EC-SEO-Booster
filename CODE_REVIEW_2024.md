# 電商SEO加速器 - 專案程式碼檢視與優化建議報告

> **檢視日期**: 2024年12月  
> **檢視者**: 資深軟體工程師  
> **專案版本**: v1.2

---

## 📋 專案概述

本專案是一個基於 **React 19 + TypeScript + Vite** 的電商市場分析與內容策略生成工具，整合 **Google Gemini API** 進行 AI 驅動的市場分析和內容規劃。主要功能包括：

1. **市場分析報告生成** - 產品核心價值、市場定位、競爭對手分析、買家人設
2. **內容策略規劃** - SEO 優化的內容主題、互動元素、CTA 建議
3. **前導頁提示詞生成** - 支援 AI Studio 和 Gamma.app 兩種格式

---

## ✅ 專案優點

### 1. **技術棧現代化**
- ✅ React 19（最新版本）
- ✅ TypeScript（型別安全）
- ✅ Vite（快速建置）
- ✅ Tailwind CSS（現代化 UI）

### 2. **API Key 管理已改善**
- ✅ 使用 Context API 管理 API Key
- ✅ API Key 儲存在 localStorage（符合純前端架構）
- ✅ 提供 API Key 設定介面

### 3. **型別定義完整**
- ✅ 完整的 TypeScript 型別定義（`types.ts`）
- ✅ 使用 Schema 驗證 API 回應（`geminiService.ts`）

### 4. **功能完整**
- ✅ 支援圖片上傳與分析
- ✅ 支援報告下載（Markdown 格式）
- ✅ 支援截圖下載功能
- ✅ 提示詞批量下載

---

## 🔴 高優先級問題（必須立即處理）

### 1. **App.tsx 檔案過大** ⚠️ 嚴重可維護性問題

**問題描述：**
- `App.tsx` 檔案高達 **1429 行**
- 包含 **20+ 個元件定義**（Header, Footer, InputForm, Loader, ErrorDisplay, ResultCard, Tag, AnalysisResultDisplay, CompetitorCard, PersonaCard, ContentStrategyDisplay, ContentTopicCard, InteractiveElementCard, PromptModal, InfoModal 等）
- 包含大量業務邏輯（提示詞生成、Markdown 生成、截圖處理等）
- 違反單一職責原則（SRP）
- 難以進行單元測試
- 團隊協作困難（容易產生 merge conflict）

**影響：**
- 🔴 程式碼可讀性差
- 🔴 難以進行單元測試
- 🔴 修改風險高（牽一髮動全身）
- 🔴 新成員上手困難

**建議重構結構：**

```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Loader.tsx
│   │   ├── ErrorDisplay.tsx
│   │   ├── ResultCard.tsx
│   │   ├── Tag.tsx
│   │   └── icons/
│   │       ├── ChartBarIcon.tsx
│   │       ├── DocumentTextIcon.tsx
│   │       ├── UserGroupIcon.tsx
│   │       ├── LightBulbIcon.tsx
│   │       ├── SparklesIcon.tsx
│   │       ├── ArrowPathIcon.tsx
│   │       ├── ArrowDownTrayIcon.tsx
│   │       └── EyeIcon.tsx
│   ├── forms/
│   │   └── InputForm.tsx
│   ├── analysis/
│   │   ├── AnalysisResultDisplay.tsx
│   │   ├── CompetitorCard.tsx
│   │   └── PersonaCard.tsx
│   ├── strategy/
│   │   ├── ContentStrategyDisplay.tsx
│   │   ├── ContentTopicCard.tsx
│   │   └── InteractiveElementCard.tsx
│   └── modals/
│       ├── PromptModal.tsx
│       └── InfoModal.tsx
├── hooks/
│   ├── useProductAnalysis.ts
│   ├── useContentStrategy.ts
│   ├── usePromptGeneration.ts
│   └── useScreenshot.ts
├── utils/
│   ├── fileUtils.ts
│   ├── markdownUtils.ts
│   ├── promptTemplates.ts
│   └── downloadUtils.ts
└── App.tsx (精簡後約 100-150 行)
```

**優先級：** 🔴 最高（影響開發效率）

---

### 2. **提示詞生成邏輯過於複雜** ⚠️ 可維護性問題

**問題位置：**
- `App.tsx:723-1228` - `handleGenerateGammaPrompt` 和 `handleGenerateAIStudioPrompt`
- `App.tsx:980-1228` - `generateAIStudioPromptText` 和 `generateGammaPromptText`

**問題描述：**
- 提示詞模板硬編碼在元件中（每個函數 200+ 行）
- 提示詞內容重複度高（AI Studio 和 Gamma 提示詞有大量重複）
- 難以測試和修改
- 無法重用

**建議：**

```typescript
// utils/promptTemplates.ts
export const generateAIStudioPrompt = (
  productInfo: ProductInfo,
  analysisResult: AnalysisResult,
  topic: ContentTopic,
  contentStrategy: ContentStrategy
): string => {
  // 將提示詞模板提取到獨立檔案
  // 使用模板字串或模板引擎
};

export const generateGammaPrompt = (
  productInfo: ProductInfo,
  analysisResult: AnalysisResult,
  topic: ContentTopic,
  contentStrategy: ContentStrategy
): string => {
  // Gamma 提示詞模板
};
```

**優先級：** 🔴 高

---

### 3. **缺少錯誤處理機制** ⚠️ 使用者體驗問題

**問題位置：**
- `App.tsx` - 多處錯誤處理不一致
- `services/geminiService.ts` - API 錯誤處理簡單

**問題描述：**
- 錯誤訊息直接顯示給使用者，可能洩露技術細節
- 缺少統一的錯誤處理機制
- 網路錯誤、超時錯誤未特別處理
- 錯誤訊息不夠友善

**建議：**

```typescript
// utils/errorHandler.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): string => {
  // 記錄詳細錯誤到日誌系統（生產環境）
  if (import.meta.env.PROD) {
    console.error('API Error:', error);
  }

  if (error instanceof ApiError) {
    return error.userMessage;
  }

  if (error instanceof Error) {
    // 根據錯誤類型返回友善訊息
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return '網路連線發生問題，請檢查您的網路連線後再試。';
    }
    if (error.message.includes('timeout')) {
      return '請求逾時，請稍後再試。';
    }
    if (error.message.includes('API') || error.message.includes('Key')) {
      return 'API 服務暫時無法使用，請檢查 API Key 設定或稍後再試。';
    }
    return '發生未知錯誤，請稍後再試。';
  }

  return '發生未知錯誤，請稍後再試。';
};
```

**優先級：** 🔴 高

---

### 4. **缺少表單驗證** ⚠️ 使用者體驗問題

**問題位置：**
- `App.tsx:57-146` - `InputForm` 元件

**問題描述：**
- 只有基本的 HTML5 驗證（`required`）
- 缺少即時驗證和友善的錯誤提示
- URL 驗證不夠嚴格
- 產品描述長度未限制

**建議：**

使用 `react-hook-form` + `zod`：

```typescript
// components/forms/InputForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const productInfoSchema = z.object({
  name: z.string()
    .min(1, '產品名稱不能為空')
    .max(100, '產品名稱不能超過 100 個字元'),
  description: z.string()
    .min(10, '產品描述至少需要 10 個字元')
    .max(5000, '產品描述不能超過 5000 個字元'),
  url: z.string()
    .url('請輸入有效的網址')
    .optional()
    .or(z.literal('')),
  market: z.string()
    .min(1, '目標市場不能為空')
    .max(200, '目標市場描述不能超過 200 個字元'),
});

type ProductInfoForm = z.infer<typeof productInfoSchema>;
```

**優先級：** 🟡 中高

---

## 🟡 中優先級問題（建議短期內處理）

### 5. **缺少自訂 Hooks 抽象** ⚠️ 程式碼重複

**問題位置：**
- `App.tsx` - 狀態管理邏輯直接寫在元件中

**問題描述：**
- 業務邏輯與 UI 邏輯耦合
- 狀態管理邏輯重複
- 難以重用和測試

**建議實作：**

```typescript
// hooks/useProductAnalysis.ts
export const useProductAnalysis = () => {
  const { apiKey } = useApiKey();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const analyze = useCallback(async (productInfo: ProductInfo) => {
    if (!apiKey) {
      setError('請先設定 Gemini API Key');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeMarket(productInfo, apiKey);
      setAnalysisResult(result);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setAnalysisResult(null);
  }, []);

  return { analyze, isLoading, error, analysisResult, reset };
};
```

**優先級：** 🟡 中

---

### 6. **圖片處理邏輯可以優化** ⚠️ 效能與安全性

**問題位置：**
- `App.tsx:9-15` - `fileToBase64` 函數

**問題描述：**
- 缺少檔案大小和格式驗證
- 大檔案可能造成記憶體問題
- 缺少錯誤處理

**建議：**

```typescript
// utils/fileUtils.ts
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const validateImageFile = (file: File): FileValidationResult => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: '不支援的圖片格式。請使用 JPEG、PNG、WebP 或 GIF 格式。' 
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `圖片大小不能超過 ${MAX_FILE_SIZE / 1024 / 1024}MB。` 
    };
  }
  
  return { valid: true };
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = () => reject(new Error('讀取檔案時發生錯誤'));
    reader.readAsDataURL(file);
  });
};
```

**優先級：** 🟡 中

---

### 7. **Markdown 生成邏輯重複** ⚠️ 程式碼重複

**問題位置：**
- `App.tsx:196-243` - `AnalysisResultDisplay` 的 `handleDownload`
- `App.tsx:364-407` - `ContentStrategyDisplay` 的 `handleDownload`

**問題描述：**
- Markdown 生成邏輯重複
- 下載邏輯重複

**建議：**

```typescript
// utils/markdownUtils.ts
export const generateAnalysisReport = (
  productInfo: ProductInfo,
  result: AnalysisResult
): string => {
  let report = `# ${productInfo.name} - 市場分析報告\n\n`;
  if (productInfo.url) {
    report += `**產品連結:** [${productInfo.url}](${productInfo.url})\n\n`;
  }
  // ... 其他內容
  return report;
};

export const generateStrategyReport = (
  productInfo: ProductInfo,
  strategy: ContentStrategy
): string => {
  let report = `# ${productInfo.name} - 內容與互動策略\n\n`;
  // ... 其他內容
  return report;
};

export const downloadMarkdown = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
```

**優先級：** 🟡 中

---

### 8. **型別定義可以更嚴格** ⚠️ 型別安全

**問題位置：**
- `types.ts` - 型別定義較寬鬆

**問題描述：**
- 某些型別使用 `string[]`，缺少更具體的約束
- 缺少 runtime 驗證
- API 回應可能不符合預期型別

**建議：**

使用 Zod 進行 Schema 驗證：

```typescript
// schemas/analysisSchema.ts
import { z } from 'zod';

export const AnalysisResultSchema = z.object({
  productCoreValue: z.object({
    mainFeatures: z.array(z.string()).min(1),
    coreAdvantages: z.array(z.string()).min(1),
    painPointsSolved: z.array(z.string()).min(1),
  }),
  marketPositioning: z.object({
    culturalInsights: z.string().min(10),
    consumerHabits: z.string().min(10),
    languageNuances: z.string().min(10),
    searchTrends: z.array(z.string()).min(1),
  }),
  competitorAnalysis: z.array(z.object({
    brandName: z.string().min(1),
    marketingStrategy: z.string().min(1),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
  })).min(1),
  buyerPersonas: z.array(z.object({
    personaName: z.string().min(1),
    demographics: z.string().min(1),
    interests: z.array(z.string()),
    painPoints: z.array(z.string()),
    keywords: z.array(z.string()),
  })).min(1),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// 在服務中使用
export const analyzeMarket = async (productInfo: ProductInfo, apiKey: string): Promise<AnalysisResult> => {
  // ... API 呼叫
  const parsedResult = AnalysisResultSchema.parse(jsonData);
  return parsedResult;
};
```

**優先級：** 🟡 中

---

## 🟢 低優先級問題（建議中期處理）

### 9. **缺少程式碼品質工具** ⚠️ 程式碼品質

**問題：**
- 沒有 ESLint 配置
- 沒有 Prettier 配置
- 沒有 pre-commit hooks

**建議新增：**

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0"
  }
}
```

**優先級：** 🟢 低

---

### 10. **缺少單元測試** ⚠️ 品質保證

**問題：**
- 沒有任何測試檔案
- 服務層函數未測試
- 工具函數未測試

**建議：**

```typescript
// services/__tests__/geminiService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeMarket } from '../geminiService';

describe('analyzeMarket', () => {
  it('should return valid analysis result', async () => {
    const productInfo = {
      name: '測試產品',
      description: '這是一個測試產品',
      market: '台灣',
    };

    // Mock API 回應
    const result = await analyzeMarket(productInfo, 'test-api-key');
    
    expect(result).toHaveProperty('productCoreValue');
    expect(result).toHaveProperty('marketPositioning');
    expect(result).toHaveProperty('competitorAnalysis');
    expect(result).toHaveProperty('buyerPersonas');
  });

  it('should handle API errors gracefully', async () => {
    // 測試錯誤處理
  });
});
```

**優先級：** 🟢 低

---

### 11. **缺少程式碼分割（Code Splitting）** ⚠️ 載入效能

**問題：**
- 所有元件打包在單一檔案中
- 初始載入時間可能較長

**建議：**

```typescript
// App.tsx
import { lazy, Suspense } from 'react';

const AnalysisResultDisplay = lazy(() => import('./components/analysis/AnalysisResultDisplay'));
const ContentStrategyDisplay = lazy(() => import('./components/strategy/ContentStrategyDisplay'));

// 使用時
<Suspense fallback={<Loader title="載入中..." message="正在載入內容..." />}>
  {analysisResult && <AnalysisResultDisplay result={analysisResult} productInfo={productInfo} />}
</Suspense>
```

**優先級：** 🟢 低

---

### 12. **缺少無障礙設計（A11y）** ⚠️ 可訪問性

**問題：**
- 按鈕缺少 `aria-label`
- 表單缺少錯誤訊息的 `aria-describedby`
- 缺少鍵盤導航支援
- 缺少焦點管理

**建議：**

```typescript
<button
  onClick={handleSubmit}
  aria-label="生成市場分析報告"
  aria-busy={isLoading}
  disabled={isLoading}
>
  生成市場分析報告
</button>

<input
  id="productName"
  type="text"
  aria-describedby={errors.name ? "productName-error" : undefined}
  aria-invalid={!!errors.name}
/>
{errors.name && (
  <span id="productName-error" role="alert">
    {errors.name.message}
  </span>
)}
```

**優先級：** 🟢 低

---

### 13. **缺少資料快取機制** ⚠️ 效能

**問題：**
- 每次重新分析都要重新呼叫 API
- 相同產品資訊重複分析浪費資源

**建議：**

```typescript
// hooks/useCache.ts
import { useMemo } from 'react';

const cache = new Map<string, { result: AnalysisResult; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 小時

export const useCachedAnalysis = (productInfo: ProductInfo | null) => {
  const cacheKey = useMemo(() => {
    if (!productInfo) return null;
    return `${productInfo.name}-${productInfo.market}-${productInfo.description.slice(0, 50)}`;
  }, [productInfo]);

  const getCached = (): AnalysisResult | null => {
    if (!cacheKey) return null;
    const cached = cache.get(cacheKey);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > CACHE_TTL) {
      cache.delete(cacheKey);
      return null;
    }
    
    return cached.result;
  };

  const setCached = (result: AnalysisResult) => {
    if (cacheKey) {
      cache.set(cacheKey, { result, timestamp: Date.now() });
    }
  };

  return { getCached, setCached };
};
```

**優先級：** 🟢 低

---

### 14. **TypeScript 配置可以更嚴格** ⚠️ 型別安全

**問題位置：**
- `tsconfig.json`

**問題描述：**
- 缺少嚴格模式設定
- 可能導致潛在的型別錯誤

**建議：**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "types": ["node"],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["./*"]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

**優先級：** 🟢 低

---

### 15. **重複的 Vite 配置檔案** ⚠️ 混淆

**問題：**
- `vite.config.ts` 和 `vite.config.simple.ts` 同時存在
- 不清楚使用哪一個

**建議：**
- 移除 `vite.config.simple.ts`
- 統一使用 `vite.config.ts`
- 如果需要不同環境配置，使用環境變數切換

**優先級：** 🟢 低

---

## 📊 優先級建議

### 🔴 立即處理（本週內）
1. ✅ **重構 App.tsx** - 拆分元件和邏輯（最高優先級）
2. ✅ **提取提示詞生成邏輯** - 建立 `utils/promptTemplates.ts`
3. ✅ **實作統一錯誤處理** - 建立 `utils/errorHandler.ts`

### 🟡 短期優化（本月至下月）
4. ✅ **實作自訂 Hooks** - 抽象業務邏輯
5. ✅ **新增表單驗證** - 使用 react-hook-form + zod
6. ✅ **優化圖片處理** - 新增驗證和錯誤處理
7. ✅ **提取 Markdown 生成邏輯** - 建立 `utils/markdownUtils.ts`

### 🟢 中期優化（未來 2-3 個月）
8. ✅ **新增程式碼品質工具** - ESLint + Prettier + Husky
9. ✅ **新增單元測試** - 使用 Vitest
10. ✅ **實作程式碼分割** - 優化載入效能
11. ✅ **改善無障礙設計** - A11y 最佳實踐
12. ✅ **實作資料快取** - 減少 API 呼叫

### 🔵 長期優化（持續改進）
13. ✅ **強化型別安全** - 使用 Zod 進行 runtime 驗證
14. ✅ **優化 TypeScript 配置** - 啟用嚴格模式
15. ✅ **持續優化使用者體驗** - 根據使用者反饋改進

---

## 🎯 總結

### 專案優點 ✅
1. **功能完整** - 涵蓋市場分析、內容策略、提示詞生成
2. **技術棧現代** - React 19 + TypeScript + Vite
3. **UI 設計良好** - 使用 Tailwind CSS，介面美觀
4. **型別定義完整** - 有完整的 TypeScript 型別定義
5. **API Key 管理改善** - 使用 Context API，符合純前端架構

### 主要問題 ⚠️
1. **程式碼組織** - App.tsx 過大（1429 行），需要重構
2. **錯誤處理** - 缺少統一的錯誤處理機制
3. **表單驗證** - 缺少完整的表單驗證
4. **測試** - 完全沒有測試覆蓋
5. **程式碼品質工具** - 缺少 ESLint、Prettier 等工具

### 建議行動方案 📋
1. **第一週**：重構 App.tsx，拆分元件和邏輯
2. **第二週**：提取提示詞生成邏輯，實作錯誤處理
3. **第三週**：實作表單驗證和圖片處理優化
4. **第四週**：新增程式碼品質工具和測試框架

---

## 📞 後續支援

如需協助實作任何改善項目，請隨時聯繫。建議按照優先級逐步實施，先處理程式碼組織問題，再進行功能優化，最後完善測試和文件。

---

**報告結束**


