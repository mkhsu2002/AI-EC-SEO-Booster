import { useRef, useCallback } from 'react';
import { captureAndDownloadScreenshot } from '../utils/screenshotUtils';
import type { ProductInfo } from '../types';

/**
 * 截圖功能 Hook
 * 提供截圖相關的 ref 和操作函數
 */
export const useScreenshot = () => {
  const screenshotRef1 = useRef<HTMLDivElement>(null);
  const screenshotRef2 = useRef<HTMLDivElement>(null);
  const screenshotRef3 = useRef<HTMLDivElement>(null);

  /**
   * 下載所有截圖
   */
  const downloadAllScreenshots = useCallback(async (productInfo: ProductInfo | null) => {
    if (!productInfo) return;
    
    const productName = productInfo.name.replace(/\s+/g, '_');
    
    try {
      if (screenshotRef1.current) {
        await captureAndDownloadScreenshot(
          screenshotRef1.current, 
          `${productName}-1_產品核心價值與目標市場定位.png`
        );
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (screenshotRef2.current) {
        await captureAndDownloadScreenshot(
          screenshotRef2.current, 
          `${productName}-2_競爭對手分析與潛在客戶描繪.png`
        );
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (screenshotRef3.current) {
        await captureAndDownloadScreenshot(
          screenshotRef3.current, 
          `${productName}-3_內容與互動策略.png`
        );
      }
    } catch (error) {
      console.error('截圖失敗:', error);
      alert('截圖失敗，請稍後再試');
    }
  }, []);

  return {
    screenshotRef1,
    screenshotRef2,
    screenshotRef3,
    downloadAllScreenshots,
  };
};

