/**
 * 圖片生成系統提示詞
 * 
 * 集中管理所有圖片生成相關的系統提示詞
 */

/**
 * 繁體中文渲染系統提示詞
 * 用於確保生成的圖片中的文字使用繁體中文
 */
export const TRADITIONAL_CHINESE_RENDERING_PROMPT = `
【重要指示 - 圖片生成要求】
1. 所有文字內容必須使用繁體中文（Traditional Chinese）渲染
2. 確保所有文字清晰可讀，字體大小適中
3. 文字排版要符合繁體中文的閱讀習慣（由上而下、由右而左或由左而右）
4. 如果提示詞中包含中文，生成的圖片中的文字必須是繁體中文
5. 保持文字與背景的對比度，確保可讀性
6. 字體選擇應適合繁體中文顯示，避免使用不支援繁體中文的字體
7. 確保繁體中文字符完整顯示，不會出現亂碼或簡體字
`;

/**
 * 增強提示詞，確保使用繁體中文渲染
 * @param originalPrompt 原始提示詞
 * @returns 增強後的提示詞
 */
export const enhancePromptForTraditionalChinese = (originalPrompt: string): string => {
  return `${TRADITIONAL_CHINESE_RENDERING_PROMPT}

【原始提示詞】
${originalPrompt}
`.trim();
};

/**
 * 參考圖片分析提示詞
 */
export const REFERENCE_IMAGE_ANALYSIS_PROMPT = `請分析這張參考圖片的視覺風格、色彩搭配、構圖方式和設計元素。然後用繁體中文描述這些特徵，這些資訊將用於生成類似風格的海報圖片。`;

