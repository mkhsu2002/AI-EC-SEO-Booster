import { z } from 'zod';

/**
 * 產品資訊表單驗證 Schema
 */
export const productInfoSchema = z.object({
  name: z.string()
    .min(1, '產品名稱不能為空')
    .max(100, '產品名稱不能超過 100 個字元'),
  
  description: z.string()
    .min(10, '產品描述至少需要 10 個字元')
    .max(5000, '產品描述不能超過 5000 個字元'),
  
  url: z.string()
    .url('請輸入有效的網址')
    .optional()
    .or(z.literal('')),
  
  market: z.string()
    .min(1, '目標市場不能為空')
    .max(200, '目標市場描述不能超過 200 個字元'),
  
  image: z.object({
    base64: z.string(),
    mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  }).optional(),
});

export type ProductInfoForm = z.infer<typeof productInfoSchema>;

