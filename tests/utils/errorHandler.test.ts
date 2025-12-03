import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleApiError, ApiError } from '../../utils/errorHandler';

// 模擬環境變數
vi.mock('import.meta', () => ({
  env: {
    PROD: false,
  },
}));

describe('errorHandler', () => {
  describe('handleApiError', () => {
    it('應該處理 ApiError 實例', () => {
      const error = new ApiError(
        'Technical error message',
        'API_ERROR',
        '使用者友善的錯誤訊息',
        400
      );
      
      const result = handleApiError(error);
      expect(result).toBe('使用者友善的錯誤訊息');
    });

    it('應該處理網路錯誤', () => {
      const error = new Error('Network request failed');
      const result = handleApiError(error);
      expect(result).toContain('網路連線');
    });

    it('應該處理 fetch 錯誤', () => {
      const error = new Error('Failed to fetch');
      const result = handleApiError(error);
      expect(result).toContain('網路連線');
    });

    it('應該處理逾時錯誤', () => {
      const error = new Error('Request timeout');
      const result = handleApiError(error);
      expect(result).toContain('逾時');
    });

    it('應該處理 API Key 錯誤', () => {
      const error = new Error('Invalid API key');
      const result = handleApiError(error);
      expect(result).toContain('API Key');
    });

    it('應該處理配額錯誤', () => {
      const error = new Error('API quota exceeded');
      const result = handleApiError(error);
      expect(result).toContain('配額');
    });

    it('應該處理服務不可用錯誤', () => {
      const error = new Error('Service unavailable');
      const result = handleApiError(error);
      expect(result).toContain('暫時無法使用');
    });

    it('應該處理伺服器錯誤', () => {
      const error = new Error('Internal server error 500');
      const result = handleApiError(error);
      expect(result).toContain('伺服器');
    });

    it('應該保留中文錯誤訊息', () => {
      const error = new Error('這是一個中文錯誤訊息');
      const result = handleApiError(error);
      expect(result).toBe('這是一個中文錯誤訊息');
    });

    it('應該處理字串錯誤', () => {
      const result = handleApiError('字串錯誤');
      expect(result).toBe('字串錯誤');
    });

    it('應該處理未知錯誤', () => {
      const error = new Error('Unknown error');
      const result = handleApiError(error);
      expect(result).toBe('發生未知錯誤，請稍後再試。');
    });

    it('應該處理 null 或 undefined', () => {
      const result1 = handleApiError(null);
      const result2 = handleApiError(undefined);
      expect(result1).toBe('發生未知錯誤，請稍後再試。');
      expect(result2).toBe('發生未知錯誤，請稍後再試。');
    });
  });

  describe('ApiError', () => {
    it('應該正確創建 ApiError 實例', () => {
      const error = new ApiError(
        'Technical message',
        'ERROR_CODE',
        'User message',
        500
      );
      
      expect(error.message).toBe('Technical message');
      expect(error.code).toBe('ERROR_CODE');
      expect(error.userMessage).toBe('User message');
      expect(error.statusCode).toBe(500);
      expect(error.name).toBe('ApiError');
    });
  });
});

