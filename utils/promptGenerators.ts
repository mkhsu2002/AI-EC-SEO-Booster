/**
 * 提示詞生成邏輯提取檔案
 * 
 * 此檔案展示了從 App.tsx 中提取的提示詞生成邏輯
 * 供檢視和討論使用，尚未整合到專案中
 */

import type { ProductInfo, AnalysisResult, ContentStrategy, ContentTopic } from './types';

// ============================================================================
// 輔助函數：格式化買家人設資訊
// ============================================================================

/**
 * 格式化買家人設資訊（用於 Gamma 提示詞）
 */
const formatPersonaDetailsForGamma = (buyerPersonas: AnalysisResult['buyerPersonas']): string => {
  return buyerPersonas.map(p => 
    `- **${p.personaName} (${p.demographics}):**\n   - **興趣:** ${p.interests.join('、')}\n   - **痛點:** ${p.painPoints.join('、')}\n   - **搜尋關鍵字:** ${p.keywords.join('、')}`
  ).join('\n\n');
};

/**
 * 格式化買家人設資訊（用於 AI Studio 提示詞）
 */
const formatPersonaDetailsForAIStudio = (buyerPersonas: AnalysisResult['buyerPersonas']): string => {
  return buyerPersonas.map(p => 
    `- ${p.personaName} (${p.demographics}): 興趣包括 ${p.interests.join('、')}，面臨的痛點是 ${p.painPoints.join('、')}`
  ).join('\n');
};

// ============================================================================
// Gamma 提示詞生成
// ============================================================================

/**
 * 生成 Gamma.app 提示詞
 * 
 * @param productInfo - 產品資訊
 * @param analysisResult - 市場分析結果
 * @param topic - 內容主題
 * @param contentStrategy - 內容策略
 * @returns Gamma 提示詞字串
 */
export const generateGammaPrompt = (
  productInfo: ProductInfo,
  analysisResult: AnalysisResult,
  topic: ContentTopic,
  contentStrategy: ContentStrategy
): string => {
  const personaDetails = formatPersonaDetailsForGamma(analysisResult.buyerPersonas);
  
  const competitorNote = analysisResult.competitorAnalysis.length > 0
    ? `可以簡短提及與市場上其他方案（例如 ${analysisResult.competitorAnalysis[0].brandName}）的不同之處，突顯我們的獨特性。`
    : '強調產品的獨特價值與競爭優勢。';

  return `你是一位專業的內容策略師和簡報設計專家，專精於使用 Gamma.app 建立高品質的產品行銷簡報。

**任務目標：**
根據以下詳細的市場分析，為產品「${productInfo.name}」創建一篇具吸引力、SEO 優化的專業前導頁簡報內容，適用於 Gamma.app 平台。

---

**1. 文章主標題（請直接使用）：**
"${topic.topic}"

---

**2. 核心推廣產品資訊：**
- **產品名稱：** ${productInfo.name}
- **產品描述：** ${productInfo.description}
- **產品參考連結（用於連結與內容參考）：** ${productInfo.url || '無'}

---

**3. 目標受眾深度剖析（請以此為基礎進行撰寫）：**
您正在為以下這些人物撰寫，請直接解決他們的需求與痛點：
${personaDetails}

---

**4. 關鍵訊息與價值主張（文章必須強調）：**
- **主要特色：** ${analysisResult.productCoreValue.mainFeatures.join('；')}
- **核心優勢（獨特賣點）：** ${analysisResult.productCoreValue.coreAdvantages.join('；')}
- **解決的痛點：** ${analysisResult.productCoreValue.painPointsSolved.join('；')}

---

**5. 內容與 SEO 要求：**
- **主要關鍵字（Focus Keyword）：** \`${topic.focusKeyword}\`（請確保在標題、副標題和內文中自然地出現）
- **長尾關鍵字（Long-tail Keywords）：** 請在文章中自然地融入以下詞組：${topic.longTailKeywords.join('、')}
- **語意關鍵字（Semantic Keywords）：** 為了建立主題權威，請使用相關概念詞：${topic.seoGuidance.semanticKeywords.join('、')}
- **建議文章結構：**
  1. **開頭：** 使用一個引人入勝的引言，提及目標受眾的一個共同痛點，引起共鳴。
  2. **發展：** 詳細闡述該問題，讓讀者感覺「你懂我」。
  3. **解決方案：** 順勢引出「${productInfo.name}」作為理想的解決方案。自然地介紹其特色與優勢如何解決前述痛點。
  4. **差異化：** ${competitorNote}
  5. **結尾：** 用一個強而有力的總結收尾，並搭配明確的行動呼籲 (CTA)。
- **寫作語氣：** 針對 **${productInfo.market}** 市場，語氣應專業、具說服力，並對用戶的問題表示同理心。參考語言特性：${analysisResult.marketPositioning.languageNuances}。

---

**6. 行動呼籲（Call to Action - CTA）：**
請在文章結尾處，自然地整合以下至少一個 CTA 文案：
${contentStrategy.ctaSuggestions.map(cta => `- "${cta}"`).join('\n')}

---

**7. Gamma.app 格式要求：**
- 使用 Markdown 格式撰寫內容
- 確保內容結構清晰，適合轉換為簡報格式
- 每個段落應該能夠獨立成為一個簡報頁面
- 使用適當的標題層級（# 主標題、## 副標題、### 小標題）
- 加入適當的列表和重點標記
- 內容長度建議在 800-1200 字之間

---

**8. 市場定位資訊：**
- **目標市場：** ${productInfo.market}
- **文化洞察：** ${analysisResult.marketPositioning.culturalInsights}
- **消費習慣：** ${analysisResult.marketPositioning.consumerHabits}
- **語言特性：** ${analysisResult.marketPositioning.languageNuances}
- **搜尋趨勢：** ${analysisResult.marketPositioning.searchTrends.join('、')}

---

**開始生成內容：**
請現在生成完整的 Gamma.app 簡報內容，使用 Markdown 格式，確保內容專業、吸引人且符合 SEO 最佳實踐。`.trim();
};

