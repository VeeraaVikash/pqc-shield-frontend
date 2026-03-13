'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';
import ProgressBar from '@/components/ui/ProgressBar';
import LoadingState from '@/components/ui/LoadingState';
import ToastContainer, { useToast } from '@/components/ui/Toast';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { Play, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PolicyPage() {
  const { data: c, loading, refetch } = useAPI(() => api.getPolicyCoverage('pqc-tls-mandate'), 10000);
  const [rolling, setRolling] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  if (loading && !c) return <LoadingState label="Loading policies..." />;
  const p = c || {};

  const handleRollout = async () => {
    setRolling(true);
    addToast('🚀 Policy rollout initiated...', 'info', 3000);
    await api.rolloutPolicy('pqc-tls-mandate', 90);
    addToast('✅ Policy rolled out to 90% of assets', 'success', 5000);
    refetch();
    setTimeout(() => setRolling(false), 2000);
  };

  return (<>
    <ToastContainer toasts={toasts} removeToast={removeToast} />
    <PageHeader title="Policy Engine" subtitle="Enforcement rules">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✓ Live DB</span>
        <button
          onClick={handleRollout}
          disabled={rolling}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300 ${rolling
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-wait'
              : 'bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20'
            }`}
        >
          {rolling ? <><CheckCircle size={12} className="animate-spin" />Rolling out...</> : <><Play size={12} />Rollout 90%</>}
        </button>
      </div>
    </PageHeader>
    <Card title="Policy Coverage">
      <div className="py-4 space-y-4">
        <div className="flex justify-between text-sm"><span className="text-slate-400">Policy</span><span className="text-white font-mono">{p.policy || 'N/A'}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-400">Target</span><span className="text-white">{p.target_group || 'N/A'}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-400">Required Algorithm</span><span className="text-violet-400 font-mono">{p.required_algorithm || 'Kyber768'}</span></div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Compliant</span>
          <span className="text-emerald-400 font-bold">
            <AnimatedNumber value={p.compliant_assets || 0} /> / {p.total_assets || 0}
          </span>
        </div>
        <ProgressBar value={p.coverage_percent || 0} max={100} color="#a78bfa" label="Coverage" />
        <div className="text-center text-2xl font-bold text-white mt-2">
          <AnimatedNumber value={p.coverage_percent || 0} decimals={1} suffix="%" />
        </div>
      </div>
    </Card>

    {/* Links to related pages */}
    <div className="mt-4 grid grid-cols-2 gap-3">
      <Link href="/inventory" className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-raised border border-slate-800 hover:border-slate-700 transition-colors no-underline group">
        <div>
          <div className="text-xs text-slate-500">View Assets</div>
          <div className="text-sm text-white font-medium">Inventory</div>
        </div>
        <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
      </Link>
      <Link href="/audit" className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-raised border border-slate-800 hover:border-slate-700 transition-colors no-underline group">
        <div>
          <div className="text-xs text-slate-500">View Events</div>
          <div className="text-sm text-white font-medium">Audit Trail</div>
        </div>
        <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
      </Link>
    </div>
  </>);
}
