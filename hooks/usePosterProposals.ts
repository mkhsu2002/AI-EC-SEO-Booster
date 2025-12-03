import { useState, useCallback } from 'react';
import { generatePosterProposals } from '../services/geminiService';
import { handleApiError } from '../utils/errorHandler';
import type { ProductInfo, AnalysisResult, ContentStrategy, PosterProposals } from '../types';

/**
 * 海報提案生成 Hook
 * 提供海報提案生成相關的狀態管理和操作函數
 */
export const usePosterProposals = (apiKey: string | null) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posterProposals, setPosterProposals] = useState<PosterProposals | null>(null);

  /**
   * 生成海報提案
   */
  const generate = useCallback(async (
    productInfo: ProductInfo,
    analysisResult: AnalysisResult,
    contentStrategy: ContentStrategy
  ) => {
    if (!apiKey) {
      setError('請先設定 Gemini API Key');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setPosterProposals(null);

    try {
      const result = await generatePosterProposals(productInfo, analysisResult, contentStrategy, apiKey);
      setPosterProposals(result);
    } catch (err) {
      setError(handleApiError(err));
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [apiKey]);

  /**
   * 重置所有狀態
   */
  const reset = useCallback(() => {
    setIsGenerating(false);
    setError(null);
    setPosterProposals(null);
  }, []);

  return {
    generate,
    isGenerating,
    error,
    posterProposals,
    reset,
  };
};

