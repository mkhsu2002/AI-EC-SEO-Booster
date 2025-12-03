/**
 * 截圖工具函數
 */
import html2canvas from 'html2canvas';

/**
 * 截圖並下載指定元素
 */
export const captureAndDownloadScreenshot = async (
  element: HTMLElement,
  filename: string
): Promise<void> => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#0f172a',
      scale: 2,
      logging: false,
      useCORS: true,
    });
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('截圖失敗:', error);
    throw new Error('截圖失敗，請稍後再試');
  }
};

