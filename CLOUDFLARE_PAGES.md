# Cloudflare Pages 部署配置

## 構建設置

在 Cloudflare Pages 的構建設置中，請確保以下配置：

- **構建命令**: `npm run build`
- **構建輸出目錄**: `dist`
- **Node.js 版本**: 18 或更高

## 重要文件

- `public/_headers` - 設置正確的 MIME types（已自動複製到 `dist/_headers`）
- `public/_redirects` - SPA 路由重定向（已自動複製到 `dist/_redirects`）

## 驗證部署

部署後，請確認：

1. `dist/_headers` 文件存在於構建輸出中
2. `dist/index.html` 引用的是 `/assets/main-*.js` 而不是 `/index.tsx`
3. 所有 JavaScript 文件都有正確的 `Content-Type: application/javascript` header

## 故障排除

如果仍然遇到 MIME type 錯誤：

1. 確認 Cloudflare Pages 使用的是構建後的 `dist` 目錄，而不是源文件
2. 檢查 `dist/_headers` 文件是否正確包含所有規則
3. 在 Cloudflare Dashboard 中檢查 Transform Rules 設置

