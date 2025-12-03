import { useState, useCallback } from 'react';
import { analyzeMarket } from '../services/geminiService';
import { handleApiError } from '../utils/errorHandler';
import type { ProductInfo, AnalysisResult } from '../types';

/**
 * 產品市場分析 Hook
 * 提供市場分析相關的狀態管理和操作函數
 */
export const useProductAnalysis = (apiKey: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);

  /**
   * 執行市場分析
   */
  const analyze = useCallback(async (info: ProductInfo) => {
    if (!apiKey) {
      setError('請先設定 Gemini API Key');
      return;
    }

    setProductInfo(info);
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeMarket(info, apiKey);
      setAnalysisResult(result);
    } catch (err) {
      setError(handleApiError(err));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  /**
   * 重置所有狀態
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setAnalysisResult(null);
    setProductInfo(null);
  }, []);

  return {
    analyze,
    isLoading,
    error,
    analysisResult,
    productInfo,
    reset,
  };
};

