# FlyPig AI 電商增長神器 - 完整整合提示詞

## 📋 專案概述

請幫我在當前專案中整合一個名為「FlyPig AI 電商增長神器」的完整功能模組。這是一個由 AI 驅動的電商市場分析與內容策略生成系統，採用三階段漸進式工作流程，從市場分析到內容產出全自動化。

---

## 🎯 核心功能需求

### 第一階段：深度市場分析 (Market Analysis)
使用者輸入產品資訊後，系統需透過 Google Gemini API 生成完整的市場分析報告，包含：

1. **產品核心價值分析** (ProductCoreValue)
   - 主要特色 (mainFeatures: string[])
   - 核心優勢 (coreAdvantages: string[])
   - 解決的痛點 (painPointsSolved: string[])

2. **目標市場定位** (MarketPositioning)
   - 文化洞察 (culturalInsights: string)
   - 消費習慣 (consumerHabits: string)
   - 語言特性 (languageNuances: string)
   - 搜尋趨勢 (searchTrends: string[])

3. **競爭對手分析** (Competitor[])
   - 品牌名稱、行銷策略、優勢、劣勢
   - 自動識別 3 個主要競爭對手

4. **潛在客戶描繪** (BuyerPersona[])
   - 人物名稱、基本資料、興趣、痛點、搜尋關鍵字
   - 生成 3 個詳細的買家人物誌

**輸入格式：**
- 產品名稱 (必填)
- 產品描述 (必填)
- 目標市場 (必填)
- 產品連結網址 (選填)
- 產品圖片 (選填，支援 base64 格式)

### 第二階段：內容與 SEO 策略 (Content Strategy)
基於第一階段的分析結果，生成專業的內容策略：

1. **內容主題** (ContentTopic[]) - 3 個主題
   - 主題標題、描述
   - 主要關鍵字 (focusKeyword)
   - 長尾關鍵字 (longTailKeywords: string[])
   - SEO 指導 (關鍵字密度、語意關鍵字、內外部連結策略)

2. **互動元素建議** (InteractiveElement[])
   - 類型、描述
   - 2-3 個建議

3. **行動呼籲文案** (CTA Suggestions: string[])
   - 3 個自然且具說服力的 CTA 文案

### 第三階段：AI Studio 提示詞生成
為每個內容主題生成適用於 Google AI Studio 的詳細提示詞，用於生成 React + Tailwind CSS 的前導頁程式碼。

### 其他功能
- 下載市場分析報告為 Markdown 檔案
- 下載內容策略為 Markdown 檔案
- API Key 管理（透過 Context，儲存在 localStorage）

---

## 🛠️ 技術架構要求

### 技術棧
- **前端框架**: React 19+ (使用 TypeScript)
- **CSS 框架**: Tailwind CSS (透過 CDN 或 npm)
- **AI 服務**: Google Gemini API (使用 @google/genai 套件)
- **狀態管理**: React Context API
- **建置工具**: Vite (可選，也可使用其他建置工具)

### 必要依賴
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "@google/genai": "^1.19.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

---

## 📁 檔案結構

請建立以下檔案結構：

```
專案根目錄/
├── src/ 或 根目錄/
│   ├── contexts/
│   │   └── ApiKeyContext.tsx          # API Key 管理 Context
│   ├── components/
│   │   └── ApiKeyModal.tsx             # API Key 設定彈窗
│   ├── services/
│   │   └── geminiService.ts            # Gemini API 服務層
│   ├── types.ts                        # TypeScript 型別定義
│   ├── App.tsx                         # 主應用元件
│   └── index.tsx                       # 應用入口
├── index.html                          # HTML 入口檔案
└── package.json                        # 專案依賴配置
```

---

## 🔧 核心實作細節

### 1. TypeScript 型別定義 (types.ts)