// ============================================================================
// AI Studio 提示詞生成
// ============================================================================

/**
 * 生成 AI Studio 提示詞
 * 
 * @param productInfo - 產品資訊
 * @param analysisResult - 市場分析結果
 * @param topic - 內容主題
 * @param contentStrategy - 內容策略
 * @returns AI Studio 提示詞字串
 */
export const generateAIStudioPrompt = (
  productInfo: ProductInfo,
  analysisResult: AnalysisResult,
  topic: ContentTopic,
  contentStrategy: ContentStrategy
): string => {
  const personaDetails = formatPersonaDetailsForAIStudio(analysisResult.buyerPersonas);
  
  const painPointsList = analysisResult.productCoreValue.painPointsSolved
    .map(p => `     - ${p}`)
    .join('\n');
  
  const mainFeaturesList = analysisResult.productCoreValue.mainFeatures
    .map(f => `     - ${f}`)
    .join('\n');
  
  const coreAdvantagesList = analysisResult.productCoreValue.coreAdvantages
    .map(a => `     - ${a}`)
    .join('\n');
  
  const testimonialsList = analysisResult.buyerPersonas.slice(0, 3)
    .map((p, i) => `     ${i + 1}. ${p.personaName} (${p.demographics})：撰寫一段符合此人物特色的見證文字`)
    .join('\n');
  
  const ctaList = contentStrategy.ctaSuggestions
    .map(cta => `     - "${cta}"`)
    .join('\n');

  return `你是一位專業的前端開發工程師，專精於使用 React 和 Tailwind CSS 建立高轉換率的前導頁。

**任務目標：**
為產品「${productInfo.name}」建立一個完整、可直接運行的 React 前導頁 HTML 檔案。這個前導頁必須具備高轉換率、專業設計，並完全符合 SEO 最佳實踐。

**重要：請生成完整的 HTML 檔案，包含以下結構：**

\`\`\`html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${productInfo.name} - ${topic.topic}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@19.1.1",
        "react-dom/client": "https://esm.sh/react-dom@19.1.1/client"
      }
    }
    </script>
</head>
<body class="bg-slate-900 text-slate-50">
    <div id="root"></div>
    <script type="module">
        // 請在這裡生成完整的 React 程式碼
    </script>
</body>
</html>
\`\`\`

**React 程式碼要求（必須嚴格遵守）：**

1. **導入語句（必須使用以下格式）：**
\`\`\`javascript
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
\`\`\`
   ⚠️ 注意：不要使用 \`ReactDOM.createRoot\`，必須使用 \`createRoot\` 從 \`react-dom/client\` 導入

2. **元件結構：**
   - 建立一個名為 \`App\` 的函數式元件
   - 使用 \`export default\` 或直接定義函數
   - 所有 JSX 內容都應該在 App 元件內返回

3. **渲染方式（必須使用以下格式）：**
\`\`\`javascript
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
const root = createRoot(rootElement);
root.render(<App />);
\`\`\`
   ⚠️ 注意：必須檢查 root 元素是否存在，避免運行時錯誤

4. **設計規範：**
   - 使用 Tailwind CSS 進行樣式設計，確保所有樣式都透過 Tailwind 類別實現
   - 色彩配置：主色 #3b82f6 (blue-500)，次要色 #8b5cf6 (violet-500)，背景 #1e293b (slate-800)，文字 #f8fafc (slate-50)
   - 必須完全響應式設計（支援手機、平板、桌面），使用 Tailwind 的響應式前綴（sm:, md:, lg:）
   - 加入適當的動畫效果（如 fade-in、hover 效果、smooth transitions）
   - 使用高品質圖片：\`https://picsum.photos/seed/${encodeURIComponent(productInfo.name)}/800/600\`
   - 確保所有互動元素（按鈕、連結）都有清晰的視覺回饋
   - 使用適當的間距和留白，提升閱讀體驗

5. **頁面結構（必須包含以下區塊，按順序）：**
   
   **a) Header（頁首）：**
   - 顯示產品名稱：「${productInfo.name}」
   - 包含一個主要的 CTA 按鈕，文字使用：「${contentStrategy.ctaSuggestions[0] || '立即探索'}」
   
   **b) Hero Section（主視覺區）：**
   - 主標題：「${topic.topic}」
   - 副標題：簡短有力的描述，說明產品如何解決問題
   - 一張吸引人的產品相關圖片
   - 一個醒目的 CTA 按鈕
   
   **c) Pain Points Section（痛點區）：**
   - 標題：「是否這就是您遇到的困擾？」
   - 列出以下痛點（每個痛點一個項目）：
${painPointsList}
   - 使用圖示或視覺元素增強效果
   
   **d) Solution/Features Section（解決方案/特色區）：**
   - 標題：「${productInfo.name} 為您提供完美解決方案」
   - 產品描述：${productInfo.description}
   - 主要特色（每個特色一個卡片或區塊）：
${mainFeaturesList}
   - 核心優勢（突出顯示）：
${coreAdvantagesList}
   
   **e) Testimonials Section（見證區）：**
   - 標題：「使用者真實見證」
   - 建立 2-3 個見證卡片，每個代表一個買家人設：
${testimonialsList}
   
   **f) Final CTA Section（最終行動呼籲區）：**
   - 強而有力的標題
   - 使用以下其中一個 CTA 文案：
${ctaList}
   - 大型、醒目的按鈕
   - 如果產品有網址，按鈕應連結到：${productInfo.url || '#'}

6. **SEO 優化要求：**
   - **Meta 標籤：** 在 <head> 中加入完整的 SEO meta 標籤
     - description: 包含主要關鍵字和產品核心價值（150-160 字元）
     - keywords: 包含主要關鍵字、長尾關鍵字和語意關鍵字
     - og:title, og:description, og:image（Open Graph 標籤）
   - **結構化資料：** 考慮加入 JSON-LD 結構化資料（Product schema）
   - **主標題（H1）：** 必須包含主要關鍵字：「${topic.focusKeyword}」，且只能有一個 H1
   - **副標題（H2-H3）：** 適當地使用標題層級，自然地融入長尾關鍵字
   - **內容優化：**
     - 在內容中自然地融入以下長尾關鍵字：${topic.longTailKeywords.join('、')}
     - 使用語意相關關鍵字：${topic.seoGuidance.semanticKeywords.join('、')}
     - 關鍵字密度約 ${topic.seoGuidance.keywordDensity}
     - 確保關鍵字自然出現，不要過度堆砌
   - **內部連結：** ${topic.seoGuidance.linkingStrategy.internal}
   - **外部連結：** ${topic.seoGuidance.linkingStrategy.external}

7. **目標受眾資訊（用於撰寫內容）：**
${personaDetails}

8. **市場定位資訊：**
   - 目標市場：${productInfo.market}
   - 文化洞察：${analysisResult.marketPositioning.culturalInsights}
   - 消費習慣：${analysisResult.marketPositioning.consumerHabits}
   - 語言特性：${analysisResult.marketPositioning.languageNuances}

**程式碼品質要求：**
- ✅ 程式碼必須可以直接運行，無語法錯誤
- ✅ 使用現代 React 語法（函數式元件、Hooks）
- ✅ 確保所有變數都有適當的命名（使用有意義的變數名）
- ✅ 加入適當的註解說明重要區塊和複雜邏輯
- ✅ 確保圖片 URL 正確且可訪問（使用 https://picsum.photos，並包含 alt 屬性）
- ✅ 所有文字內容使用繁體中文
- ✅ 確保所有 JSX 標籤正確閉合
- ✅ 確保所有字串使用正確的引號（單引號或雙引號，保持一致）
- ✅ 避免使用未定義的變數或函數
- ✅ 確保所有事件處理函數都有適當的錯誤處理
- ✅ 使用語義化 HTML 標籤（如 <header>, <main>, <section>, <article>, <footer>）
- ✅ 確保無障礙設計（適當的 aria-label、role 等屬性）

**常見錯誤避免：**
- ❌ 不要使用 \`ReactDOM.render\`（已棄用）
- ❌ 不要使用 \`ReactDOM.createRoot\`（應從 react-dom/client 導入 createRoot）
- ❌ 不要在 JSX 中使用未導入的元件
- ❌ 不要忘記檢查 root 元素是否存在
- ❌ 不要在 JSX 中直接使用未定義的變數

**輸出格式要求：**
1. 必須輸出完整的 HTML 檔案
2. 從 <!DOCTYPE html> 開始，到 </html> 結束
3. 在 <script type="module"> 標籤內包含完整的 React 程式碼
4. 程式碼必須可以直接複製貼上到瀏覽器或 AI Studio 中運行
5. 不要只輸出部分程式碼，必須是完整的、可運行的檔案

**開始生成程式碼：**
請現在生成完整的 HTML 檔案，確保程式碼可以直接運行。`.trim();
};

