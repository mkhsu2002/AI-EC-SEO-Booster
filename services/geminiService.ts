import { GoogleGenAI, Type } from "@google/genai";
import type { ProductInfo, AnalysisResult, ContentStrategy, PosterProposals } from '../types';

let aiInstance: GoogleGenAI | null = null;

const getAIInstance = (apiKey: string): GoogleGenAI => {
  if (!aiInstance || aiInstance.apiKey !== apiKey) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    productCoreValue: {
      type: Type.OBJECT,
      properties: {
        mainFeatures: { type: Type.ARRAY, items: { type: Type.STRING, description: "Key feature of the product." } },
        coreAdvantages: { type: Type.ARRAY, items: { type: Type.STRING, description: "Unique selling proposition or advantage." } },
        painPointsSolved: { type: Type.ARRAY, items: { type: Type.STRING, description: "A specific user problem this product solves." } },
      },
      required: ["mainFeatures", "coreAdvantages", "painPointsSolved"]
    },
    marketPositioning: {
      type: Type.OBJECT,
      properties: {
        culturalInsights: { type: Type.STRING, description: "Cultural factors in the target market relevant to the product." },
        consumerHabits: { type: Type.STRING, description: "Typical buying behaviors and preferences of consumers in the market." },
        languageNuances: { type: Type.STRING, description: "Specific language or slang used by the target audience." },
        searchTrends: { type: Type.ARRAY, items: { type: Type.STRING, description: "A popular search trend or keyword phrase." } },
      },
      required: ["culturalInsights", "consumerHabits", "languageNuances", "searchTrends"]
    },
    competitorAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          brandName: { type: Type.STRING },
          marketingStrategy: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["brandName", "marketingStrategy", "strengths", "weaknesses"]
      }
    },
    buyerPersonas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          personaName: { type: Type.STRING },
          demographics: { type: Type.STRING },
          interests: { type: Type.ARRAY, items: { type: Type.STRING } },
          painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["personaName", "demographics", "interests", "painPoints", "keywords"]
      }
    }
  },
  required: ["productCoreValue", "marketPositioning", "competitorAnalysis", "buyerPersonas"]
};

const contentStrategySchema = {
    type: Type.OBJECT,
    properties: {
        contentTopics: {
            type: Type.ARRAY,
            description: "A list of engaging, non-promotional content topics.",
            items: {
                type: Type.OBJECT,
                properties: {
                    topic: { type: Type.STRING, description: "The catchy headline or title of the content piece." },
                    description: { type: Type.STRING, description: "A brief explanation of what the content will cover and why it's valuable to the audience." },
                    focusKeyword: { type: Type.STRING, description: "The primary SEO keyword for this topic." },
                    longTailKeywords: { type: Type.ARRAY, items: { type: Type.STRING, description: "A related long-tail keyword." } },
                    seoGuidance: {
                        type: Type.OBJECT,
                        properties: {
                            keywordDensity: { type: Type.STRING, description: "Suggested keyword density for the focus keyword, e.g., '1-2%'." },
                            semanticKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of LSI or semantically related keywords." },
                            linkingStrategy: {
                                type: Type.OBJECT,
                                properties: {
                                    internal: { type: Type.STRING, description: "Advice on internal linking." },
                                    external: { type: Type.STRING, description: "Advice on external linking." }
                                },
                                required: ["internal", "external"]
                            }
                        },
                        required: ["keywordDensity", "semanticKeywords", "linkingStrategy"]
                    }
                },
                required: ["topic", "description", "focusKeyword", "longTailKeywords", "seoGuidance"]
            }
        },
        interactiveElements: {
            type: Type.ARRAY,
            description: "A list of ideas for interactive elements to include on the webpage.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "The type of interactive element (e.g., 'Quiz', 'Calculator')." },
                    description: { type: Type.STRING, description: "A detailed description of the interactive element." }
                },
                required: ["type", "description"]
            }
        },
        ctaSuggestions: {
            type: Type.ARRAY,
            description: "A list of natural, non-intrusive call-to-action copy suggestions.",
            items: { type: Type.STRING }
        }
    },
    required: ["contentTopics", "interactiveElements", "ctaSuggestions"]
};


