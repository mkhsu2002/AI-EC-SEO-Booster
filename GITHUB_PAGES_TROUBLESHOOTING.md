# GitHub Pages MIME Type 問題診斷指南

## 問題描述
錯誤訊息：`Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream"`

## 已完成的修復

1. ✅ 新增 `.nojekyll` 檔案（停用 Jekyll 處理）
2. ✅ 移除不支援的 `_headers` 和 `_redirects` 檔案
3. ✅ 確保建置後的 `index.html` 正確引用 JS 檔案
4. ✅ 明確指定建置輸出的檔案命名規則

## 診斷步驟

### 1. 檢查 GitHub Pages 設定

前往 **Settings** > **Pages**，確認：
- **Source**: 必須選擇 **GitHub Actions**（不是 branch）
- **Branch**: 應該顯示 `dev/v1.2` 或相關的部署分支

### 2. 檢查 GitHub Actions 部署日誌

前往 **Actions** 標籤，查看最新的部署工作流程：

1. 點擊最新的 "Deploy to GitHub Pages" 工作流程
2. 展開 "Verify build output" 步驟
3. 確認輸出顯示：
   - `.nojekyll exists`
   - `index.html` 引用正確的 JS 檔案（如 `./assets/main-xxx.js`）
   - JS 檔案存在

### 3. 檢查實際部署的檔案

在瀏覽器中：
1. 開啟開發者工具（F12）
2. 前往 **Network** 標籤
3. 重新載入頁面
4. 檢查 `index.html` 的實際內容：
   - 應該引用 `./assets/main-xxx.js`
   - 不應該引用 `./index.tsx`

### 4. 清除快取

- **強制重新載入**：`Ctrl+Shift+R` (Windows/Linux) 或 `Cmd+Shift+R` (Mac)
- **無痕模式**：開啟無痕視窗測試
- **清除快取**：在開發者工具中清除瀏覽器快取

## 可能的解決方案

### 方案 1：確認 GitHub Pages 使用 GitHub Actions

如果設定錯誤，GitHub Pages 可能會使用舊的部署方式，導致檔案不正確。

### 方案 2：等待部署完成

GitHub Pages 部署通常需要 1-2 分鐘。請等待部署完成後再測試。

### 方案 3：手動觸發部署

1. 前往 **Actions** 標籤
2. 選擇 "Deploy to GitHub Pages" 工作流程
3. 點擊 "Run workflow"
4. 選擇 `dev/v1.2` 分支
5. 點擊 "Run workflow"

### 方案 4：檢查檔案副檔名

確認建置後的 JS 檔案有正確的 `.js` 副檔名：
- ✅ `main-xxx.js`（正確）
- ❌ `main-xxx`（錯誤，缺少副檔名）

## 如果問題持續

如果以上步驟都無法解決問題，請提供：

1. **GitHub Actions 建置日誌**（特別是 "Verify build output" 步驟）
2. **瀏覽器 Network 標籤截圖**（顯示實際載入的檔案）
3. **GitHub Pages 設定頁面截圖**（確認 Source 設定）

這樣可以進一步診斷問題。

