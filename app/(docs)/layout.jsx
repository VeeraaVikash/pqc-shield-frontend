import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Documentation | PQC Shield' };

export default function DocsLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-base text-slate-200">
      <header className="border-b border-slate-800/60 bg-surface-base/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-500 hover:text-white transition-colors no-underline"><ArrowLeft size={20} /></Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                <span className="text-xs font-extrabold text-white">PQ</span>
              </div>
              <span className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>PQC Shield Docs</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="text-sm text-slate-500 hover:text-white transition-colors no-underline">Home</Link>
            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-white transition-colors no-underline">Dashboard</Link>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
