'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Sparkline from '@/components/charts/Sparkline';

export default function StatCard({ label, value, change, trending, color, sparkData, icon }) {
  const up = trending === 'up';

  return (
    <div className="group relative overflow-hidden rounded-2xl p-4 border transition-all duration-300 bg-[rgba(15,23,42,0.45)] backdrop-blur-2xl border-slate-800/40 hover:border-slate-700/50">
      {/* Ambient glow */}
      <div
        className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-[0.06] group-hover:opacity-[0.1] transition-opacity"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
      />

      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-2">
            {label}
          </p>
          <p
            className="text-[24px] sm:text-[28px] font-bold text-white leading-none mb-1.5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {value}
          </p>
          <span className={cn(
            'inline-flex items-center gap-[3px] text-[10px] font-bold px-1.5 py-0.5 rounded-md',
            up ? 'text-emerald-400 bg-emerald-500/8' : 'text-amber-300 bg-amber-500/8'
          )}>
            {up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
            {change}
          </span>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {icon && (
            <div
              className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center"
              style={{ background: `${color}0F`, border: `1px solid ${color}18` }}
            >
              <span style={{ color }}>{icon}</span>
            </div>
          )}
          {sparkData && <Sparkline data={sparkData} color={color} height={26} />}
        </div>
      </div>
    </div>
  );
}
