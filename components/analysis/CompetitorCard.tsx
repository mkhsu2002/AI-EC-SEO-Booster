import React from 'react';
import type { Competitor } from '../../types';

interface CompetitorCardProps {
  competitor: Competitor;
}

export const CompetitorCard: React.FC<CompetitorCardProps> = ({ competitor }) => (
  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3">
    <h4 className="text-xl font-bold text-brand-secondary">{competitor.brandName}</h4>
    <p className="text-sm text-text-secondary italic">{competitor.marketingStrategy}</p>
    <div>
      <h5 className="font-semibold text-green-400">優勢</h5>
      <ul className="list-disc list-inside text-sm text-text-secondary">
        {competitor.strengths.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
    <div>
      <h5 className="font-semibold text-red-400">劣勢</h5>
      <ul className="list-disc list-inside text-sm text-text-secondary">
        {competitor.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
      </ul>
    </div>
  </div>
);

