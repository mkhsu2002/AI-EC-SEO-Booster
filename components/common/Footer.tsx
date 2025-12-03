import React from 'react';

export const Footer: React.FC = () => (
  <footer className="w-full text-center py-6 mt-12 border-t border-slate-700">
    <p className="text-text-secondary text-sm">
      Open sourced by{' '}
      <a 
        href="https://flypigai.icareu.tw/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-brand-secondary hover:text-brand-light transition-colors underline"
      >
        FlyPig AI
      </a>
    </p>
  </footer>
);

