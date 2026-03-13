'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/constants/navigation';
import { BookOpen, LogOut, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <nav className={cn(
      'h-screen flex flex-col border-r border-slate-800/50 bg-[rgba(8,12,30,0.96)] backdrop-blur-2xl transition-all duration-300 flex-shrink-0',
      collapsed ? 'w-[64px]' : 'w-[220px]',
      'max-md:hidden'
    )}>
      {/* Brand — logo links home, collapse is separate */}
      <div className={cn(
        'flex items-center border-b border-slate-800/50',
        collapsed ? 'px-3 py-5 justify-center' : 'px-4 py-5 gap-2.5'
      )}>
        <Link href="/" className="flex items-center gap-2.5 no-underline flex-1 min-w-0">
          <div className="w-[34px] h-[34px] rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-600 to-cyan-500 flex-shrink-0 shadow-lg shadow-violet-500/10">
            <span className="text-sm font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>PQ</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-100 tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>Quansec's PQC</p>
              <p className="text-[10px] text-slate-600 font-mono mt-0.5">v1.0-mvp</p>
            </div>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-slate-600 hover:text-slate-400 transition-colors p-1 rounded-md hover:bg-slate-800/40 flex-shrink-0"
          >
            <ChevronsLeft size={14} />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="px-2 pt-3">
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex justify-center py-2 text-slate-600 hover:text-slate-400 rounded-lg hover:bg-slate-800/40 transition-colors"
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-2 scrollbar-none">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                'w-full flex items-center gap-2.5 rounded-xl mb-0.5 transition-all no-underline group',
                collapsed ? 'px-3 py-2.5 justify-center' : 'px-3 py-2',
                isActive
                  ? 'bg-sky-400/10 text-sky-400 shadow-sm shadow-sky-500/[0.05]'
                  : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-300'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-[13px] font-medium whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}

        {/* Docs link */}
        <div className="mt-3 pt-3 border-t border-slate-800/40">
          <Link
            href="/docs"
            className={cn(
              'w-full flex items-center gap-2.5 rounded-xl transition-all no-underline',
              collapsed ? 'px-3 py-2.5 justify-center' : 'px-3 py-2',
              pathname?.startsWith('/docs')
                ? 'bg-violet-500/10 text-violet-400'
                : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-400'
            )}
            title={collapsed ? 'Documentation' : undefined}
          >
            <BookOpen size={17} className="flex-shrink-0" />
            {!collapsed && <span className="text-[13px] font-medium">Documentation</span>}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className={cn('border-t border-slate-800/40', collapsed ? 'px-2 py-3' : 'px-4 py-3.5')}>
        <Link
          href="/login"
          className={cn(
            'flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors no-underline mb-2',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={14} />
          {!collapsed && <span className="text-[11px]">Sign Out</span>}
        </Link>
        {!collapsed && (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] text-slate-500">System Operational</span>
          </div>
        )}
      </div>
    </nav>
  );
}
