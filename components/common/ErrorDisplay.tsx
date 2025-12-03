import React from 'react';

interface ErrorDisplayProps {
  title: string;
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ title, message }) => (
  <div className="text-center my-10 p-6 text-red-400 bg-red-900/20 border border-red-500 rounded-md max-w-2xl mx-auto animate-fade-in">
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p>{message}</p>
  </div>
);