```typescript
export interface ProductCoreValue {
  mainFeatures: string[];
  coreAdvantages: string[];
  painPointsSolved: string[];
}

export interface MarketPositioning {
  culturalInsights: string;
  consumerHabits: string;
  languageNuances: string;
  searchTrends: string[];
}

export interface Competitor {
  brandName: string;
  marketingStrategy: string;
  strengths: string[];
  weaknesses: string[];
}

export interface BuyerPersona {
  personaName: string;
  demographics: string;
  interests: string[];
  painPoints: string[];
  keywords: string[];
}

export interface AnalysisResult {
  productCoreValue: ProductCoreValue;
  marketPositioning: MarketPositioning;
  competitorAnalysis: Competitor[];
  buyerPersonas: BuyerPersona[];
}

export interface ProductInfo {
  name: string;
  description: string;
  url?: string;
  image?: {
    base64: string;
    mimeType: string;
  };
  market: string;
}

export interface SeoGuidance {
  keywordDensity: string;
  semanticKeywords: string[];
  linkingStrategy: {
    internal: string;
    external: string;
  };
}

export interface ContentTopic {
  topic: string;
  description: string;
  focusKeyword: string;
  longTailKeywords: string[];
  seoGuidance: SeoGuidance;
}

export interface InteractiveElement {
  type: string;
  description: string;
}

export interface ContentStrategy {
  contentTopics: ContentTopic[];
  interactiveElements: InteractiveElement[];
  ctaSuggestions: string[];
}
```

### 2. API Key Context (contexts/ApiKeyContext.tsx)

建立一個 Context 來管理 Gemini API Key：
- 使用 localStorage 持久化儲存
- 提供 `apiKey`, `setApiKey`, `clearApiKey`, `isApiKeySet` 等狀態和方法
- 在應用啟動時自動從 localStorage 載入已儲存的 API Key

### 3. Gemini API 服務層 (services/geminiService.ts)

實作兩個主要函數：

**analyzeMarket(productInfo: ProductInfo): Promise<AnalysisResult>**
- 如果產品有圖片，先使用 Gemini Vision API 分析圖片
- 使用結構化輸出 (responseSchema) 確保回傳格式正確
- 使用 `gemini-2.5-flash` 模型
- 所有內容必須是繁體中文
- API Key 透過 `setGeminiApiKey()` 函數動態設定

**generateContentStrategy(analysisResult: AnalysisResult): Promise<ContentStrategy>**
- 基於市場分析結果生成內容策略
- 同樣使用結構化輸出確保格式正確
- 生成 3 個內容主題、2-3 個互動元素、3 個 CTA 建議

**重要：** API Key 不應該寫死在程式碼中，應該透過 Context 動態傳入。

### 4. UI 元件需求

**主要元件：**

1. **InputForm** - 產品資訊輸入表單
   - 產品名稱、描述、目標市場（必填）
   - 產品連結網址（選填）
   - 產品圖片上傳（選填，支援拖曳上傳，顯示預覽）
   - 表單驗證和錯誤提示

2. **AnalysisResultDisplay** - 市場分析結果顯示
   - 產品核心價值卡片（三欄布局）
   - 目標市場定位卡片
   - 競爭對手分析卡片（網格布局）
   - 潛在客戶描繪卡片（網格布局）
   - 下載報告按鈕（生成 Markdown）

3. **ContentStrategyDisplay** - 內容策略顯示
   - 內容主題卡片（每個主題一個卡片）
   - 每個主題卡片包含：標題、描述、SEO 指導、生成 AI Studio 提示詞按鈕
   - 互動元素建議區塊
   - CTA 建議區塊
   - 下載策略按鈕

4. **PromptModal** - 提示詞顯示彈窗
   - 顯示生成的 AI Studio 提示詞
   - 支援複製功能
   - 可關閉

5. **ApiKeyModal** - API Key 設定彈窗
   - 輸入框（支援顯示/隱藏）
   - 安全性說明文字
   - 提交按鈕
   - 連結到 Gemini API Key 申請頁面

6. **Loader** - 載入狀態元件
   - 顯示載入動畫和訊息

