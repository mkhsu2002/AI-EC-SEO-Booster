/**
 * 統一錯誤處理機制
 */

/**
 * 自訂 API 錯誤類別
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 處理 API 錯誤並返回友善的使用者訊息
 * @param error - 錯誤物件
 * @returns 友善的錯誤訊息字串
 */
export const handleApiError = (error: unknown): string => {
  // 記錄詳細錯誤到日誌系統（生產環境）
  if (import.meta.env.PROD) {
    console.error('API Error:', error);
  } else {
    // 開發環境顯示完整錯誤
    console.error('API Error Details:', error);
  }

  // 如果是自訂的 ApiError，直接返回使用者訊息
  if (error instanceof ApiError) {
    return error.userMessage;
  }

  // 處理標準 Error 物件
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    
    // 網路連線錯誤
    if (errorMessage.includes('network') || 
        errorMessage.includes('fetch') || 
        errorMessage.includes('failed to fetch')) {
      return '網路連線發生問題，請檢查您的網路連線後再試。';
    }
    
    // 請求逾時
    if (errorMessage.includes('timeout') || 
        errorMessage.includes('timed out')) {
      return '請求逾時，請稍後再試。';
    }
    
    // API Key 相關錯誤
    if (errorMessage.includes('api key') || 
        errorMessage.includes('api_key') ||
        errorMessage.includes('authentication') ||
        errorMessage.includes('unauthorized')) {
      return 'API Key 設定有誤，請檢查設定後再試。';
    }
    
    // API 配額或限制錯誤
    if (errorMessage.includes('quota') || 
        errorMessage.includes('limit') ||
        errorMessage.includes('rate limit') ||
        errorMessage.includes('429')) {
      return 'API 使用配額已達上限，請稍後再試或檢查配額設定。';
    }
    
    // 服務不可用
    if (errorMessage.includes('service unavailable') ||
        errorMessage.includes('503')) {
      return '服務暫時無法使用，請稍後再試。';
    }
    
    // 伺服器錯誤
    if (errorMessage.includes('500') ||
        errorMessage.includes('internal server error')) {
      return '伺服器發生錯誤，請稍後再試。';
    }
    
    // 如果錯誤訊息包含中文，可能是 API 返回的友善訊息，直接使用
    if (/[\u4e00-\u9fa5]/.test(error.message)) {
      return error.message;
    }
    
    // 其他未知錯誤
    return '發生未知錯誤，請稍後再試。';
  }

  // 處理字串錯誤
  if (typeof error === 'string') {
    return error;
  }

  // 預設錯誤訊息
  return '發生未知錯誤，請稍後再試。';
};

/**
 * 包裝 API 呼叫，自動處理錯誤
 * @param apiCall - API 呼叫函數
 * @param errorHandler - 可選的自訂錯誤處理函數
 * @returns Promise 結果或拋出處理後的錯誤
 */
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  errorHandler?: (error: unknown) => string
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    const userMessage = errorHandler ? errorHandler(error) : handleApiError(error);
    throw new ApiError(
      error instanceof Error ? error.message : String(error),
      'API_ERROR',
      userMessage
    );
  }
};

