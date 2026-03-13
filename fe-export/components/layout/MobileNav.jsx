'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Server, ShieldCheck, BarChart3, Menu, X, BookOpen, LogOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/constants/navigation';

const QUICK_TABS = [
  { path: '/dashboard', icon: Activity, label: 'Home' },
  { path: '/inventory', icon: Server, label: 'Assets' },
  { path: '/policy', icon: ShieldCheck, label: 'Policy' },
  { path: '/telemetry', icon: BarChart3, label: 'Metrics' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Bottom Tab Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[rgba(8,12,30,0.96)] backdrop-blur-2xl border-t border-slate-800/50 px-1 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around py-1.5">
          {QUICK_TABS.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all no-underline min-w-[52px]',
                  isActive
                    ? 'text-sky-400'
                    : 'text-slate-500 active:text-slate-300'
                )}
              >
                <div className={cn(
                  'p-1 rounded-lg transition-colors',
                  isActive && 'bg-sky-400/10'
                )}>
                  <Icon size={19} />
                </div>
                <span className={cn('text-[9px] font-semibold', isActive && 'text-sky-400')}>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-slate-500 active:text-slate-300 min-w-[52px]"
          >
            <div className="p-1"><Menu size={19} /></div>
            <span className="text-[9px] font-semibold">More</span>
          </button>
        </div>
      </div>

      {/* ── Full Menu Overlay ── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[100] bg-[rgba(2,6,23,0.97)] backdrop-blur-2xl animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-slate-800/50">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5 no-underline">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/10">
                <span className="text-xs font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>PQ</span>
              </div>
              <div>
                <span className="text-sm font-bold text-slate-100 block" style={{ fontFamily: 'var(--font-display)' }}>Quansec's PQC</span>
                <span className="text-[10px] text-slate-600 font-mono">v1.0-mvp</span>
              </div>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 p-2.5 rounded-xl hover:bg-slate-800/40 transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav Items */}
          <div className="p-3 space-y-0.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all no-underline',
                    isActive
                      ? 'bg-sky-400/10 text-sky-400'
                      : 'text-slate-400 active:bg-slate-800/40'
                  )}
                >
                  <Icon size={20} />
                  <span className="text-[15px] font-medium">{item.label}</span>
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400" />}
                </Link>
              );
            })}

            {/* Docs */}
            <div className="pt-2 mt-2 border-t border-slate-800/40">
              <Link
                href="/docs"
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all no-underline',
                  pathname?.startsWith('/docs')
                    ? 'bg-violet-500/10 text-violet-400'
                    : 'text-slate-400 active:bg-slate-800/40'
                )}
              >
                <BookOpen size={20} />
                <span className="text-[15px] font-medium">Documentation</span>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800/40 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-slate-500 no-underline active:text-slate-300"
              >
                <LogOut size={16} />
                <span className="text-[13px] font-medium">Sign Out</span>
              </Link>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] text-slate-500">Operational</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
