import React, { useState, useCallback } from 'react';
import { useApiKey } from './contexts/ApiKeyContext';
import { ApiKeyModal } from './components/ApiKeyModal';
import type { ContentTopic } from './types';

// Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Loader } from './components/common/Loader';
import { ErrorDisplay } from './components/common/ErrorDisplay';
import { InputForm } from './components/forms/InputForm';
import { AnalysisResultDisplay } from './components/analysis/AnalysisResultDisplay';
import { ContentStrategyDisplay } from './components/strategy/ContentStrategyDisplay';
import { PosterProposalsDisplay } from './components/posters/PosterProposalsDisplay';
import { PromptModal } from './components/modals/PromptModal';
import { InfoModal } from './components/modals/InfoModal';
import { FeatureIntroductionContent } from './components/modals/FeatureIntroductionContent';
import { SparklesIcon, ArrowPathIcon } from './components/icons';

// Hooks
import { useProductAnalysis } from './hooks/useProductAnalysis';
import { useContentStrategy } from './hooks/useContentStrategy';
import { usePosterProposals } from './hooks/usePosterProposals';
import { useScreenshot } from './hooks/useScreenshot';

// Utils
import { 
  generateGammaPrompt, 
  generateAIStudioPrompt, 
  generateAllPromptsMarkdown,
  generateComprehensiveGammaPrompt,
  generateComprehensiveAIStudioPrompt,
  calculateRecommendedPages
} from './utils/promptGenerators';
import { downloadMarkdown } from './utils/markdownUtils';
import { generatePosterImage } from './services/imageGenerationService';
import type { PosterSize } from './types';

function App() {
  const { apiKey } = useApiKey();
  const [formKey, setFormKey] = useState(0);
  
  const [promptModalContent, setPromptModalContent] = useState<string | null>(null);
  const [promptModalTitle, setPromptModalTitle] = useState('');
  
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // 使用自訂 Hooks 管理業務邏輯
  const {
    analyze,
    isLoading,
    error,
    analysisResult,
    productInfo,
    reset: resetAnalysis,
  } = useProductAnalysis(apiKey);

  const {
    generate: generateStrategy,
    isGenerating: isGeneratingStrategy,
    error: strategyError,
    contentStrategy,
    reset: resetStrategy,
  } = useContentStrategy(apiKey);

  const {
    screenshotRef1,
    screenshotRef2,
    screenshotRef3,
    downloadAllScreenshots,
  } = useScreenshot();

  const {
    generate: generatePosterProposals,
    isGenerating: isGeneratingPosters,
    error: posterError,
    posterProposals,
    reset: resetPosters,
  } = usePosterProposals(apiKey);

  const [generatedImages, setGeneratedImages] = useState<Record<number, { url: string; size: PosterSize }>>({});
  const [isGeneratingImages, setIsGeneratingImages] = useState<Record<number, boolean>>({});

  const handleAnalyze = useCallback(async (info: Parameters<typeof analyze>[0]) => {
    await analyze(info);
  }, [analyze]);

  const handleGenerateStrategy = useCallback(async () => {
    if (!analysisResult) return;
    await generateStrategy(analysisResult);
  }, [analysisResult, generateStrategy]);

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

  const handleGenerateComprehensiveGammaPrompt = useCallback(() => {
    if (!productInfo || !analysisResult || !contentStrategy) return;
    const prompt = generateComprehensiveGammaPrompt(productInfo, analysisResult, contentStrategy);
    const recommendedPages = calculateRecommendedPages(contentStrategy.contentTopics);
    setPromptModalTitle(`Gamma 綜合性主題提示詞（建議約 ${recommendedPages} 頁）`);
    setPromptModalContent(prompt);
  }, [productInfo, analysisResult, contentStrategy]);

  const handleGenerateComprehensiveAIStudioPrompt = useCallback(() => {
    if (!productInfo || !analysisResult || !contentStrategy) return;
    const prompt = generateComprehensiveAIStudioPrompt(productInfo, analysisResult, contentStrategy);
    const recommendedPages = calculateRecommendedPages(contentStrategy.contentTopics);
    setPromptModalTitle(`AI Studio 綜合性主題提示詞（建議約 ${recommendedPages} 頁）`);
    setPromptModalContent(prompt);
  }, [productInfo, analysisResult, contentStrategy]);

  const handleDownloadAllScreenshots = useCallback(async () => {
    await downloadAllScreenshots(productInfo);
  }, [productInfo, downloadAllScreenshots]);

  const handleGeneratePosterProposals = useCallback(async () => {
    if (!productInfo || !analysisResult || !contentStrategy) return;
    await generatePosterProposals(productInfo, analysisResult, contentStrategy);
  }, [productInfo, analysisResult, contentStrategy, generatePosterProposals]);

  const handleGeneratePosterImage = useCallback(async (
    proposalIndex: number,
    size: PosterSize,
    referenceImage?: File
  ) => {
    if (!posterProposals || !apiKey) return;

    const proposal = posterProposals.proposals[proposalIndex];
    if (!proposal) return;

    setIsGeneratingImages(prev => ({ ...prev, [proposalIndex]: true }));

    try {
      const imageUrl = await generatePosterImage(proposal.prompt, size, referenceImage, apiKey);
      setGeneratedImages(prev => ({
        ...prev,
        [proposalIndex]: { url: imageUrl, size },
      }));
    } catch (error) {
      console.error('生成圖片失敗:', error);
      alert('生成圖片失敗，請稍後再試');
    } finally {
      setIsGeneratingImages(prev => ({ ...prev, [proposalIndex]: false }));
    }
  }, [posterProposals, apiKey]);

  const handleViewPosterPrompt = useCallback((prompt: string) => {
    setPromptModalTitle('海報生成提示詞');
    setPromptModalContent(prompt);
  }, []);

  const handleStartOver = () => {
    resetAnalysis();
    resetStrategy();
    resetPosters();
    setPromptModalContent(null);
    setGeneratedImages({});
    setIsGeneratingImages({});
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
                    <>
                        <ContentStrategyDisplay 
                            strategy={contentStrategy} 
                            productInfo={productInfo}
                            analysisResult={analysisResult}
                            onGenerateAIStudioPrompt={handleGenerateAIStudioPrompt}
                            onGenerateGammaPrompt={handleGenerateGammaPrompt}
                            onGenerateComprehensiveAIStudioPrompt={handleGenerateComprehensiveAIStudioPrompt}
                            onGenerateComprehensiveGammaPrompt={handleGenerateComprehensiveGammaPrompt}
                            onDownloadAllPrompts={handleDownloadAllPrompts}
                            screenshotRef3={screenshotRef3}
                        />
                        
                        <PosterProposalsDisplay
                            productInfo={productInfo}
                            analysisResult={analysisResult}
                            contentStrategy={contentStrategy}
                            posterProposals={posterProposals}
                            isGenerating={isGeneratingPosters}
                            error={posterError}
                            onGenerate={handleGeneratePosterProposals}
                            onGenerateImage={handleGeneratePosterImage}
                            onViewPrompt={handleViewPosterPrompt}
                            generatedImages={generatedImages}
                            isGeneratingImages={isGeneratingImages}
                        />
                    </>
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
