import React, { useState, useEffect, useRef } from 'react';

interface PromptModalProps {
  prompt: string;
  onClose: () => void;
  title: string;
}

export const PromptModal: React.FC<PromptModalProps> = ({ prompt, onClose, title }) => {
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    if (textareaRef.current) {
      navigator.clipboard.writeText(textareaRef.current.value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  
  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 確保事件物件存在且有效
      if (event && event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div 
        className="bg-surface rounded-lg shadow-xl w-full max-w-3xl border border-slate-700 flex flex-col max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-5 overflow-y-auto">
          <p className="text-text-secondary mb-4 text-sm">
            請複製以下提示詞，並將其貼到對應的 AI 工具中以生成高品質內容。
          </p>
          <textarea 
            ref={textareaRef}
            readOnly 
            value={prompt} 
            className="w-full h-96 bg-slate-800 border border-slate-600 rounded-md p-3 text-sm text-slate-300 resize-none focus:ring-2 focus:ring-brand-secondary focus:outline-none" 
          />
        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end flex-shrink-0 bg-slate-800/50 rounded-b-lg">
          <button 
            onClick={handleCopy}
            className="bg-brand-secondary hover:bg-brand-dark text-white font-bold py-2 px-5 rounded-md transition duration-300 ease-in-out inline-flex items-center"
          >
            {isCopied ? '已複製！' : '複製提示詞'}
          </button>
        </div>
      </div>
    </div>
  );
};

