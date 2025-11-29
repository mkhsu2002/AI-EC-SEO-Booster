# FlyPig AI 電商增長神器 - 專案優化建議報告

## 📋 專案概述

本專案是一個基於 React + TypeScript + Vite 的電商市場分析與內容策略生成工具，整合 Google Gemini API 進行 AI 驅動的市場分析和內容規劃。

---

## 🔍 優化項目清單

### 🔴 高優先級（安全性與穩定性）

#### 1. **API Key 安全問題**
**問題：**
- `services/gammaService.ts` 中硬編碼了 Gamma API Key（第 6 行）
- API Key 直接暴露在客戶端程式碼中，存在安全風險

**建議：**
```typescript
// ❌ 目前的做法（不安全）
const GAMMA_API_KEY = 'sk-gamma-VNp5x2VOUlFLI9cuAPOyK1c4foYfJcesD24zKIrNA';

// ✅ 建議做法
const GAMMA_API_KEY = process.env.GAMMA_API_KEY || '';
if (!GAMMA_API_KEY) {
  throw new Error("GAMMA_API_KEY environment variable not set");
}
```

**進一步建議：**
- 將 Gamma API 呼叫移至後端服務（Cloudflare Workers Functions）
- 使用環境變數管理所有敏感資訊
- 實作 API Key 輪換機制

---

#### 2. **環境變數管理不一致**
**問題：**
- `geminiService.ts` 使用 `process.env.API_KEY`
- `vite.config.ts` 定義了 `process.env.GEMINI_API_KEY`
- 命名不一致，容易造成混淆

**建議：**
```typescript
// 統一使用 GEMINI_API_KEY
const API_KEY = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

// 在 vite.config.ts 中統一配置
define: {
  'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
}
```

**最佳實踐：**
- 建立 `.env.example` 檔案說明所需環境變數
- 使用 `import.meta.env` 而非 `process.env`（Vite 標準）
- 所有環境變數以 `VITE_` 前綴命名

---

#### 3. **錯誤處理不完善**
**問題：**
- API 錯誤訊息直接顯示給使用者，可能洩露敏感資訊
- 缺少統一的錯誤處理機制
- 網路錯誤、超時錯誤未特別處理

**建議：**
```typescript
// 建立統一的錯誤處理工具
// utils/errorHandler.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.userMessage;
  }
  if (error instanceof Error) {
    // 記錄詳細錯誤到日誌系統
    console.error('API Error:', error);
    return '發生未知錯誤，請稍後再試';
  }
  return '發生未知錯誤，請稍後再試';
};
```

---

### 🟡 中優先級（架構與程式碼品質）

#### 4. **單一檔案過大（App.tsx）**
**問題：**
- `App.tsx` 超過 880 行，包含過多元件和邏輯
- 違反單一職責原則，難以維護和測試

**建議重構結構：**
```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Loader.tsx
│   │   ├── ErrorDisplay.tsx
│   │   └── Tag.tsx
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
│   └── useFileUpload.ts
├── utils/
│   ├── fileUtils.ts
│   ├── markdownUtils.ts
│   └── errorHandler.ts
└── App.tsx
```

---

#### 5. **缺少自訂 Hooks 抽象**
**問題：**
- 業務邏輯直接寫在元件中
- 狀態管理邏輯重複，難以重用

**建議：**
```typescript
// hooks/useProductAnalysis.ts
export const useProductAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const analyze = useCallback(async (productInfo: ProductInfo) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeMarket(productInfo);
      setAnalysisResult(result);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { analyze, isLoading, error, analysisResult };
};
```

---

#### 6. **型別定義可以更嚴格**
**問題：**
- 某些型別使用 `string[]`，缺少更具體的約束
- 缺少驗證函數確保資料完整性

**建議：**
```typescript
// types.ts - 使用更嚴格的型別
export type Keyword = string & { readonly __brand: 'Keyword' };
export type URL = string & { readonly __brand: 'URL' };

// 驗證函數
export const validateAnalysisResult = (data: unknown): AnalysisResult => {
  // 使用 zod 或 yup 進行 runtime 驗證
  // ...
};
```

**或使用 Zod 進行 Schema 驗證：**
```typescript
import { z } from 'zod';

const AnalysisResultSchema = z.object({
  productCoreValue: z.object({
    mainFeatures: z.array(z.string()).min(1),
    // ...
  }),
  // ...
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
```

---

#### 7. **圖片處理邏輯可以優化**
**問題：**
- `fileToBase64` 函數直接寫在 `App.tsx` 中
- 缺少檔案大小和格式驗證
- 大檔案可能造成記憶體問題

