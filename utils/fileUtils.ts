/**
 * 檔案處理工具函數
 */

/**
 * 將檔案轉換為 Base64 字串
 * @param file - 要轉換的檔案
 * @returns Promise<string> - Base64 字串（不含 data URL 前綴）
 */
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });

