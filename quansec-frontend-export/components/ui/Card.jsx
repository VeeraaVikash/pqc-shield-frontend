'use client';

import { cn } from '@/lib/utils';

export default function Card({ children, hoverable = false, className = '', onClick, ...rest }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border p-4 sm:p-5 transition-all duration-300',
        'bg-[rgba(15,23,42,0.45)] backdrop-blur-2xl',
        'border-slate-800/40',
        hoverable && 'hover:border-slate-700/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/[0.03]',
        onClick && 'cursor-pointer',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
