import React from 'react';

export const FeatureIntroductionContent: React.FC = () => (
  <>
    <p className="mb-6">「FlyPig AI 電商增長神器」是一個從市場策略、內容規劃到技術實現的全流程加速器，旨在為您的電商事業節省大量時間與人力成本，實現更快速、更智慧的業務增長。</p>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-brand-light mb-2">🚀 全方位市場深度透視</h3>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>**智慧產品分析：** 只需提供產品資訊，AI 就能自動拆解其核心賣點，更可上傳圖片進行視覺分析。</li>
          <li>**精準市場定位：** 深入剖析目標市場的文化、消費習慣和熱門趨勢。</li>
          <li>**競爭格局掃描：** 自動識別主要競爭對手，並透視其行銷策略與優劣勢。</li>
          <li>**清晰用戶畫像：** 為您描繪出最真實的潛在客戶樣貌 (Buyer Persona)，包含興趣、痛點與搜尋關鍵字。</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-brand-light mb-2">✍️ 自動化內容與 SEO 策略規劃</h3>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>**高價值內容主題生成：** AI 自動規劃最能吸引目標客群的內容主題。</li>
          <li>**專業 SEO 佈局建議：** 為每個主題提供完整的 SEO 策略，協助網站獲得更高排名。</li>
          <li>**高轉換率文案點子：** 提供多組具說服力的行動呼籲 (CTA) 文案。</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-brand-light mb-2">💻 一鍵生成前導頁提示詞</h3>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>**AI Studio 前導頁程式碼生成：** 一鍵生成專業提示詞，讓 AI 程式碼助理（如 Google AI Studio）在幾秒內產出高品質的 React 前導頁程式碼。</li>
        </ul>
      </div>
    </div>
    <h3 className="text-lg font-semibold text-brand-light mt-8 mb-2">💡 如何使用</h3>
    <ol className="list-decimal list-inside space-y-2 pl-2">
      <li>**第一步：輸入產品資訊** - 填寫產品資料並點擊「生成市場分析報告」。</li>
      <li>**第二步：生成內容策略** - 報告產出後，點擊「生成內容策略」按鈕，AI 將規劃出詳細的內容與 SEO 策略。</li>
      <li>**第三步：生成前導頁提示詞** - 從建議的內容主題中，點擊「生成 AI Studio 提示詞」按鈕，複製提示詞後貼到 AI 程式碼助理（如 Google AI Studio）中即可快速產出高品質的前導頁。</li>
    </ol>
  </>
);

