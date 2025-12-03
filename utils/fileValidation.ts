/**
 * 檔案驗證工具函數
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * 驗證圖片檔案
 */
export const validateImageFile = (file: File): FileValidationResult => {
  if (!ALLOWED_TYPES.includes(file.type as typeof ALLOWED_TYPES[number])) {
    return { 
      valid: false, 
      error: '不支援的圖片格式。請使用 JPEG、PNG、WebP 或 GIF 格式。' 
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `圖片大小不能超過 ${MAX_FILE_SIZE / 1024 / 1024}MB。` 
    };
  }
  
  return { valid: true };
};

/**
 * 取得檔案大小的人性化顯示
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

