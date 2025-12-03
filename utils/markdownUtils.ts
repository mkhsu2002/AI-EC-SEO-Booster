/**
 * Markdown 生成工具函數
 */
import type { ProductInfo, AnalysisResult, ContentStrategy, PosterProposals } from '../types';

/**
 * 生成市場分析報告的 Markdown 內容
 */
export const generateAnalysisReport = (
  productInfo: ProductInfo,
  result: AnalysisResult
): string => {
  const { productCoreValue, marketPositioning, competitorAnalysis, buyerPersonas } = result;
  
  let report = `# ${productInfo.name} - 市場分析報告\n\n`;
  
  if (productInfo.url) {
    report += `**產品連結:** [${productInfo.url}](${productInfo.url})\n\n`;
  }

  report += `## 產品核心價值\n\n`;
  report += `### 主要特色\n${productCoreValue.mainFeatures.map(f => `- ${f}`).join('\n')}\n\n`;
  report += `### 核心優勢\n${productCoreValue.coreAdvantages.map(a => `- ${a}`).join('\n')}\n\n`;
  report += `### 解決的痛點\n${productCoreValue.painPointsSolved.map(p => `- ${p}`).join('\n')}\n\n`;

  report += `## 目標市場定位\n\n`;
  report += `**文化洞察:** ${marketPositioning.culturalInsights}\n\n`;
  report += `**消費習慣:** ${marketPositioning.consumerHabits}\n\n`;
  report += `**語言特性:** ${marketPositioning.languageNuances}\n\n`;
  report += `**搜尋趨勢:**\n${marketPositioning.searchTrends.map(t => `- \`${t}\``).join('\n')}\n\n`;

  report += `## 競爭對手分析\n\n`;
  competitorAnalysis.forEach(c => {
    report += `### ${c.brandName}\n`;
    report += `**行銷策略:** ${c.marketingStrategy}\n\n`;
    report += `**優勢:**\n${c.strengths.map(s => `  - ${s}`).join('\n')}\n\n`;
    report += `**劣勢:**\n${c.weaknesses.map(w => `  - ${w}`).join('\n')}\n\n`;
  });

  report += `## 潛在客戶描繪\n\n`;
  buyerPersonas.forEach(p => {
    report += `### ${p.personaName}\n`;
    report += `**基本資料:** ${p.demographics}\n\n`;
    report += `**興趣:** ${p.interests.join(', ')}\n\n`;
    report += `**痛點:**\n${p.painPoints.map(pp => `  - ${pp}`).join('\n')}\n\n`;
    report += `**他們會搜尋的關鍵字:**\n${p.keywords.map(k => `- \`${k}\``).join('\n')}\n\n`;
  });

  return report;
};

/**
 * 生成內容策略報告的 Markdown 內容
 */
export const generateStrategyReport = (
  productInfo: ProductInfo,
  strategy: ContentStrategy
): string => {
  let report = `# ${productInfo.name} - 內容與互動策略\n\n`;
  
  report += "## 內容主題\n\n";
  strategy.contentTopics.forEach(topic => {
    report += `### 主題: ${topic.topic}\n`;
    report += `**描述:** ${topic.description}\n`;
    report += `**主要關鍵字:** \`${topic.focusKeyword}\`\n`;
    report += `**長尾關鍵字:** ${topic.longTailKeywords.map(k => `\`${k}\``).join(', ')}\n`;
    report += `**SEO 指導:**\n`;
    report += `  - **關鍵字密度:** ${topic.seoGuidance.keywordDensity}\n`;
    report += `  - **語意關鍵字:** ${topic.seoGuidance.semanticKeywords.join(', ')}\n`;
    report += `  - **內部連結策略:** ${topic.seoGuidance.linkingStrategy.internal}\n`;
    report += `  - **外部連結策略:** ${topic.seoGuidance.linkingStrategy.external}\n\n`;
  });

  report += "## 互動元素建議\n\n";
  strategy.interactiveElements.forEach(el => {
    report += `### ${el.type}\n`;
    report += `${el.description}\n\n`;
  });

  report += "## 行動呼籲 (CTA) 文案建議\n\n";
  strategy.ctaSuggestions.forEach(cta => {
    report += `- "${cta}"\n`;
  });

  return report;
};

/**
 * 生成海報提案報告的 Markdown 內容
 */
export const generatePosterProposalsReport = (
  productInfo: ProductInfo,
  posterProposals: PosterProposals
): string => {
  let report = `# ${productInfo.name} - 商品海報提案報告\n\n`;
  report += `**生成時間:** ${new Date().toLocaleString('zh-TW')}\n\n`;
  report += `---\n\n`;

  posterProposals.proposals.forEach((proposal, index) => {
    report += `## 提案 ${index + 1}：${proposal.title}\n\n`;
    report += `### 設計理念\n${proposal.description}\n\n`;
    report += `### 設計概念\n${proposal.designConcept}\n\n`;
    report += `### 色彩方案\n${proposal.colorScheme}\n\n`;
    report += `### 關鍵視覺元素\n`;
    proposal.keyVisualElements.forEach((element, i) => {
      report += `${i + 1}. ${element}\n`;
    });
    report += `\n### 文字內容\n${proposal.textContent}\n\n`;
    report += `### 圖片生成提示詞\n\`\`\`\n${proposal.prompt}\n\`\`\`\n\n`;
    report += `---\n\n`;
  });

  report += `## 使用說明\n\n`;
  report += `1. 每個提案都包含完整的設計概念、色彩方案、視覺元素和圖片生成提示詞\n`;
  report += `2. 您可以選擇不同的尺寸（正方形、直式、手機直式、橫式）\n`;
  report += `3. 可以上傳參考圖片來增強生成效果\n`;
  report += `4. 使用提供的提示詞在圖片生成工具（如 DALL-E、Midjourney、Stable Diffusion）中生成海報圖片\n\n`;

  return report;
};

/**
 * 下載 Markdown 內容為檔案
 */
export const downloadMarkdown = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

