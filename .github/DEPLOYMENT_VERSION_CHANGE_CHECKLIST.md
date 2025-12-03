# 版本變更部署檢查清單

## 當更改版本號或分支名稱時，必須執行以下步驟：

### 1. 更新程式碼中的版本號
- [ ] 更新 `App.tsx` 中的版本號顯示
- [ ] 更新 `README.md` 中的版本號
- [ ] 更新其他文件中的版本號引用

### 2. 更新 GitHub Actions 工作流程
- [ ] 更新 `.github/workflows/deploy-pages.yml` 中的分支名稱
- [ ] 確認工作流程監聽正確的分支

### 3. **重要：更新 GitHub Environments 設定**
- [ ] 前往 **Settings** > **Environments** > **github-pages**
- [ ] 在 **Deployment branches and tags** 區塊：
  - [ ] 新增新分支規則（如 `dev/v1.2`）
  - [ ] **移除舊分支規則**（如 `dev/v1.1`，如果分支已不存在）
- [ ] 確認新分支規則顯示 "Currently applies to 1 branch"

### 4. 提交並推送變更
- [ ] 提交所有變更
- [ ] 推送新分支到 GitHub

### 5. 手動觸發部署（建議）
- [ ] 前往 **Actions** 標籤
- [ ] 選擇 "Deploy to GitHub Pages" 工作流程
- [ ] 點擊 **Run workflow**
- [ ] 選擇新分支並執行

### 6. 驗證部署
- [ ] 等待部署完成（約 1-2 分鐘）
- [ ] 清除瀏覽器快取（Ctrl+Shift+R 或 Cmd+Shift+R）
- [ ] 測試網站是否正常運作

## 常見問題排查

### 如果部署後出現 MIME type 錯誤：
1. 確認 GitHub Pages Source 設為 **GitHub Actions**（不是 branch）
2. 確認 `.nojekyll` 檔案存在於 `public/` 目錄
3. 檢查建置日誌確認檔案正確生成
4. 清除瀏覽器快取並重新測試

### 如果部署失敗：
1. 檢查 GitHub Actions 日誌
2. 確認 Environments 設定正確
3. 確認分支規則包含新分支
4. 移除舊的、不存在的分支規則
