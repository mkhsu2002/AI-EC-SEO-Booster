import React, { useState } from 'react';
import type { ProductInfo } from '../../types';
import { fileToBase64 } from '../../utils/fileUtils';

interface InputFormProps {
  onAnalyze: (info: ProductInfo) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [productName, setProductName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !productDescription || !targetMarket) {
      alert("請填寫所有必要的文字欄位。");
      return;
    }
    let imagePayload: ProductInfo['image'];
    if (imageFile) {
      const base64 = await fileToBase64(imageFile);
      imagePayload = { base64, mimeType: imageFile.type };
    }
    onAnalyze({ name: productName, url: productUrl, description: productDescription, market: targetMarket, image: imagePayload });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <label htmlFor="productName" className="font-medium text-text-secondary">產品名稱</label>
        <input 
          id="productName" 
          type="text" 
          value={productName} 
          onChange={e => setProductName(e.target.value)} 
          placeholder="例如：人體工學辦公椅" 
          required 
          className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="productUrl" className="font-medium text-text-secondary">產品連結網址 (選填)</label>
        <input 
          id="productUrl" 
          type="url" 
          value={productUrl} 
          onChange={e => setProductUrl(e.target.value)} 
          placeholder="https://example.com/product-page" 
          className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="productDescription" className="font-medium text-text-secondary">產品描述與特色</label>
        <textarea 
          id="productDescription" 
          value={productDescription} 
          onChange={e => setProductDescription(e.target.value)} 
          placeholder="在此貼上產品詳細資訊、規格與主要賣點..." 
          required 
          rows={6} 
          className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition resize-y" 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="targetMarket" className="font-medium text-text-secondary">目標市場</label>
        <input 
          id="targetMarket" 
          type="text" 
          value={targetMarket} 
          onChange={e => setTargetMarket(e.target.value)} 
          placeholder="例如：台灣、美國加州或日本東京" 
          required 
          className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition" 
        />
      </div>
      <div className="space-y-2">
        <span className="font-medium text-text-secondary">產品圖片 (選填)</span>
        <label htmlFor="productImage" className="mt-1 group block cursor-pointer">
          <div className={`flex justify-center items-center w-full min-h-[12rem] px-6 py-4 border-2 ${previewUrl ? 'border-slate-700' : 'border-dashed border-slate-600'} rounded-lg bg-slate-800/50 hover:border-brand-secondary transition-colors`}>
            {previewUrl ? (
              <div className="text-center relative">
                <img src={previewUrl} alt="產品預覽" className="max-h-56 w-auto rounded-md shadow-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                  <span className="text-white text-lg font-semibold">更換圖片</span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0L22.5 12.75" />
                </svg>
                <div className="mt-4 flex text-sm justify-center leading-6 text-slate-400">
                  <p>
                    <span className="font-semibold text-brand-secondary">點擊以上傳</span>
                    <span className="pl-1">或拖曳圖片至此</span>
                  </p>
                </div>
                <p className="text-xs leading-5 text-slate-500">PNG, JPG, GIF 等格式</p>
              </div>
            )}
          </div>
        </label>
        {fileName && <p className="text-sm text-slate-400 mt-2 text-center">已選取檔案：{fileName}</p>}
        <input id="productImage" type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>
      <button 
        type="submit" 
        disabled={isLoading} 
        className="w-full bg-brand-secondary hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
      >
        {isLoading ? '分析中...' : '生成市場分析報告'}
        {isLoading && <div className="ml-3 border-t-transparent border-solid animate-spin rounded-full border-white border-2 h-5 w-5"></div>}
      </button>
    </form>
  );
};

