import { cn } from '@/lib/utils';

const VARIANTS = {
  default: 'bg-slate-500/10 text-slate-400 border-slate-500/12',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/12',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/12',
  danger:  'bg-red-500/10 text-red-400 border-red-500/12',
  info:    'bg-sky-400/10 text-sky-400 border-sky-400/12',
  pqc:     'bg-violet-500/10 text-violet-400 border-violet-500/15',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-[3px] rounded-md',
      'text-[10px] font-semibold font-mono tracking-wide border',
      'transition-colors',
      VARIANTS[variant] || VARIANTS.default,
      className,
    )}>
      {children}
    </span>
  );
}
