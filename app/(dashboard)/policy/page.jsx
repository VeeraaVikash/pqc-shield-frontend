'use client';
import { api } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';
import ProgressBar from '@/components/ui/ProgressBar';
import LoadingState from '@/components/ui/LoadingState';
import { Play } from 'lucide-react';
export default function PolicyPage() {
  const {data:c, loading, refetch} = useAPI(()=>api.getPolicyCoverage('pqc-tls-mandate'), 10000);
  if (loading && !c) return <LoadingState label="Loading policies..."/>;
  const p=c||{};
  const handleRollout = async()=>{ await api.rolloutPolicy('pqc-tls-mandate',90); refetch(); };
  return (<>
    <PageHeader title="Policy Engine" subtitle="Enforcement rules">
      <button onClick={handleRollout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-semibold hover:bg-violet-500/20"><Play size={12}/>Rollout 90%</button>
    </PageHeader>
    <Card title="Policy Coverage">
      <div className="py-4 space-y-4">
        <div className="flex justify-between text-sm"><span className="text-slate-400">Policy</span><span className="text-white font-mono">{p.policy||'N/A'}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-400">Target</span><span className="text-white">{p.target_group||'N/A'}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-400">Compliant</span><span className="text-emerald-400 font-bold">{p.compliant_assets||0} / {p.total_assets||0}</span></div>
        <ProgressBar value={p.coverage_percent||0} max={100} color="#a78bfa" label="Coverage" />
      </div>
    </Card>
  </>);
}