7. **ErrorDisplay** - 錯誤顯示元件
   - 顯示錯誤訊息

### 5. 主應用流程 (App.tsx)

**狀態管理：**
- `productInfo`: 當前分析的產品資訊
- `analysisResult`: 市場分析結果
- `contentStrategy`: 內容策略結果
- `isLoading`: 載入狀態
- `error`: 錯誤訊息
- `isApiKeyModalOpen`: API Key 設定彈窗開關

**主要函數：**

1. `handleAnalyze(productInfo)` - 處理市場分析
   - 檢查 API Key 是否設定
   - 呼叫 `analyzeMarket()`
   - 處理錯誤和載入狀態

2. `handleGenerateStrategy()` - 生成內容策略
   - 檢查 API Key 和 analysisResult
   - 呼叫 `generateContentStrategy()`
   - 處理錯誤和載入狀態

3. `handleGenerateAIStudioPrompt(topic)` - 生成 AI Studio 提示詞
   - 基於產品資訊、分析結果、內容主題生成詳細提示詞
   - 提示詞應包含：產品資訊、目標受眾、關鍵訊息、SEO 要求、頁面結構要求、設計規範
   - 開啟 PromptModal 顯示提示詞

4. `handleDownloadReport()` - 下載市場分析報告
   - 將 AnalysisResult 轉換為 Markdown 格式
   - 建立 Blob 並觸發下載

5. `handleDownloadStrategy()` - 下載內容策略
   - 將 ContentStrategy 轉換為 Markdown 格式
   - 建立 Blob 並觸發下載

### 6. AI Studio 提示詞格式

生成的提示詞應包含以下結構：

```
You are an expert frontend developer specializing in creating high-conversion landing pages with React and Tailwind CSS.

**Boilerplate Structure:**
[HTML 結構說明]

**Instructions for the React Code:**
1. Imports: React, ReactDOM
2. Single Component Structure
3. Render the App
4. Design & UX requirements
5. Content & SEO requirements
6. Page Structure requirements

**Context Data:**
- Product Name
- Product Description
- Target Market
- Headline/Topic
- Description for Topic
```

---

## 🎨 UI/UX 設計要求

### 色彩主題
- 背景色：深色主題 (`bg-slate-900` 或 `bg-background`)
- 主要品牌色：藍色系 (`brand-primary`, `brand-secondary`)
- 文字顏色：淺色文字 (`text-slate-50`, `text-slate-300`)

### 布局
- 響應式設計（支援手機、平板、桌面）
- 最大寬度容器：`max-w-6xl` 或 `max-w-7xl`
- 卡片式設計，使用圓角和陰影
- 適當的間距和留白

### 互動效果
- 按鈕 hover 效果
- 載入動畫
- 淡入動畫 (`animate-fade-in`)
- 滑入動畫 (`animate-slide-in-up`)

### 表單設計
- 清晰的標籤和佔位符
- 必填欄位標記
- 圖片上傳區域（支援拖曳）
- 圖片預覽功能

---

## 🔐 API Key 管理

### 安全要求
- API Key 只儲存在瀏覽器的 localStorage
- 不應該上傳到伺服器
- 在 UI 中明確告知使用者安全性
- 提供 API Key 申請連結

### 驗證流程
- 在呼叫任何 API 前檢查 API Key 是否設定
- 如果未設定，自動彈出設定視窗
- 在右上角提供「API Key 設定」按鈕，隨時可以修改

---

## 📝 Markdown 報告格式

