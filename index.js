// 簡化的入口檔案，避免 TypeScript 和模組載入問題
import React from 'react';
import ReactDOM from 'react-dom/client';

// 簡化的 App 元件
function App() {
  return React.createElement('div', {
    className: 'min-h-screen bg-slate-900 text-white flex items-center justify-center'
  }, [
    React.createElement('div', {
      className: 'text-center'
    }, [
      React.createElement('h1', {
        className: 'text-4xl font-bold mb-4'
      }, 'FlyPig AI 電商增長神器'),
      React.createElement('p', {
        className: 'text-lg text-slate-300 mb-8'
      }, 'AI 驅動的電商分析平台'),
      React.createElement('div', {
        className: 'bg-slate-800 p-6 rounded-lg max-w-md mx-auto'
      }, [
        React.createElement('h2', {
          className: 'text-xl font-semibold mb-4'
        }, '功能特色'),
        React.createElement('ul', {
          className: 'text-left space-y-2'
        }, [
          React.createElement('li', { className: 'flex items-center' }, [
            React.createElement('span', { className: 'text-blue-400 mr-2' }, '✓'),
            '深度市場分析'
          ]),
          React.createElement('li', { className: 'flex items-center' }, [
            React.createElement('span', { className: 'text-blue-400 mr-2' }, '✓'),
            '內容策略規劃'
          ]),
          React.createElement('li', { className: 'flex items-center' }, [
            React.createElement('span', { className: 'text-blue-400 mr-2' }, '✓'),
            'AI 提示詞生成'
          ]),
          React.createElement('li', { className: 'flex items-center' }, [
            React.createElement('span', { className: 'text-blue-400 mr-2' }, '✓'),
            '前導頁自動生成'
          ])
        ])
      ])
    ])
  ]);
}

// 渲染應用程式
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
} else {
  console.error('Could not find root element');
}
