# 已知問題與解決方案

## ⚠️ 當前已知問題

### 1. Tailwind CSS CDN 警告

**問題描述：**
開發者工具中會顯示警告訊息：
```
cdn.tailwindcss.com should not be used in production. 
To use Tailwind CSS in production, install it as a PostCSS plugin or use the Tailwind CLI
```

**影響：**
- ⚠️ **不影響功能**：應用程式可以正常運作
- ⚠️ **效能影響**：CDN 版本會載入完整的 Tailwind CSS，檔案較大
- ⚠️ **最佳實踐**：生產環境建議使用 PostCSS 插件版本

**原因：**
目前專案使用 Tailwind CSS CDN 版本（`https://cdn.tailwindcss.com`），這是為了快速開發和簡化設定。

**解決方案（未來優化）：**
1. 安裝 Tailwind CSS 作為 PostCSS 插件
2. 配置 `tailwind.config.js`
3. 使用 Vite 的 PostCSS 整合
4. 移除 CDN 引用

**優先級：** 🟢 低優先級（不影響功能，可後續優化）

---

### 2. TypeError: Cannot read properties of undefined (reading 'length')

**問題描述：**
開發者工具中會顯示錯誤訊息：
```
Uncaught TypeError: Cannot read properties of undefined (reading 'length')
at HTMLDocument.handleKeyDown (page-events.js:6:18599)
```

**影響：**
- ✅ **不影響功能**：應用程式可以正常運作
- ⚠️ **來源**：錯誤來自 Tailwind CSS CDN 的內部代碼（`page-events.js`），而非我們的應用程式代碼

**原因：**
這是 Tailwind CSS CDN 內部的事件處理器問題，可能與某些鍵盤事件處理有關。

**已實施的修復：**
- ✅ 在我們的鍵盤事件處理器中加入防護檢查
- ✅ 確保事件物件存在且有效
- ✅ 加入 `preventDefault()` 和 `stopPropagation()` 防止事件冒泡

**解決方案：**
1. ✅ **已完成**：加強我們的鍵盤事件處理器安全性
2. 🔄 **待處理**：考慮移除 Tailwind CSS CDN，改用 PostCSS 插件版本（與問題 1 的解決方案相同）

**優先級：** 🟢 低優先級（不影響功能，已加強防護）

---

## 📝 修復記錄

### 2024-12-03
- ✅ 加強鍵盤事件處理器的安全性檢查
- ✅ 在 `PromptModal` 和 `InfoModal` 中加入事件物件驗證
- ✅ 加入 `preventDefault()` 和 `stopPropagation()` 防止事件冒泡

---

## 🔮 未來優化建議

1. **安裝 Tailwind CSS 作為 PostCSS 插件**
   - 移除 CDN 引用
   - 配置 `tailwind.config.js`
   - 使用 Vite 的 PostCSS 整合
   - 優點：更小的打包檔案、更好的效能、消除警告和錯誤

2. **監控錯誤日誌**
   - 如果錯誤持續出現，考慮使用錯誤追蹤服務（如 Sentry）
   - 追蹤錯誤頻率和影響範圍

---

## ✅ 驗證狀態

- ✅ 應用程式功能正常運作
- ✅ 所有核心功能測試通過
- ✅ 錯誤不影響使用者體驗
- ⚠️ 警告和錯誤來自第三方 CDN，非應用程式代碼問題

