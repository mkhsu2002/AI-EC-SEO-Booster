# AI EC SEO Booster v1.0

**AI 智能電商SEO加速器**

一個由 AI 驅動的智能電商市場分析與 SEO 內容策略生成工具，透過 Google Gemini API 提供專業的市場洞察、競爭分析、買家人物誌描繪，並自動生成 SEO 優化的內容策略與前導頁提示詞。

---

## 📋 目錄

- [功能特色](#功能特色)
- [核心工作流程](#核心工作流程)
- [技術架構](#技術架構)
- [快速開始](#快速開始)
- [使用指南](#使用指南)
- [專案結構](#專案結構)
- [API 設定](#api-設定)
- [部署說明](#部署說明)
- [開發指南](#開發指南)
- [授權資訊](#授權資訊)

---

## ✨ 功能特色

### 🎯 三階段智能分析流程

**第一階段：深度市場分析**
- 📊 **產品核心價值提煉**：自動分析產品特色、核心優勢與解決的痛點
- 🌍 **目標市場定位**：深入剖析文化洞察、消費習慣、語言特性與搜尋趨勢
- 🏢 **競爭對手分析**：智能識別 3 個主要競爭對手，分析行銷策略與優劣勢
- 👥 **買家人物誌描繪**：建立 3 個詳細的潛在客戶畫像，包含興趣、痛點與搜尋關鍵字

**第二階段：內容與 SEO 策略**
- 📝 **內容主題建議**：生成 3 個吸引目標客群的非銷售性質內容主題
- 🔍 **專業 SEO 指導**：針對每個主題提供關鍵字密度、語意關鍵字與連結策略
- 🎨 **互動元素建議**：提出可增加使用者參與度的互動元素點子
- 📢 **行動呼籲文案**：提供多個自然且具說服力的 CTA 文案範例

**第三階段：AI Studio 提示詞生成**
- 🤖 **一鍵生成提示詞**：為 Google AI Studio 生成詳細的 React + Tailwind CSS 前導頁提示詞
- 💻 **完整程式碼規格**：包含頁面結構、設計規範、SEO 要求與內容指引

### 🔐 安全與便利性

- ✅ **API Key 本地管理**：使用 React Context API 管理，儲存在瀏覽器 localStorage
- 🔒 **安全性保證**：API Key 僅儲存在本地，不會上傳至伺服器
- 📥 **報告下載**：支援一鍵下載市場分析與內容策略報告（Markdown 格式）
- 🖼️ **圖片分析**：支援產品圖片上傳，使用 Gemini Vision API 進行視覺分析

---

## 🔄 核心工作流程

```
輸入產品資訊
    ↓
[第一階段] 市場分析
    ├─ 產品核心價值分析
    ├─ 目標市場定位
    ├─ 競爭對手分析
    └─ 買家人物誌描繪
    ↓
[第二階段] 內容策略生成
    ├─ 內容主題建議（3個）
    ├─ SEO 指導方針
    ├─ 互動元素建議
    └─ CTA 文案建議
    ↓
[第三階段] 提示詞生成
    └─ AI Studio 前導頁提示詞
    ↓
下載報告 / 複製提示詞
```

---

## 🛠️ 技術架構

### 前端技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| **React** | ^19.1.1 | UI 框架 |
| **TypeScript** | ~5.8.2 | 型別安全 |
| **Tailwind CSS** | CDN | 樣式框架 |
| **Vite** | ^6.2.0 | 建置工具 |
| **@google/genai** | ^1.19.0 | Gemini API 客戶端 |

### 核心架構設計

```
src/
├── contexts/
│   └── ApiKeyContext.tsx      # API Key 狀態管理
├── components/
│   └── ApiKeyModal.tsx        # API Key 設定彈窗
├── services/
│   └── geminiService.ts       # Gemini API 服務層
├── types.ts                   # TypeScript 型別定義
├── App.tsx                    # 主應用元件
└── index.tsx                  # 應用入口
```

### 設計模式

- **Context API**：全域狀態管理（API Key）
- **服務層模式**：API 呼叫封裝
- **元件化設計**：可重用的 UI 元件
- **型別安全**：完整的 TypeScript 型別定義

---

## 🚀 快速開始

### 前置需求

- Node.js 18+ 
- npm 或 yarn
- Google Gemini API Key（[免費申請](https://aistudio.google.com/app/apikey)）

### 安裝步驟

1. **複製專案**
   ```bash
   git clone https://github.com/mkhsu2002/AI-EC-SEO-Booster.git
   cd AI-EC-SEO-Booster
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

4. **開啟瀏覽器**
   - 訪問 `http://localhost:3000`
   - 首次使用會提示設定 Gemini API Key
   - 輸入您的 API Key 即可開始使用

### 建置生產版本

```bash
npm run build
```

建置產出位於 `dist/` 目錄。

---

## 📖 使用指南

### 第一步：設定 API Key

1. 點擊右上角「API Key 設定」按鈕
2. 輸入您的 Google Gemini API Key
3. API Key 會自動儲存在瀏覽器中
4. 點擊「開始使用」完成設定

> 💡 **提示**：如果還沒有 API Key，可以點擊「還沒有 Key? 點此免費獲取」連結前往申請。

### 第二步：輸入產品資訊

在表單中填寫以下資訊：

- **產品名稱**（必填）：例如「人體工學辦公椅」
- **產品描述**（必填）：詳細的產品資訊、規格與主要賣點
- **目標市場**（必填）：例如「台灣」、「美國加州」或「日本東京」
- **產品連結網址**（選填）：產品頁面 URL
- **產品圖片**（選填）：上傳產品圖片，支援拖曳上傳

### 第三步：生成市場分析

1. 點擊「生成市場分析報告」按鈕
2. 等待 AI 分析（約 30-60 秒）
3. 查看完整的市場分析報告
4. 可點擊「下載報告」保存為 Markdown 檔案

### 第四步：生成內容策略

1. 在分析報告下方點擊「第二步：生成內容策略」
2. 等待策略生成（約 20-40 秒）
3. 查看內容主題、SEO 指導與互動元素建議
4. 可點擊「下載策略」保存報告

### 第五步：生成前導頁提示詞

1. 從三個內容主題中選擇一個
2. 點擊「生成 AI Studio 提示詞」
3. 在彈窗中查看完整的提示詞
4. 點擊「複製提示詞」複製到剪貼簿
5. 將提示詞貼到 Google AI Studio 或其他 AI 程式碼助理中使用

---

## 📁 專案結構

```
AI-EC-SEO-Booster/
├── src/
│   ├── contexts/
│   │   └── ApiKeyContext.tsx          # API Key Context 管理
│   ├── components/
│   │   └── ApiKeyModal.tsx            # API Key 設定 Modal
│   ├── services/
│   │   ├── geminiService.ts           # Gemini API 服務
│   │   └── gammaService.ts            # Gamma API 服務（已移除）
│   ├── types.ts                       # TypeScript 型別定義
│   ├── App.tsx                        # 主應用元件
│   └── index.tsx                      # 應用入口
├── public/
│   ├── _headers                       # Cloudflare Pages headers
│   └── _redirects                     # SPA 路由重定向
├── dist/                              # 建置輸出目錄
├── index.html                         # HTML 入口檔案
├── vite.config.ts                     # Vite 配置
├── tsconfig.json                      # TypeScript 配置
├── package.json                       # 專案依賴
└── README.md                          # 本文件
```

---

## 🔑 API 設定

### Google Gemini API

本專案使用 Google Gemini API 進行 AI 分析。API Key 管理方式：

- **儲存位置**：瀏覽器 localStorage
- **安全性**：API Key 僅儲存在本地，不會上傳至任何伺服器
- **設定方式**：透過 UI 介面設定，首次使用會自動提示

### 取得 API Key

1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 登入您的 Google 帳號
3. 點擊「Create API Key」
4. 複製生成的 API Key
5. 在應用程式中貼上並儲存

### API 使用限制

- 免費方案有使用限制，請參考 [Google Gemini API 定價](https://ai.google.dev/pricing)
- 建議監控 API 使用量以避免超額費用

---

## 🚢 部署說明

### Cloudflare Pages 部署

本專案已配置 Cloudflare Pages 部署設定：

1. **連接 GitHub Repository**
   - 在 Cloudflare Dashboard 中選擇 Pages
   - 連接 `AI-EC-SEO-Booster` repository

2. **設定建置配置**
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: 18 或更高

3. **環境變數**（可選）
   - 如需使用環境變數，可在 Cloudflare Pages 設定中配置
   - 本專案使用 Context API 管理，無需環境變數

詳細部署說明請參考 `CLOUDFLARE_PAGES.md`。

### 其他部署平台

本專案可部署至任何支援靜態網站的平台：

- **Vercel**: 自動偵測 Vite 專案
- **Netlify**: 設定建置命令為 `npm run build`
- **GitHub Pages**: 使用 GitHub Actions 自動部署

---

## 👨‍💻 開發指南

### 開發環境設定

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

3. **型別檢查**
   ```bash
   npx tsc --noEmit
   ```

### 程式碼規範

- 使用 TypeScript 確保型別安全
- 遵循 React Hooks 最佳實踐
- 元件採用函數式元件寫法
- 使用 Tailwind CSS 進行樣式設計

### 主要檔案說明

- **`App.tsx`**: 主應用元件，包含所有業務邏輯與狀態管理
- **`services/geminiService.ts`**: Gemini API 服務層，處理所有 AI 分析請求
- **`contexts/ApiKeyContext.tsx`**: API Key 狀態管理 Context
- **`types.ts`**: 所有 TypeScript 型別定義

### 新增功能

如需新增功能，建議遵循以下結構：

1. 在 `types.ts` 中定義相關型別
2. 在 `services/` 中新增服務函數
3. 在 `App.tsx` 中整合新功能
4. 更新相關 UI 元件

---

## 📊 功能詳細說明

### 市場分析功能

**產品核心價值分析**
- 自動提取產品的主要特色
- 識別核心競爭優勢
- 分析產品解決的用戶痛點

**目標市場定位**
- 文化洞察分析
- 消費習慣研究
- 語言特性識別
- 搜尋趨勢分析

**競爭對手分析**
- 自動識別主要競爭對手（3個）
- 分析行銷策略
- 評估優勢與劣勢

**買家人物誌**
- 建立 3 個詳細的買家畫像
- 包含基本資料、興趣、痛點
- 提供搜尋關鍵字建議

### 內容策略功能

**內容主題生成**
- 3 個非銷售性質內容主題
- 每個主題包含標題、描述
- 主要關鍵字與長尾關鍵字
- 完整的 SEO 指導方針

**SEO 指導**
- 關鍵字密度建議
- 語意關鍵字列表
- 內部連結策略
- 外部連結策略

**互動元素建議**
- 2-3 個互動元素點子
- 詳細的實作描述

**CTA 文案**
- 3 個自然且具說服力的行動呼籲文案

### AI Studio 提示詞生成

生成的提示詞包含：

- **產品資訊**：名稱、描述、目標市場
- **目標受眾**：買家人物誌詳細資訊
- **關鍵訊息**：產品特色、優勢、痛點解決方案
- **SEO 要求**：關鍵字、長尾關鍵字、語意關鍵字
- **頁面結構**：Header、Hero、痛點、解決方案、見證、CTA
- **設計規範**：色彩、字體、動畫效果
- **技術規格**：React、Tailwind CSS、響應式設計

---

## 🐛 常見問題

### Q: API Key 安全嗎？

A: 是的，API Key 僅儲存在您的瀏覽器 localStorage 中，不會上傳至任何伺服器。您可以隨時清除或更換 API Key。

### Q: 支援哪些圖片格式？

A: 支援常見的圖片格式：PNG、JPG、JPEG、GIF、WebP。

### Q: 分析報告可以匯出嗎？

A: 可以，市場分析報告和內容策略都可以下載為 Markdown 格式檔案。

### Q: 生成的提示詞可以在哪些平台使用？

A: 生成的 AI Studio 提示詞適用於 Google AI Studio、Claude、ChatGPT 等支援程式碼生成的 AI 工具。

### Q: 需要網路連線嗎？

A: 是的，本應用程式需要網路連線以呼叫 Google Gemini API。

---

## 📝 更新日誌

### v1.0.0 (2025-01)

- ✨ 初始版本發布
- 🎯 三階段智能分析流程
- 🔐 API Key Context 管理機制
- 📊 完整的市場分析功能
- 📝 內容策略生成功能
- 🤖 AI Studio 提示詞生成
- 📥 Markdown 報告下載功能
- 🖼️ 產品圖片分析支援

---

## 🤝 貢獻指南

歡迎提交 Issue 或 Pull Request！

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📄 授權資訊

本專案採用 MIT 授權條款。

---

## 🔗 相關連結

- [Google Gemini API 文件](https://ai.google.dev/docs)
- [React 官方文件](https://react.dev/)
- [Tailwind CSS 文件](https://tailwindcss.com/docs)
- [Vite 文件](https://vitejs.dev/)

---

## 👏 致謝

- [Google Gemini](https://ai.google.dev/) - 提供強大的 AI 分析能力
- [React](https://react.dev/) - 優秀的 UI 框架
- [Tailwind CSS](https://tailwindcss.com/) - 實用的 CSS 框架
- [Vite](https://vitejs.dev/) - 快速的建置工具

---

## 💬 技術支援與討論

如有任何問題、建議或需要技術支援，歡迎加入 FlyPig 專屬 LINE 群組：

👉 **加入 FlyPig LINE 群組** [https://line.me/R/ti/g/@icareuec](https://line.me/R/ti/g/@icareuec)

我們會在這裡提供：

- 技術支援與問題解答
- 功能更新與使用教學
- 社群討論與經驗分享
- 最新功能預覽與測試

---

## 🔗 推薦同步參考

如果您對 AI 電商行銷工具感興趣，歡迎同步參考以下相關專案：

- **[AI-PM-Designer-Pro](https://github.com/mkhsu2002/AI-PM-Designer-Pro)** - AI 電商商品圖文生成工具，從產品圖自動生成完整行銷素材包
- **[AI_Digital_Portrait_Studio](https://github.com/mkhsu2002/AI_Digital_Portrait_Studio)** - 專為電商設計 AI 人像圖片生成工具

---

## ☕ 請我喝杯咖啡

如果這個專案對您有幫助，歡迎請我喝杯咖啡：

👉 **Buy me a coffee** [https://buymeacoffee.com/mkhsu2002w](https://buymeacoffee.com/mkhsu2002w)

您的支持是我持續開發的動力！

---

## 👉 商業部署及客製需求

若需協助委外部署或客製化選項開發（例如新增場景、人物姿態），歡迎聯絡 FlyPig AI：

- **Email**: flypig@icareu.tw
- **LINE ID**: icareuec

---

## 📄 License

**MIT License**

Open sourced by [FlyPig AI](https://flypigai.icareu.tw/)

Copyright (c) 2025 AI EC SEO Booster

---

<div align="center">

**⭐ 如果這個專案對您有幫助，請給我們一個 Star！**

Made with ❤️ by FlyPig AI

</div>