export const analyzeMarket = async (productInfo: ProductInfo, apiKey: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key 未設定，請先設定 Gemini API Key");
  }

  const ai = getAIInstance(apiKey);

  let imageDescription = "No image provided.";
  if (productInfo.image) {
    try {
      const imagePart = {
        inlineData: {
          mimeType: productInfo.image.mimeType,
          data: productInfo.image.base64,
        },
      };
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: "Describe the key visual features of the product in this image for a marketing analysis. Respond in Traditional Chinese." }] },
      });
      imageDescription = result.text;
    } catch (error) {
      console.error("Error analyzing image:", error);
      imageDescription = "無法分析提供的圖片。";
    }
  }

  const prompt = `
    You are a professional market analyst and SEO expert. Based on the following product information and target market, provide a comprehensive market analysis.

    **Product Information:**
    - Name: ${productInfo.name}
    - URL: ${productInfo.url || 'Not provided. Analyze based on description.'}
    - Description & Features: ${productInfo.description}
    - Visual Analysis from Image: ${imageDescription}

    **Target Market:** ${productInfo.market}
    
    **Instructions:**
    If a product URL is provided, use it as the primary source of truth and context for the product's features, branding, and value proposition. Synthesize the information from the URL with the provided description. If you cannot access URLs, use the provided text information and the URL as a strong contextual reference.

    **Task:**
    1.  **Product Core Value:** Distill the main features, core advantages, and the user pain points it solves.
    2.  **Target Market Positioning:** Analyze local culture, consumer habits, language, and search trends for the specified market.
    3.  **Competitor Analysis:** Identify 3 major competitors. Analyze their marketing, strengths, and weaknesses.
    4.  **Buyer Personas:** Create 3 detailed buyer personas, including their demographics, interests, pain points, and keywords they would search for.

    Return the entire analysis in a single, valid JSON object that strictly adheres to the provided schema. Do not include any text or markdown formatting outside of the JSON object. The content within the JSON MUST be in Traditional Chinese (繁體中文).
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonString = result.text.trim();
    try {
        const parsedResult: AnalysisResult = JSON.parse(jsonString);
        return parsedResult;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonString);
        throw new Error("模型回傳的資料格式錯誤，無法解析。請稍後再試。");
    }
  } catch (error) {
    console.error("Error generating market analysis:", error);
    throw new Error("生成市場分析時發生錯誤。請檢查您的網路連線或稍後再試。");
  }
};

export const generateContentStrategy = async (analysisResult: AnalysisResult, apiKey: string): Promise<ContentStrategy> => {
    if (!apiKey) {
        throw new Error("API Key 未設定，請先設定 Gemini API Key");
    }

    const ai = getAIInstance(apiKey);

    const prompt = `
        You are a senior content strategist and SEO expert. Based on the detailed market analysis provided below, create a content and engagement strategy for a webpage.

        **Market Analysis Context:**
        - **Product Core Value:** Main Features: ${analysisResult.productCoreValue.mainFeatures.join(', ')}; Core Advantages: ${analysisResult.productCoreValue.coreAdvantages.join(', ')}; Pain Points Solved: ${analysisResult.productCoreValue.painPointsSolved.join(', ')}.
        - **Target Audience (Personas):** 
            ${analysisResult.buyerPersonas.map(p => `- ${p.personaName} (${p.demographics}): Interested in ${p.interests.join(', ')}. Searches for keywords like: ${p.keywords.join(', ')}.`).join('\n')}

        **Your Task:**
        1.  **Content Topics:** Brainstorm 3 distinct, non-promotional content topics that address the audience's pain points and interests. For each topic, provide a catchy title, a brief description, a primary focus keyword, and 5-7 related long-tail keywords.
        2.  **SEO Guidance (for each topic):**
            -   **Keyword Density:** Suggest an optimal keyword density for the focus keyword (e.g., "1-2%").
            -   **Semantic Keywords:** List 5-7 semantically related keywords (LSI keywords) to build topical authority.
            -   **Linking Strategy:** Briefly describe a smart internal linking (e.g., "Link to the main product page") and external linking strategy (e.g., "Link to a high-authority study on the topic").
        3.  **Interactive Elements:** Propose 2-3 engaging interactive elements for the webpage (e.g., quizzes, calculators). Describe each one.
        4.  **Call-to-Action (CTA) Copy:** Write 3 natural, non-intrusive CTA copy examples.

        Return the entire strategy in a single, valid JSON object that strictly adheres to the provided schema. Do not include any text or markdown formatting outside of the JSON object. The content within the JSON MUST be in Traditional Chinese (繁體中文).
    `;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: contentStrategySchema,
            },
        });

        const jsonString = result.text.trim();
        try {
            const parsedResult: ContentStrategy = JSON.parse(jsonString);
            return parsedResult;
        } catch (e) {
            console.error("Failed to parse JSON response:", jsonString);
            throw new Error("模型回傳的資料格式錯誤，無法解析。請稍後再試。");
        }
    } catch (error) {
        console.error("Error generating content strategy:", error);
        throw new Error("生成內容策略時發生錯誤。請檢查您的網路連線或稍後再試。");
    }
};

// ============================================================================
// 海報提案生成
// ============================================================================

const posterProposalsSchema = {
    type: Type.OBJECT,
    properties: {
        proposals: {
            type: Type.ARRAY,
            description: "三個不同的商品海報提案",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "海報標題" },
                    description: { type: Type.STRING, description: "海報設計理念和目標的描述" },
                    designConcept: { type: Type.STRING, description: "設計概念說明" },
                    colorScheme: { type: Type.STRING, description: "色彩方案建議" },
                    keyVisualElements: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "關鍵視覺元素列表"
                    },
                    textContent: { type: Type.STRING, description: "海報上的主要文字內容" },
                    prompt: { 
                        type: Type.STRING, 
                        description: "用於圖片生成的詳細提示詞，應包含風格、構圖、色彩、元素等詳細描述"
                    },
                },
                required: ["title", "description", "designConcept", "colorScheme", "keyVisualElements", "textContent", "prompt"]
            }
        }
    },
    required: ["proposals"]
};

export const generatePosterProposals = async (
    productInfo: ProductInfo,
    analysisResult: AnalysisResult,
    contentStrategy: ContentStrategy,
    apiKey: string
): Promise<PosterProposals> => {
    if (!apiKey) {
        throw new Error("API Key 未設定，請先設定 Gemini API Key");
    }

    const ai = getAIInstance(apiKey);

    const prompt = `
        你是一位專業的視覺設計師和行銷專家，專精於商品海報設計。根據以下詳細的市場分析和內容策略，為產品「${productInfo.name}」創建三個不同風格的商品海報提案。

        **產品資訊：**
        - 產品名稱：${productInfo.name}
        - 產品描述：${productInfo.description}
        - 目標市場：${productInfo.market}

        **市場分析：**
        - **產品核心價值：** 
          - 主要特色：${analysisResult.productCoreValue.mainFeatures.join('、')}
          - 核心優勢：${analysisResult.productCoreValue.coreAdvantages.join('、')}
          - 解決的痛點：${analysisResult.productCoreValue.painPointsSolved.join('、')}
        - **目標受眾：** ${analysisResult.buyerPersonas.map(p => `${p.personaName} (${p.demographics})`).join('、')}
        - **市場定位：** ${analysisResult.marketPositioning.culturalInsights}
        - **消費習慣：** ${analysisResult.marketPositioning.consumerHabits}

        **內容策略：**
        - **內容主題：** ${contentStrategy.contentTopics.map(t => t.topic).join('、')}
        - **CTA 建議：** ${contentStrategy.ctaSuggestions.join('、')}

        **任務要求：**
        請創建三個風格迥異的海報提案，每個提案都應該：
        1. **標題**：吸引人的海報標題
        2. **描述**：說明這個海報的設計理念和目標受眾
        3. **設計概念**：詳細的設計概念說明（風格、氛圍、視覺重點）
        4. **色彩方案**：建議的色彩搭配（例如：主色、輔色、強調色）
        5. **關鍵視覺元素**：列出 3-5 個關鍵的視覺元素（例如：產品圖、圖示、背景、裝飾元素等）
        6. **文字內容**：海報上要顯示的主要文字內容（標題、副標題、說明文字等）
        7. **提示詞**：用於圖片生成的詳細提示詞，應包含：
           - 風格描述（例如：現代簡約、復古風格、科技感、溫馨風格等）
           - 構圖方式（例如：居中構圖、對角線構圖、三分法構圖等）
           - 色彩描述（使用建議的色彩方案）
           - 視覺元素（列出關鍵視覺元素）
           - 文字呈現方式（文字的位置、大小、風格）
           - 整體氛圍和情感傳達

        三個提案應該有不同的風格定位：
        - 提案一：專業、現代、簡約風格
        - 提案二：創意、活潑、吸引眼球風格
        - 提案三：情感訴求、故事性、溫馨風格

        所有內容必須使用繁體中文（繁體中文）。

        返回完整的 JSON 物件，嚴格遵守提供的 schema。不要包含任何 JSON 之外的文字或 Markdown 格式。
    `;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: posterProposalsSchema,
            },
        });

        const jsonString = result.text.trim();
        try {
            const parsedResult: PosterProposals = JSON.parse(jsonString);
            // 確保有3個提案
            if (parsedResult.proposals.length !== 3) {
                throw new Error("海報提案數量不正確");
            }
            return parsedResult;
        } catch (e) {
            console.error("Failed to parse JSON response:", jsonString);
            throw new Error("模型回傳的資料格式錯誤，無法解析。請稍後再試。");
        }
    } catch (error) {
        console.error("Error generating poster proposals:", error);
        throw new Error("生成海報提案時發生錯誤。請檢查您的網路連線或稍後再試。");
    }
};