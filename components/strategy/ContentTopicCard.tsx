import React from 'react';
import type { ContentTopic } from '../../types';
import { Tag } from '../common/Tag';
import { SparklesIcon } from '../icons';

interface ContentTopicCardProps {
  topic: ContentTopic;
  onGenerateAIStudioPrompt: () => void;
  onGenerateGammaPrompt: () => void;
}

export const ContentTopicCard: React.FC<ContentTopicCardProps> = ({ 
  topic, 
  onGenerateAIStudioPrompt, 
  onGenerateGammaPrompt 
}) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3 flex flex-col justify-between">
      <div>
        <h5 className="text-lg font-bold text-brand-secondary">{topic.topic}</h5>
        <p className="text-sm text-text-secondary mt-2 mb-4">{topic.description}</p>
        
        <div className="space-y-3 text-sm border-t border-slate-700 pt-3">
          <h6 className="font-semibold text-brand-light">SEO 指導方針</h6>
          <p className="text-text-secondary">
            <strong className="text-slate-400">關鍵字密度:</strong> {topic.seoGuidance.keywordDensity}
          </p>
          <div>
            <strong className="text-slate-400">語意相關關鍵字:</strong>
            <div className="flex flex-wrap pt-1">
              {topic.seoGuidance.semanticKeywords.map((kw, i) => <Tag key={i}>{kw}</Tag>)}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <button 
          onClick={onGenerateAIStudioPrompt} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center text-sm shadow-md hover:shadow-lg"
        >
          <SparklesIcon className="w-4 h-4 mr-2" />
          生成 AI Studio 提示詞
        </button>
        <button 
          onClick={onGenerateGammaPrompt} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center text-sm shadow-md hover:shadow-lg"
        >
          <SparklesIcon className="w-4 h-4 mr-2" />
          生成 Gamma 提示詞
        </button>
      </div>
    </div>
  );
};

