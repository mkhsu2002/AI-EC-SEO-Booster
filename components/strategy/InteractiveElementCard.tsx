import React from 'react';
import type { InteractiveElement } from '../../types';

interface InteractiveElementCardProps {
  element: InteractiveElement;
}

export const InteractiveElementCard: React.FC<InteractiveElementCardProps> = ({ element }) => (
  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
    <h5 className="font-bold text-brand-secondary">{element.type}</h5>
    <p className="text-sm text-text-secondary mt-1">{element.description}</p>
  </div>
);

