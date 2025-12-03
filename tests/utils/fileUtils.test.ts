import { describe, it, expect, vi } from 'vitest';
import { fileToBase64 } from '../../utils/fileUtils';

describe('fileUtils', () => {
  describe('fileToBase64', () => {
    it('應該將檔案轉換為 Base64 字串', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const result = await fileToBase64(file);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      // Base64 字串不應包含 data URL 前綴
      expect(result).not.toContain('data:');
      expect(result).not.toContain('base64,');
    });

    it('應該處理圖片檔案', async () => {
      // 創建一個簡單的 PNG 圖片（1x1 透明像素）
      const pngData = new Uint8Array([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
        0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
        0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
        0x42, 0x60, 0x82
      ]);
      
      const file = new File([pngData], 'test.png', { type: 'image/png' });
      const result = await fileToBase64(file);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('應該在檔案讀取失敗時拋出錯誤', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      
      // 模擬 FileReader 錯誤
      const originalFileReader = window.FileReader;
      window.FileReader = class extends originalFileReader {
        readAsDataURL() {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror(new Error('File read error') as any);
            }
          }, 0);
        }
      } as any;

      await expect(fileToBase64(file)).rejects.toThrow();
      
      // 恢復原始 FileReader
      window.FileReader = originalFileReader;
    });
  });
});

