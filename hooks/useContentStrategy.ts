import { useState, useCallback } from 'react';
import { generateContentStrategy } from '../services/geminiService';
import { handleApiError } from '../utils/errorHandler';
import type { AnalysisResult, ContentStrategy } from '../types';

/**
 * 內容策略生成 Hook
 * 提供內容策略生成相關的狀態管理和操作函數
 */
export const useContentStrategy = (apiKey: string | null) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentStrategy, setContentStrategy] = useState<ContentStrategy | null>(null);

  /**
   * 生成內容策略
   */
  const generate = useCallback(async (analysisResult: AnalysisResult) => {
    if (!apiKey) {
      setError('請先設定 Gemini API Key');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setContentStrategy(null);

    try {
      const result = await generateContentStrategy(analysisResult, apiKey);
      setContentStrategy(result);
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
    setContentStrategy(null);
  }, []);

  return {
    generate,
    isGenerating,
    error,
    contentStrategy,
    reset,
  };
};