**建議：**
```typescript
// utils/fileUtils.ts
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: '不支援的圖片格式' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: '圖片大小不能超過 10MB' };
  }
  return { valid: true };
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
```

---

### 🟢 低優先級（效能與體驗優化）

#### 8. **缺少 Loading 狀態細化**
**問題：**
- 只有簡單的載入狀態，使用者無法了解進度
- 長時間操作缺少進度提示

**建議：**
```typescript
// 實作進度追蹤
interface LoadingState {
  stage: 'analyzing' | 'generating-strategy' | 'processing-image';
  progress?: number;
  message: string;
}
```

---

#### 9. **缺少資料快取機制**
**問題：**
- 每次重新分析都要重新呼叫 API
- 相同產品資訊重複分析浪費資源

**建議：**
```typescript
// hooks/useCache.ts
import { useMemo } from 'react';

const cache = new Map<string, AnalysisResult>();

export const useCachedAnalysis = (productInfo: ProductInfo | null) => {
  const cacheKey = useMemo(() => {
    if (!productInfo) return null;
    return `${productInfo.name}-${productInfo.market}-${productInfo.description.slice(0, 50)}`;
  }, [productInfo]);

  const getCached = () => cacheKey ? cache.get(cacheKey) : null;
  const setCached = (result: AnalysisResult) => {
    if (cacheKey) cache.set(cacheKey, result);
  };

  return { getCached, setCached };
};
```

---

#### 10. **Markdown 生成邏輯重複**
**問題：**
- `AnalysisResultDisplay` 和 `ContentStrategyDisplay` 都有下載功能
- Markdown 生成邏輯重複

**建議：**
```typescript
// utils/markdownUtils.ts
export const generateAnalysisReport = (
  productInfo: ProductInfo,
  result: AnalysisResult
): string => {
  // 統一的 Markdown 生成邏輯
};

export const generateStrategyReport = (
  productInfo: ProductInfo,
  strategy: ContentStrategy
): string => {
  // 統一的 Markdown 生成邏輯
};

export const downloadMarkdown = (content: string, filename: string) => {
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

---

#### 11. **缺少表單驗證**
**問題：**
- 只有基本的 HTML5 驗證
- 缺少即時驗證和友善的錯誤提示

**建議：**
```typescript
// 使用 react-hook-form 或 formik
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const productInfoSchema = z.object({
  name: z.string().min(1, '產品名稱不能為空').max(100),
  description: z.string().min(10, '產品描述至少需要 10 個字元'),
  url: z.string().url('請輸入有效的網址').optional().or(z.literal('')),
  market: z.string().min(1, '目標市場不能為空'),
});
```

---

#### 12. **提示詞生成邏輯過於複雜**
**問題：**
- `handleGenerateGammaPrompt` 和 `handleGenerateAIStudioPrompt` 函數過長
- 提示詞模板硬編碼在元件中

**建議：**
```typescript
// utils/promptTemplates.ts
export const generateGammaPrompt = (
  productInfo: ProductInfo,
  analysisResult: AnalysisResult,
  topic: ContentTopic,
  contentStrategy: ContentStrategy
): string => {
  // 使用模板字串或模板引擎
  return TEMPLATES.gamma({
    productInfo,
    analysisResult,
    topic,
    contentStrategy,
  });
};
```

---

### 📦 專案配置優化

#### 13. **缺少環境變數範例檔案**
**建議建立 `.env.example`：**
```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Gamma API Key (if using backend)
GAMMA_API_KEY=your_gamma_api_key_here
```

---

#### 14. **TypeScript 配置可以更嚴格**
**問題：**
- `tsconfig.json` 缺少嚴格模式設定

**建議：**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

#### 15. **缺少程式碼品質工具**
**建議新增：**
- ESLint 配置
- Prettier 配置
- Husky + lint-staged（pre-commit hooks）
- 單元測試框架（Vitest）

**package.json 建議新增 scripts：**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest"
  }
}
```

---

#### 16. **建置配置優化**
**問題：**
- 有兩個 vite 配置檔案（`vite.config.ts` 和 `vite.config.simple.ts`）
- 不清楚使用哪一個

**建議：**
- 移除不需要的配置檔案
- 統一使用一個配置檔案
- 根據環境變數切換不同配置

---

### 🧪 測試與文件

#### 17. **缺少單元測試**
**建議：**
- 為服務層函數撰寫單元測試
- 為工具函數撰寫測試
- 使用 Vitest 作為測試框架

```typescript
// services/__tests__/geminiService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { analyzeMarket } from '../geminiService';

describe('analyzeMarket', () => {
  it('should return valid analysis result', async () => {
    // 測試邏輯
  });
});
```

---

