import React, { useState } from 'react';
import type { ProductInfo, AnalysisResult, ContentStrategy, PosterProposals, PosterSize } from '../../types';
import { ResultCard } from '../common/ResultCard';
import { SparklesIcon } from '../icons';
import { PosterProposalCard } from './PosterProposalCard';

interface PosterProposalsDisplayProps {
  productInfo: ProductInfo | null;
  analysisResult: AnalysisResult | null;
  contentStrategy: ContentStrategy | null;
  posterProposals: PosterProposals | null;
  isGenerating: boolean;
  error: string | null;
  onGenerate: () => void;
  onGenerateImage: (proposalIndex: number, size: PosterSize, referenceImage?: File) => Promise<void>;
  onViewPrompt?: (prompt: string) => void;
  generatedImages: Record<number, { url: string; size: PosterSize }>;
  isGeneratingImages: Record<number, boolean>;
}

export const PosterProposalsDisplay: React.FC<PosterProposalsDisplayProps> = ({
  productInfo,
  analysisResult,
  contentStrategy,
  posterProposals,
  isGenerating,
  error,
  onGenerate,
  onGenerateImage,
  onViewPrompt,
  generatedImages,
  isGeneratingImages,
}) => {
  if (!productInfo || !analysisResult || !contentStrategy) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <ResultCard
        title="第四步：商品海報提案"
        icon={<SparklesIcon className="w-8 h-8" />}
      >
        <div className="space-y-6">
          {!posterProposals && !isGenerating && !error && (
            <div className="text-center py-8">
              <p className="text-text-secondary mb-4">
                根據以上分析，AI 將為您生成三個不同風格的商品海報提案，包含設計概念、色彩方案、視覺元素和圖片生成提示詞。
              </p>
              <button
                onClick={onGenerate}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 inline-flex items-center"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                生成海報提案
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-secondary mx-auto mb-4"></div>
              <p className="text-text-secondary">AI 正在生成海報提案...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {posterProposals && (
            <div className="space-y-6">
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h4 className="text-lg font-bold text-brand-light mb-2">
                  🎨 三個海報提案已生成
                </h4>
                <p className="text-text-secondary text-sm">
                  每個提案都包含完整的設計概念、色彩方案、視覺元素和圖片生成提示詞。您可以選擇尺寸、上傳參考圖片，然後生成實際的海報圖片。
                </p>
              </div>

              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                {posterProposals.proposals.map((proposal, index) => (
                  <PosterProposalCard
                    key={index}
                    proposal={proposal}
                    index={index}
                    onGenerateImage={onGenerateImage}
                    onViewPrompt={onViewPrompt}
                    generatedImage={generatedImages[index]?.url}
                    isGeneratingImage={isGeneratingImages[index]}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ResultCard>
    </div>
  );
};

