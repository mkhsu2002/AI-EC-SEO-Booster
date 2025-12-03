import React, { useState } from 'react';
import type { PosterProposal, PosterSize } from '../../types';
import { EyeIcon, ArrowDownTrayIcon, DocumentTextIcon } from '../icons';

interface PosterProposalCardProps {
  proposal: PosterProposal;
  index: number;
  onGenerateImage: (proposalIndex: number, size: PosterSize, referenceImage?: File) => Promise<void>;
  onViewPrompt?: (prompt: string) => void;
  generatedImage?: string;
  isGeneratingImage?: boolean;
}

const SIZE_OPTIONS: { value: PosterSize; label: string; dimensions: string }[] = [
  { value: '1080x1080', label: '正方形', dimensions: '1080×1080' },
  { value: '1080x1350', label: '直式', dimensions: '1080×1350' },
  { value: '1080x1920', label: '手機直式', dimensions: '1080×1920' },
  { value: '1920x1080', label: '橫式', dimensions: '1920×1080' },
];

export const PosterProposalCard: React.FC<PosterProposalCardProps> = ({
  proposal,
  index,
  onGenerateImage,
  onViewPrompt,
  generatedImage,
  isGeneratingImage = false,
}) => {
  const [selectedSize, setSelectedSize] = useState<PosterSize>('1080x1080');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReferenceImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    await onGenerateImage(index, selectedSize, referenceImage || undefined);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `海報提案${index + 1}-${selectedSize}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-xl font-bold text-brand-light mb-2">
            提案 {index + 1}：{proposal.title}
          </h4>
          <p className="text-text-secondary text-sm mb-3">{proposal.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-semibold text-brand-secondary mb-1">設計概念</h5>
          <p className="text-text-secondary text-sm">{proposal.designConcept}</p>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-brand-secondary mb-1">色彩方案</h5>
          <p className="text-text-secondary text-sm">{proposal.colorScheme}</p>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-brand-secondary mb-1">關鍵視覺元素</h5>
          <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
            {proposal.keyVisualElements.map((element, i) => (
              <li key={i}>{element}</li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-brand-secondary mb-1">文字內容</h5>
          <p className="text-text-secondary text-sm whitespace-pre-line">{proposal.textContent}</p>
        </div>

        {onViewPrompt && (
          <div>
            <button
              onClick={() => onViewPrompt(proposal.prompt)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out text-sm inline-flex items-center justify-center"
            >
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              查看生成提示詞
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-slate-700 pt-4 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-brand-secondary mb-2">
            選擇尺寸
          </label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value as PosterSize)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-text-primary focus:ring-2 focus:ring-brand-secondary focus:outline-none"
          >
            {SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.dimensions})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-secondary mb-2">
            參考圖片（選填）
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-secondary file:text-white hover:file:bg-brand-dark"
          />
          {previewUrl && (
            <div className="mt-2">
              <img
                src={previewUrl}
                alt="參考圖片預覽"
                className="max-h-32 w-auto rounded-md border border-slate-600"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGeneratingImage}
          className="w-full bg-brand-secondary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:bg-slate-600 disabled:cursor-not-allowed inline-flex items-center justify-center"
        >
          {isGeneratingImage ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              生成中...
            </>
          ) : (
            '生成海報圖片'
          )}
        </button>

        {generatedImage && (
          <div className="space-y-2">
            <div className="relative group">
              <img
                src={generatedImage}
                alt={`海報提案${index + 1}`}
                className="w-full rounded-md border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsImageModalOpen(true)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-md flex items-center justify-center">
                <EyeIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out inline-flex items-center justify-center"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              下載圖片
            </button>
          </div>
        )}
      </div>

      {/* 圖片放大檢視 Modal */}
      {isImageModalOpen && generatedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={generatedImage}
              alt={`海報提案${index + 1} 放大檢視`}
              className="max-w-full max-h-[90vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