### 市場分析報告格式
```markdown
# [產品名稱] - 市場分析報告

**產品連結:** [URL]

## 產品核心價值
### 主要特色
- [特色1]
- [特色2]

### 核心優勢
- [優勢1]
- [優勢2]

### 解決的痛點
- [痛點1]
- [痛點2]

## 目標市場定位
**文化洞察:** [內容]
**消費習慣:** [內容]
**語言特性:** [內容]
**搜尋趨勢:**
- [趨勢1]
- [趨勢2]

## 競爭對手分析
### [品牌名稱]
**行銷策略:** [策略]
**優勢:**
- [優勢1]
**劣勢:**
- [劣勢1]

## 潛在客戶描繪
### [人物名稱]
**基本資料:** [資料]
**興趣:** [興趣1], [興趣2]
**痛點:**
- [痛點1]
**他們會搜尋的關鍵字:**
- [關鍵字1]
```

### 內容策略報告格式
```markdown
# [產品名稱] - 內容與互動策略

## 內容主題
### 主題: [主題名稱]
**描述:** [描述]
**主要關鍵字:** `[關鍵字]`
**長尾關鍵字:** `[關鍵字1]`, `[關鍵字2]`
**SEO 指導:**
  - **關鍵字密度:** [密度]
  - **語意關鍵字:** [關鍵字列表]
  - **內部連結策略:** [策略]
  - **外部連結策略:** [策略]

## 互動元素建議
### [類型]
[描述]

## 行動呼籲 (CTA) 文案建議
- "[CTA1]"
- "[CTA2]"
```

---

## 🚀 整合步驟

1. **安裝依賴**
   ```bash
   npm install react react-dom @google/genai
   npm install -D typescript @types/react @types/react-dom @vitejs/plugin-react vite
   ```

2. **建立檔案結構**
   - 建立 `contexts/`, `components/`, `services/` 目錄
   - 建立所有必要的 TypeScript 檔案

3. **實作 Context**
   - 建立 `ApiKeyContext.tsx`
   - 在 `index.tsx` 中包裝 `ApiKeyProvider`

4. **實作服務層**
   - 建立 `geminiService.ts`
   - 實作 `analyzeMarket()` 和 `generateContentStrategy()`
   - 確保使用結構化輸出 (responseSchema)

5. **實作 UI 元件**
   - 建立所有必要的 UI 元件
   - 實作表單驗證和錯誤處理
   - 實作載入狀態和動畫

6. **整合主應用**
   - 在 `App.tsx` 中整合所有元件
   - 實作所有事件處理函數
   - 確保 API Key 驗證流程

7. **測試功能**
   - 測試 API Key 設定流程
   - 測試市場分析功能
   - 測試內容策略生成
   - 測試提示詞生成和下載功能

---

## ⚠️ 重要注意事項

1. **API Key 安全性**
   - 絕對不要將 API Key 寫死在程式碼中
   - 使用 Context 動態管理
   - 明確告知使用者 API Key 只儲存在瀏覽器

2. **錯誤處理**
   - 所有 API 呼叫都應該有 try-catch
   - 提供友善的錯誤訊息
   - 處理網路錯誤和 API 錯誤

3. **型別安全**
   - 使用 TypeScript 確保型別安全
   - 驗證 API 回傳的資料格式
   - 處理可能的型別錯誤

4. **使用者體驗**
   - 提供清晰的載入狀態
   - 適當的錯誤提示
   - 流暢的動畫效果
   - 響應式設計

5. **國際化**
   - 所有 UI 文字使用繁體中文
   - API 提示詞明確要求回傳繁體中文
   - 確保所有生成內容都是繁體中文

---

## 📋 驗收標準

完成整合後，系統應該能夠：

✅ 使用者可以設定和管理 Gemini API Key  
✅ 使用者可以輸入產品資訊（包含圖片上傳）  
✅ 系統能夠生成完整的市場分析報告  
✅ 系統能夠基於分析結果生成內容策略  
✅ 系統能夠為每個主題生成 AI Studio 提示詞  
✅ 使用者可以下載市場分析和內容策略報告  
✅ 所有 UI 元件正常運作且美觀  
✅ 錯誤處理完善  
✅ 響應式設計正常  

---

請根據以上需求，完整實作這個功能模組，確保所有功能都能正常運作，程式碼品質良好，並遵循最佳實踐。

