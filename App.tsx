import React, { useState, useCallback, useRef } from 'react';
import { analyzeMarket, generateContentStrategy } from './services/geminiService';
import { useApiKey } from './contexts/ApiKeyContext';
import { ApiKeyModal } from './components/ApiKeyModal';
import type { AnalysisResult, ProductInfo, ContentStrategy, ContentTopic } from './types';

// Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Loader } from './components/common/Loader';
import { ErrorDisplay } from './components/common/ErrorDisplay';
import { InputForm } from './components/forms/InputForm';
import { AnalysisResultDisplay } from './components/analysis/AnalysisResultDisplay';
import { ContentStrategyDisplay } from './components/strategy/ContentStrategyDisplay';
import { PromptModal } from './components/modals/PromptModal';
import { InfoModal } from './components/modals/InfoModal';
import { FeatureIntroductionContent } from './components/modals/FeatureIntroductionContent';
import { SparklesIcon, ArrowPathIcon } from './components/icons';

// Utils
import { generateGammaPrompt, generateAIStudioPrompt, generateAllPromptsMarkdown } from './utils/promptGenerators';
import { downloadMarkdown } from './utils/markdownUtils';
import { captureAndDownloadScreenshot } from './utils/screenshotUtils';

function App() {
    const { apiKey } = useApiKey();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
    const [formKey, setFormKey] = useState(0);

    const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
    const [strategyError, setStrategyError] = useState<string | null>(null);
    const [contentStrategy, setContentStrategy] = useState<ContentStrategy | null>(null);
    
    const [promptModalContent, setPromptModalContent] = useState<string | null>(null);
    const [promptModalTitle, setPromptModalTitle] = useState('');
    
    const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Screenshot refs
  const screenshotRef1 = useRef<HTMLDivElement>(null);
  const screenshotRef2 = useRef<HTMLDivElement>(null);
  const screenshotRef3 = useRef<HTMLDivElement>(null);

    const handleAnalyze = useCallback(async (productInfo: ProductInfo) => {
        if (!apiKey) {
            setError('請先設定 Gemini API Key');
            return;
        }
        setProductInfo(productInfo);
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const result = await analyzeMarket(productInfo, apiKey);
            setAnalysisResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : '發生未知錯誤');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [apiKey]);
    
    const handleGenerateStrategy = useCallback(async () => {
        if (!analysisResult || !apiKey) {
            if (!apiKey) {
                setStrategyError('請先設定 Gemini API Key');
            }
            return;
        }
        setIsGeneratingStrategy(true);
        setStrategyError(null);
        setContentStrategy(null);
        try {
            const result = await generateContentStrategy(analysisResult, apiKey);
            setContentStrategy(result);
        } catch (err) {
            setStrategyError(err instanceof Error ? err.message : '發生未知錯誤');
            console.error(err);
        } finally {
            setIsGeneratingStrategy(false);
        }
    }, [analysisResult, apiKey]);

    const handleGenerateGammaPrompt = useCallback((topic: ContentTopic) => {
        if (!productInfo || !analysisResult || !contentStrategy) return;
    const prompt = generateGammaPrompt(productInfo, analysisResult, topic, contentStrategy);
        setPromptModalTitle('Gamma 生成提示詞');
        setPromptModalContent(prompt);
    }, [productInfo, analysisResult, contentStrategy]);

    const handleGenerateAIStudioPrompt = useCallback((topic: ContentTopic) => {
        if (!productInfo || !analysisResult || !contentStrategy) return;
    const prompt = generateAIStudioPrompt(productInfo, analysisResult, topic, contentStrategy);
        setPromptModalTitle('AI Studio 生成提示詞');
        setPromptModalContent(prompt);
    }, [productInfo, analysisResult, contentStrategy]);

    const handleDownloadAllPrompts = useCallback(() => {
        if (!productInfo || !analysisResult || !contentStrategy) return;
    const markdownContent = generateAllPromptsMarkdown(productInfo, analysisResult, contentStrategy);
    downloadMarkdown(markdownContent, `完整提示詞集合-${productInfo.name.replace(/\s+/g, '_')}.txt`);
  }, [productInfo, analysisResult, contentStrategy]);

    const handleDownloadAllScreenshots = useCallback(async () => {
        if (!productInfo) return;
        const productName = productInfo.name.replace(/\s+/g, '_');
        
    try {
        if (screenshotRef1.current) {
        await captureAndDownloadScreenshot(screenshotRef1.current, `${productName}-1_產品核心價值與目標市場定位.png`);
        await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (screenshotRef2.current) {
        await captureAndDownloadScreenshot(screenshotRef2.current, `${productName}-2_競爭對手分析與潛在客戶描繪.png`);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (screenshotRef3.current) {
        await captureAndDownloadScreenshot(screenshotRef3.current, `${productName}-3_內容與互動策略.png`);
      }
    } catch (error) {
      alert('截圖失敗，請稍後再試');
        }
  }, [productInfo]);

    const handleStartOver = () => {
        setIsLoading(false);
        setError(null);
        setAnalysisResult(null);
        setProductInfo(null);
        setIsGeneratingStrategy(false);
        setStrategyError(null);
        setContentStrategy(null);
        setPromptModalContent(null);
        setFormKey(prevKey => prevKey + 1);
    };
    
    const renderContent = () => {
    if (isLoading) {
      return <Loader title="正在進行深度分析..." message="AI 正在分析市場、競爭對手與潛在客戶。" />;
    }
    if (error) {
      return <ErrorDisplay title="分析失敗" message={error} />;
    }

        return (
            <>
                {analysisResult && (
                    <AnalysisResultDisplay 
                        result={analysisResult} 
                        productInfo={productInfo}
                        screenshotRef1={screenshotRef1}
                        screenshotRef2={screenshotRef2}
                        onDownloadScreenshots={handleDownloadAllScreenshots}
                    />
                )}
                
                {analysisResult && !contentStrategy && !isGeneratingStrategy && (
                    <div className="w-full text-center mt-4">
            <button 
              onClick={handleGenerateStrategy} 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 inline-flex items-center"
            >
                             <SparklesIcon className="w-5 h-5 mr-2" />
                             第二步：生成內容策略
                         </button>
                    </div>
                )}
                
        {isGeneratingStrategy && (
          <Loader 
            title="正在構思內容點子..." 
            message="AI 策略師正在規劃主題與互動要素。" 
            icon={<SparklesIcon className="w-16 h-16 mx-auto"/>}
          />
        )}
                {strategyError && <ErrorDisplay title="策略生成失敗" message={strategyError} />}
                
                {contentStrategy && (
                    <ContentStrategyDisplay 
                        strategy={contentStrategy} 
                        productInfo={productInfo}
                        analysisResult={analysisResult}
                        onGenerateAIStudioPrompt={handleGenerateAIStudioPrompt}
                        onGenerateGammaPrompt={handleGenerateGammaPrompt}
                        onDownloadAllPrompts={handleDownloadAllPrompts}
                        screenshotRef3={screenshotRef3}
                    />
                )}
            </>
    );
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <main className="container mx-auto px-4 pb-12 relative">
                <div className="absolute top-6 right-4 sm:right-6 md:right-8 flex gap-2 z-10">
                    <button 
                        onClick={() => setIsApiKeyModalOpen(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-text-secondary font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm border border-slate-600"
                    >
                        API 設定
                    </button>
                    <button 
                        onClick={() => setIsIntroModalOpen(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-text-secondary font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm border border-slate-600"
                    >
                        功能簡介
                    </button>
                </div>
                <Header />
                <div className="mt-8">
                    {!analysisResult && !isLoading && !error && (
                        <InputForm key={formKey} onAnalyze={handleAnalyze} isLoading={isLoading} />
                    )}

                    {renderContent()}
                    
                    {(analysisResult || error) && !isLoading && !isGeneratingStrategy && (
                         <div className="w-full max-w-6xl mx-auto text-center mt-12">
              <button 
                onClick={handleStartOver} 
                className="text-sm text-slate-400 hover:text-white transition duration-300 inline-flex items-center"
              >
                                 <ArrowPathIcon className="w-4 h-4 mr-2" />
                                 開始新分析
                             </button>
                         </div>
                    )}
                </div>
            </main>
            <Footer />
            {promptModalContent && (
        <PromptModal 
          prompt={promptModalContent} 
          title={promptModalTitle} 
          onClose={() => setPromptModalContent(null)} 
        />
            )}
            {isIntroModalOpen && (
                 <InfoModal title="🚀 電商SEO加速器：功能簡介" onClose={() => setIsIntroModalOpen(false)}>
                    <FeatureIntroductionContent />
                 </InfoModal>
            )}
            {isApiKeyModalOpen && (
                <ApiKeyModal onClose={() => setIsApiKeyModalOpen(false)} />
            )}
        </div>
    );
}

export default App;
