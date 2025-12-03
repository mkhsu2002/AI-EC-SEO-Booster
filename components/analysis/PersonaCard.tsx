import React from 'react';
import type { BuyerPersona } from '../../types';
import { Tag } from '../common/Tag';

interface PersonaCardProps {
  persona: BuyerPersona;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona }) => (
  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3">
    <h4 className="text-xl font-bold text-brand-secondary">{persona.personaName}</h4>
    <p className="text-sm font-medium bg-slate-700 p-2 rounded">{persona.demographics}</p>
    <div>
      <h5 className="font-semibold text-brand-light">興趣</h5>
      <p className="text-sm text-text-secondary">{persona.interests.join(', ')}</p>
    </div>
    <div>
      <h5 className="font-semibold text-brand-light">痛點</h5>
      <ul className="list-disc list-inside text-sm text-text-secondary">
        {persona.painPoints.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </div>
    <div>
      <h5 className="font-semibold text-brand-light">他們會搜尋的關鍵字</h5>
      <div className="flex flex-wrap pt-2">
        {persona.keywords.map((keyword, i) => <Tag key={i}>{keyword}</Tag>)}
      </div>
    </div>
  </div>
);

