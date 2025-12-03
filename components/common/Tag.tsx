import React from 'react';

interface TagProps {
  children: React.ReactNode;
}

export const Tag: React.FC<TagProps> = ({ children }) => (
  <span className="bg-brand-dark text-brand-light text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
    {children}
  </span>
);

