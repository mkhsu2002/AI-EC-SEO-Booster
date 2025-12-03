import React, { useEffect } from 'react';

interface InfoModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ title, children, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-3xl border border-slate-700 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto text-text-secondary space-y-4">
          {children}
        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end flex-shrink-0 bg-slate-800/50 rounded-b-lg">
          <button onClick={onClose} className="bg-brand-secondary hover:bg-brand-dark text-white font-bold py-2 px-5 rounded-md transition">
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