// ============================================================================
// 批量提示詞生成（用於下載所有提示詞）
// ============================================================================

/**
 * 生成所有提示詞的 Markdown 文件內容
 * 
 * @param productInfo - 產品資訊
 * @param analysisResult - 市場分析結果
 * @param contentStrategy - 內容策略
 * @returns Markdown 格式的所有提示詞內容
 */
export const generateAllPromptsMarkdown = (
  productInfo: ProductInfo,
  analysisResult: AnalysisResult,
  contentStrategy: ContentStrategy
): string => {
  let allPrompts = `# ${productInfo.name} - 完整前導頁提示詞集合\n\n`;
  allPrompts += `**生成日期：** ${new Date().toLocaleString('zh-TW')}\n\n`;
  allPrompts += `**產品資訊：**\n`;
  allPrompts += `- 產品名稱：${productInfo.name}\n`;
  if (productInfo.url) {
    allPrompts += `- 產品連結：${productInfo.url}\n`;
  }
  allPrompts += `- 目標市場：${productInfo.market}\n\n`;
  allPrompts += `---\n\n`;

  contentStrategy.contentTopics.forEach((topic, index) => {
    allPrompts += `## 主題 ${index + 1}：${topic.topic}\n\n`;
    
    // AI Studio 提示詞
    allPrompts += `### AI Studio 提示詞\n\n`;
    allPrompts += `\`\`\`\n${generateAIStudioPrompt(productInfo, analysisResult, topic, contentStrategy)}\n\`\`\`\n\n`;
    allPrompts += `---\n\n`;
    
    // Gamma 提示詞
    allPrompts += `### Gamma 提示詞\n\n`;
    allPrompts += `\`\`\`\n${generateGammaPrompt(productInfo, analysisResult, topic, contentStrategy)}\n\`\`\`\n\n`;
    allPrompts += `---\n\n`;
  });

  return allPrompts;
};

