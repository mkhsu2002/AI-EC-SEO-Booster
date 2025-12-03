import React from 'react';

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleAction?: React.ReactNode;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  icon, 
  children, 
  className = '', 
  titleAction 
}) => (
  <div className={`bg-surface rounded-lg shadow-lg p-6 border border-slate-700 animate-slide-in-up ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="p-2 bg-brand-primary/20 rounded-md mr-4 text-brand-secondary">{icon}</div>
        <h3 className="text-2xl font-bold text-text-primary">{title}</h3>
      </div>
      {titleAction}
    </div>
    {children}
  </div>
);

