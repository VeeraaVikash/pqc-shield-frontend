'use client';

import { cn } from '@/lib/utils';

export default function FilterTabs({ tabs, activeIdx = 0, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1">
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => onChange?.(i)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all whitespace-nowrap flex-shrink-0',
            i === activeIdx
              ? 'bg-sky-400/10 border-sky-400/20 text-sky-400 shadow-sm shadow-sky-500/[0.05]'
              : 'bg-transparent border-slate-800/40 text-slate-500 hover:text-slate-400 hover:border-slate-700/50',
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