// ============================================================================
// 使用範例（供參考，不會實際執行）
// ============================================================================

/*
// 在 App.tsx 中的使用方式：

import { generateGammaPrompt, generateAIStudioPrompt, generateAllPromptsMarkdown } from './utils/promptTemplates';

// 1. 生成 Gamma 提示詞
const handleGenerateGammaPrompt = useCallback((topic: ContentTopic) => {
  if (!productInfo || !analysisResult || !contentStrategy) return;
  
  const prompt = generateGammaPrompt(productInfo, analysisResult, topic, contentStrategy);
  setPromptModalTitle('Gamma 生成提示詞');
  setPromptModalContent(prompt);
}, [productInfo, analysisResult, contentStrategy]);

// 2. 生成 AI Studio 提示詞
const handleGenerateAIStudioPrompt = useCallback((topic: ContentTopic) => {
  if (!productInfo || !analysisResult || !contentStrategy) return;
  
  const prompt = generateAIStudioPrompt(productInfo, analysisResult, topic, contentStrategy);
  setPromptModalTitle('AI Studio 生成提示詞');
  setPromptModalContent(prompt);
}, [productInfo, analysisResult, contentStrategy]);

// 3. 下載所有提示詞
const handleDownloadAllPrompts = useCallback(() => {
  if (!productInfo || !analysisResult || !contentStrategy) return;
  
  const markdownContent = generateAllPromptsMarkdown(productInfo, analysisResult, contentStrategy);
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
*/


