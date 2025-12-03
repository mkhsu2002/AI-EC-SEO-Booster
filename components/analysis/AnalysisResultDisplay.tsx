import React from 'react';
import type { AnalysisResult, ProductInfo } from '../../types';
import { ResultCard } from '../common/ResultCard';
import { Tag } from '../common/Tag';
import { ChartBarIcon, LightBulbIcon, DocumentTextIcon, UserGroupIcon, ArrowDownTrayIcon, EyeIcon } from '../icons';
import { CompetitorCard } from './CompetitorCard';
import { PersonaCard } from './PersonaCard';
import { generateAnalysisReport, downloadMarkdown } from '../../utils/markdownUtils';

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
  productInfo: ProductInfo | null;
  screenshotRef1?: React.RefObject<HTMLDivElement>;
  screenshotRef2?: React.RefObject<HTMLDivElement>;
  onDownloadScreenshots?: () => void;
}

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ 
  result, 
  productInfo, 
  screenshotRef1, 
  screenshotRef2, 
  onDownloadScreenshots 
}) => {
  const { productCoreValue, marketPositioning, competitorAnalysis, buyerPersonas } = result;

  const handleDownload = () => {
    if (!productInfo) return;
    const markdownContent = generateAnalysisReport(productInfo, result);
    downloadMarkdown(markdownContent, `市場分析報告-${productInfo.name.replace(/\s+/g, '_')}.txt`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-8 animate-fade-in">
      <ResultCard 
        title="分析報告" 
        icon={<ChartBarIcon className="w-8 h-8"/>}
        titleAction={
          <div className="flex gap-2">
            <button 
              onClick={handleDownload} 
              disabled={!productInfo}
              className="bg-brand-secondary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out text-sm inline-flex items-center disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              下載報告
            </button>
            {onDownloadScreenshots && (
              <button 
                onClick={onDownloadScreenshots} 
                disabled={!productInfo}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out text-sm inline-flex items-center disabled:bg-slate-600 disabled:cursor-not-allowed"
                title="下載分析報告截圖"
              >
                <EyeIcon className="w-5 h-5 mr-2" />
                下載截圖
              </button>
            )}
          </div>
        }
      >
        <p className="text-text-secondary">以下是根據您提供的產品資訊生成的綜合市場分析報告。</p>
      </ResultCard>

      <div ref={screenshotRef1}>
        <ResultCard title="產品核心價值" icon={<LightBulbIcon className="w-8 h-8"/>}>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-2 text-brand-light">主要特色</h4>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                {productCoreValue.mainFeatures.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2 text-brand-light">核心優勢</h4>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                {productCoreValue.coreAdvantages.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2 text-brand-light">解決的痛點</h4>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                {productCoreValue.painPointsSolved.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </ResultCard>
        <ResultCard title="目標市場定位" icon={<ChartBarIcon className="w-8 h-8" />}>
          <div className="space-y-4">
            <p><strong className="text-brand-light">文化洞察:</strong> <span className="text-text-secondary">{marketPositioning.culturalInsights}</span></p>
            <p><strong className="text-brand-light">消費習慣:</strong> <span className="text-text-secondary">{marketPositioning.consumerHabits}</span></p>
            <p><strong className="text-brand-light">語言特性:</strong> <span className="text-text-secondary">{marketPositioning.languageNuances}</span></p>
            <div>
              <h4 className="font-semibold text-lg mb-2 text-brand-light">搜尋趨勢</h4>
              <div className="flex flex-wrap">
                {marketPositioning.searchTrends.map((trend, i) => <Tag key={i}>{trend}</Tag>)}
              </div>
            </div>
          </div>
        </ResultCard>
      </div>
      <div ref={screenshotRef2}>
        <ResultCard title="競爭對手分析" icon={<DocumentTextIcon className="w-8 h-8" />}>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {competitorAnalysis.map((c, i) => <CompetitorCard key={i} competitor={c} />)}
          </div>
        </ResultCard>
        <ResultCard title="潛在客戶描繪" icon={<UserGroupIcon className="w-8 h-8" />}>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {buyerPersonas.map((p, i) => <PersonaCard key={i} persona={p} />)}
          </div>
        </ResultCard>
      </div>
    </div>
  );
};

