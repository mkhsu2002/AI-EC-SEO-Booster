# 電商SEO加速器 v1.0

AI 驅動的智能電商市場分析與 SEO 內容策略生成工具，透過 Google Gemini API 提供專業的市場洞察、競爭分析、買家人物誌描繪，並自動生成 SEO 優化的內容策略與前導頁提示詞。

## ✨ 主要功能

### 🚀 全方位市場深度透視

- **智慧產品分析**：只需提供產品資訊，AI 就能自動拆解其核心賣點，更可上傳圖片進行視覺分析
- **精準市場定位**：深入剖析目標市場的文化、消費習慣和熱門趨勢
- **競爭格局掃描**：自動識別主要競爭對手，並透視其行銷策略與優劣勢
- **清晰用戶畫像**：為您描繪出最真實的潛在客戶樣貌 (Buyer Persona)，包含興趣、痛點與搜尋關鍵字

### ✍️ 自動化內容與 SEO 策略規劃

- **高價值內容主題生成**：AI 自動規劃最能吸引目標客群的內容主題
- **專業 SEO 佈局建議**：為每個主題提供完整的 SEO 策略，協助網站獲得更高排名
- **高轉換率文案點子**：提供多組具說服力的行動呼籲 (CTA) 文案

### 💻 一鍵生成前導頁提示詞

- **AI Studio 前導頁程式碼生成**：一鍵生成專業提示詞，讓 AI 程式碼助理（如 Google AI Studio）在幾秒內產出高品質的 React 前導頁程式碼

## 🛠️ 技術棧

- **前端框架**: React 19 + TypeScript
- **CSS 框架**: Tailwind CSS
- **AI 服務**: Google Gemini API (@google/genai)
- **狀態管理**: React Context API
- **建置工具**: Vite
- **部署平台**: GitHub Pages / Cloudflare Pages

## 📦 安裝與使用

### 前置需求

- Node.js 20 或更高版本
- npm 或 yarn
- Google Gemini API Key（[免費申請](https://makersuite.google.com/app/apikey)）

### 安裝步驟

```bash
# 複製專案
git clone https://github.com/mkhsu2002/AI-EC-SEO-Booster.git

# 進入專案目錄
cd AI-EC-SEO-Booster

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

### 取得 API Key

1. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登入您的 Google 帳號
3. 點擊「Create API Key」建立新的 API Key
4. 複製 API Key 並貼到應用程式的設定中

### 使用方式

1. 首次使用時，應用程式會自動彈出 API Key 設定視窗
2. 輸入您的 Gemini API Key 並點擊「開始使用」
3. 之後即可正常使用所有功能
4. 如需更換 API Key，點擊右上角的「API 設定」按鈕

### 注意事項

- API Key 請妥善保管，不要分享給他人
- API Key 只會儲存在瀏覽器的本地儲存中，不會上傳至伺服器
- 建議定期檢查 API 使用量，避免超出配額
- 如遇到 API 錯誤，請檢查 API Key 是否正確或是否已啟用相關服務

## 🚀 部署指南

### GitHub Pages 部署

本專案已配置 GitHub Actions 自動部署，每次推送到 `main` 分支會自動部署到 GitHub Pages。

1. 進入 GitHub 儲存庫的 **Settings** > **Pages**
2. 在 **Build and deployment** > **Source** 選項中，選擇 **GitHub Actions**
3. 推送程式碼更新，等待 Actions 跑完，您的網站就會正常顯示

### Cloudflare Pages 部署

1. 登入 Cloudflare Dashboard
2. 前往 **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
3. 選擇您的 GitHub 帳號並授權，選擇要部署的儲存庫
4. 設定建置配置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. 點擊 **Save and Deploy**，Cloudflare 會自動開始建置和部署

## 💬 技術支援與討論

加入 [FlyPig LINE 群組](https://line.me/R/ti/g/@icareuec)

我們會在這裡提供：

- 技術支援與問題解答
- 功能更新與使用教學
- 社群討論與經驗分享
- 最新功能預覽與測試

## 🔗 推薦同步參考

如果您對 AI 智能電商工具感興趣，歡迎同步參考以下相關專案：

- **AI-PM-Designer-Pro** - AI 視覺行銷生產力工具，基於 Google Gemini 2.5 Flash 與 Gemini 3 Pro Image，從產品圖自動生成完整行銷素材包

  https://github.com/mkhsu2002/AI-PM-Designer-Pro

- **AI Digital Portrait Studio** - 專為電商設計AI人像圖片生成工具，免去繁複的手動輸入提示詞，整合 Gemini 影像模型與 Firebase，一鍵生成多視角專業人像商品圖，支援自訂風格、背景、姿態等參數。

  https://github.com/mkhsu2002/AI_Digital_Portrait_Studio

## ☕ 請我喝杯咖啡

如果這個專案對您有幫助，歡迎請我喝杯咖啡：

👉 [Buy me a coffee](https://buymeacoffee.com/mkhsu2002w)

您的支持是我持續開發的動力！

若需協助委外部署或客製化選項開發（例如新增場景、人物姿態），歡迎聯絡 FlyPig AI  
Email: flypig@icareu.tw / LINE ID: icareuec

## 📝 授權條款

本專案採用 MIT 授權。您可以自由使用、修改與自建部署。

Open sourced by [FlyPig AI](https://flypigai.icareu.tw/)

詳見授權全文：LICENSE

