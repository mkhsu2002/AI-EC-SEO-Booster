import React, { useState } from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';

interface ApiKeyModalProps {
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose }) => {
  const { apiKey, setApiKey } = useApiKey();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [error, setError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-violet-500/40 bg-gradient-to-b from-violet-900/60 via-slate-950 to-slate-950 shadow-[0_0_60px_rgba(139,92,246,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(167,139,250,0.3),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_55%)]" />
        <div className="flex flex-col gap-8 px-10 pb-10 pt-9">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500 shadow-[0_0_40px_rgba(167,139,250,0.9)]">
              <span className="text-2xl">🔑</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-wide text-white">
              Setup Gemini API
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              為了確保安全，請使用您自己的 API Key。
              <br />
              您的 Key 只會儲存在瀏覽器中，不會上傳至伺服器。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="apiKey"
                className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
              >
                Gemini API Key
              </label>
              <div className="relative mt-1">
                <input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value);
                    setError(null);
                  }}
                  placeholder="在此貼上您的 Gemini API Key"
                  className="w-full rounded-2xl border border-violet-500/50 bg-slate-900/70 px-4 py-3.5 pr-12 text-sm text-slate-50 shadow-inner shadow-black/40 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-400/70"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-200"
                  aria-label={showKey ? '隱藏 API Key' : '顯示 API Key'}
                >
                  {showKey ? '隱藏' : '顯示'}
                </button>
              </div>
              {error && (
                <p className="mt-1 text-xs text-red-400">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(109,40,217,0.7)] transition hover:brightness-110 hover:shadow-[0_22px_50px_rgba(109,40,217,0.9)] focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              開始使用
            </button>

            <div className="pt-2 text-center text-xs text-slate-400">
              還沒有 Key？{' '}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-violet-300 underline underline-offset-4 hover:text-violet-200"
              >
                點此免費獲取
              </a>
            </div>

            {apiKey && (
              <button
                type="button"
                onClick={handleRemove}
                className="mt-4 w-full rounded-2xl border border-slate-700/80 bg-slate-900/60 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800/80"
              >
                移除目前已儲存的 API Key
              </button>
            )}
          </form>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-black/40 p-1.5 text-slate-400 transition hover:bg-black/70 hover:text-slate-100"
          aria-label="關閉 API 設定視窗"
        >
          ×
        </button>
      </div>
    </div>
  );
};

