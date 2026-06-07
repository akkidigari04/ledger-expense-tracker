import React from 'react';
import { CATEGORY_COLORS, CATEGORY_DOT } from '../../utils/format';

export default function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center gap-1.5 badge bg-sand/60 text-ink/70">
      <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOT[category] || 'bg-slate-400'}`} />
      {category}
    </span>
  );
}
