import React, { useState } from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';

interface ApiKeyModalProps {
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose }) => {
  const { apiKey, setApiKey } = useApiKey();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!inputKey.trim()) {
      setError('請輸入 API Key');
      return;
    }

    if (inputKey.trim().length < 10) {
      setError('API Key 格式不正確');
      return;
    }

    setApiKey(inputKey.trim());
    onClose();
  };

  const handleRemove = () => {
    setApiKey(null);
    setInputKey('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div 
        className="bg-surface rounded-lg shadow-xl w-full max-w-md border border-slate-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-text-primary">設定 Gemini API Key</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-5">
          <p className="text-text-secondary mb-4 text-sm">
            請輸入您的 Google Gemini API Key。此 Key 將儲存在瀏覽器的本地儲存中，僅用於呼叫 Gemini API。
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-text-secondary mb-2">
                Gemini API Key
              </label>
              <input
                id="apiKey"
                type="password"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setError(null);
                }}
                placeholder="輸入您的 Gemini API Key"
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition text-text-primary"
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-brand-secondary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
              >
                儲存
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-md transition duration-300 ease-in-out"
                >
                  移除
                </button>
              )}
            </div>
          </form>
          <div className="mt-4 p-3 bg-slate-800 rounded-md">
            <p className="text-xs text-text-secondary">
              <strong>如何取得 API Key：</strong>
              <br />
              1. 前往 <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">Google AI Studio</a>
              <br />
              2. 登入您的 Google 帳號
              <br />
              3. 點擊「Create API Key」建立新的 API Key
              <br />
              4. 複製 API Key 並貼上到上方欄位
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

