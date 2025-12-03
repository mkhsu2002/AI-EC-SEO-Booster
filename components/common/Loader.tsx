import React from 'react';
import { ChartBarIcon } from '../icons';

interface LoaderProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export const Loader: React.FC<LoaderProps> = ({ title, message, icon }) => (
  <div className="text-center py-20 space-y-4 animate-fade-in">
    <div className="animate-pulse-fast text-brand-secondary">
      {icon || <ChartBarIcon className="w-16 h-16 mx-auto" />}
    </div>
    <p className="text-xl font-semibold text-text-primary">{title}</p>
    <p className="text-text-secondary">{message}</p>
  </div>
);