#### 18. **缺少 API 文件**
**建議：**
- 使用 JSDoc 註解 API 函數
- 建立 API 使用文件
- 說明錯誤碼和處理方式

---

#### 19. **缺少 README.md**
**問題：**
- 專案缺少 README 說明檔案

**建議建立包含：**
- 專案簡介
- 安裝步驟
- 環境變數設定
- 開發指南
- 部署說明

---

### 🎨 UI/UX 優化

#### 20. **缺少無障礙設計（A11y）**
**問題：**
- 按鈕缺少 aria-label
- 表單缺少錯誤訊息的 aria-describedby
- 缺少鍵盤導航支援

**建議：**
```typescript
<button
  onClick={handleSubmit}
  aria-label="生成市場分析報告"
  aria-busy={isLoading}
>
  生成市場分析報告
</button>
```

---

#### 21. **響應式設計可以改進**
**問題：**
- 某些元件在小螢幕上可能顯示不佳
- 缺少行動裝置優化

**建議：**
- 使用 Tailwind 的響應式類別
- 測試不同螢幕尺寸
- 優化觸控操作體驗

---

#### 22. **缺少深色/淺色主題切換**
**建議：**
- 實作主題切換功能
- 使用 CSS 變數管理主題色彩
- 儲存使用者偏好設定

---

### 🔄 效能優化

#### 23. **缺少程式碼分割（Code Splitting）**
**問題：**
- 所有元件打包在單一檔案中
- 初始載入時間可能較長

**建議：**
```typescript
// 使用 React.lazy 進行動態載入
const AnalysisResultDisplay = React.lazy(() => import('./components/analysis/AnalysisResultDisplay'));
const ContentStrategyDisplay = React.lazy(() => import('./components/strategy/ContentStrategyDisplay'));
```

---

#### 24. **圖片優化**
**問題：**
- Base64 編碼的圖片增加 payload 大小
- 缺少圖片壓縮

**建議：**
- 使用圖片壓縮庫（如 browser-image-compression）
- 考慮使用 CDN 儲存圖片
- 實作圖片懶載入

---

#### 25. **API 請求優化**
**問題：**
- 缺少請求去重（deduplication）
- 缺少請求取消機制

**建議：**
```typescript
// 使用 AbortController 取消請求
const controller = new AbortController();

try {
  const result = await analyzeMarket(productInfo, {
    signal: controller.signal,
  });
} catch (error) {
  if (error.name === 'AbortError') {
    // 請求已取消
  }
}

// 元件卸載時取消請求
useEffect(() => {
  return () => controller.abort();
}, []);
```

---

### 🔐 安全性增強

#### 26. **輸入驗證與清理**
**問題：**
- 使用者輸入直接傳遞給 API
- 缺少 XSS 防護

**建議：**
- 驗證所有使用者輸入
- 清理 HTML 內容（如使用 DOMPurify）
- 實作 CSP（Content Security Policy）

---

#### 27. **API 速率限制**
**建議：**
- 實作客戶端速率限制
- 防止濫用 API
- 顯示友善的錯誤訊息

---

### 📊 監控與分析

#### 28. **缺少錯誤追蹤**
**建議：**
- 整合錯誤追蹤服務（如 Sentry）
- 記錄 API 錯誤
- 追蹤使用者行為（可選）

---

#### 29. **缺少效能監控**
**建議：**
- 使用 Web Vitals 追蹤效能指標
- 監控 API 回應時間
- 分析使用者體驗

---

## 📈 優先級建議

### 立即處理（本週）
1. ✅ 修復 API Key 安全問題
2. ✅ 統一環境變數管理
3. ✅ 實作統一錯誤處理

### 短期優化（本月至下月）
4. ✅ 重構 App.tsx，拆分元件
5. ✅ 實作自訂 Hooks
6. ✅ 新增表單驗證
7. ✅ 建立 README 和文件

### 中期優化（未來 2-3 個月）
8. ✅ 新增單元測試
9. ✅ 實作程式碼分割
10. ✅ 優化效能和載入時間
11. ✅ 改善無障礙設計

### 長期優化（持續改進）
12. ✅ 實作主題切換
13. ✅ 新增錯誤追蹤
14. ✅ 持續優化使用者體驗

---

## 🎯 總結

本專案整體架構良好，功能完整，但在以下方面有改進空間：

1. **安全性**：API Key 管理需要加強
2. **程式碼組織**：需要拆分大型檔案，提高可維護性
3. **錯誤處理**：需要統一的錯誤處理機制
4. **測試**：缺少測試覆蓋
5. **文件**：需要完善的文件說明

建議按照優先級逐步實施優化，先處理安全性問題，再進行架構重構，最後完善測試和文件。

