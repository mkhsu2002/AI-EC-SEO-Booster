import React from 'react';
import type { ContentStrategy, ProductInfo, AnalysisResult, ContentTopic } from '../../types';
import { ResultCard } from '../common/ResultCard';
import { SparklesIcon, ArrowDownTrayIcon } from '../icons';
import { ContentTopicCard } from './ContentTopicCard';
import { InteractiveElementCard } from './InteractiveElementCard';
import { generateStrategyReport, downloadMarkdown } from '../../utils/markdownUtils';

interface ContentStrategyDisplayProps {
  strategy: ContentStrategy;
  productInfo: ProductInfo | null;
  analysisResult: AnalysisResult | null;
  onGenerateAIStudioPrompt: (topic: ContentTopic) => void;
  onGenerateGammaPrompt: (topic: ContentTopic) => void;
  onDownloadAllPrompts?: () => void;
  screenshotRef3?: React.RefObject<HTMLDivElement>;
}

export const ContentStrategyDisplay: React.FC<ContentStrategyDisplayProps> = ({ 
  strategy, 
  productInfo, 
  analysisResult, 
  onGenerateAIStudioPrompt, 
  onGenerateGammaPrompt, 
  onDownloadAllPrompts, 
  screenshotRef3 
}) => {
  const handleDownload = () => {
    if (!productInfo) return;
    const markdownContent = generateStrategyReport(productInfo, strategy);
    downloadMarkdown(markdownContent, `內容策略-${productInfo.name.replace(/\s+/g, '_')}.txt`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8" ref={screenshotRef3}>
      <ResultCard 
        title="內容與互動策略" 
        icon={<SparklesIcon className="w-8 h-8" />}
        titleAction={
          <div className="flex gap-2">
            <button 
              onClick={handleDownload} 
              disabled={!productInfo}
              className="bg-brand-secondary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out text-sm inline-flex items-center disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              下載策略
            </button>
            {onDownloadAllPrompts && (
              <button 
                onClick={onDownloadAllPrompts} 
                disabled={!productInfo}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out text-sm inline-flex items-center disabled:bg-slate-600 disabled:cursor-not-allowed"
                title="下載所有提示詞（6段：3個主題 × AI Studio + Gamma）"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                下載所有提示詞
              </button>
            )}
          </div>
        }
      >
        <div className="space-y-8">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h4 className="text-xl font-bold text-brand-light mb-3">第三步：生成前導頁提示詞</h4>
            <p className="text-text-secondary mb-4 text-sm">選擇下方一個主題，生成適用於 AI Studio 或 Gamma 的提示詞。</p>
          </div>

          <div>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
              {strategy.contentTopics.map((topic, i) => 
                <ContentTopicCard 
                  key={i} 
                  topic={topic}
                  onGenerateAIStudioPrompt={() => onGenerateAIStudioPrompt(topic)}
                  onGenerateGammaPrompt={() => onGenerateGammaPrompt(topic)}
                />
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-slate-700">
            <div>
              <h4 className="text-xl font-bold text-brand-light mb-4">建議的互動元素</h4>
              <div className="space-y-4">
                {strategy.interactiveElements.map((el, i) => <InteractiveElementCard key={i} element={el} />)}
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold text-brand-light mb-4">建議的行動呼籲 (CTA) 文案</h4>
              <div className="space-y-4">
                {strategy.ctaSuggestions.map((cta, i) => (
                  <blockquote key={i} className="border-l-4 border-brand-secondary bg-slate-800 p-4 rounded-r-lg">
                    <p className="italic text-text-secondary">"{cta}"</p>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ResultCard>
    </div>
  );
};

