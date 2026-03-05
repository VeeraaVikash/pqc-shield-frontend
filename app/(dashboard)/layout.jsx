'use client';
import { useMemo } from 'react';
import { useAuth } from '@/lib/auth';
import { useWebSocket } from '@/lib/useWebSocket';
import { getWebSocketURL } from '@/lib/api';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import ConnectionStatus from '@/components/ui/ConnectionStatus';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const wsUrl = useMemo(() => getWebSocketURL(), []);
  const { status: wsStatus, connectionInfo } = useWebSocket(wsUrl);

  if (loading) return (
    <div className="flex h-screen bg-surface-base items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center animate-pulse">
          <span className="text-sm font-extrabold text-white">PQ</span>
        </div>
        <div className="text-slate-500 text-sm">Initializing PQC Shield...</div>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="flex h-screen bg-surface-base text-slate-200 font-body overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-7 pb-20 md:pb-7 relative">
        <div className="grid-bg fixed inset-0 pointer-events-none z-0" />
        <div className="fixed -top-48 -right-48 w-[600px] h-[600px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent 70%)' }} />

        {/* Global live status bar */}
        <div className="relative z-20 flex items-center justify-end mb-1 -mt-1">
          <ConnectionStatus status={wsStatus} info={connectionInfo} />
        </div>

        <div className="relative z-10 max-w-[1200px] animate-fade-in">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
