'use client';

import { ShieldCheck, ChevronRight } from 'lucide-react';
import { PageHeader, Card, Badge, ProgressBar } from '@/components/ui';
import { POLICIES, POLICY_SCHEMA_EXAMPLE } from '@/constants';

export default function PolicyPage() {
  return (
    <div>
      <PageHeader
        title="Policy Engine"
        subtitle="Centralized PQC algorithm enforcement and rollout controls"
        actions={
          <button className="px-4 py-2 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 text-white text-[11px] font-semibold hover:opacity-90 transition-opacity">
            + Create Policy
          </button>
        }
      />

      <div className="flex flex-col gap-3">
        {POLICIES.map((p) => (
          <Card key={p.id} hoverable>
            {/* Mobile: stack vertically */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center border flex-shrink-0 ${
                  p.status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  <ShieldCheck size={17} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-semibold text-slate-200 font-mono">{p.name}</span>
                    <Badge variant={p.status === 'active' ? 'success' : 'warning'}>{p.status.toUpperCase()}</Badge>
                    <Badge>{p.scope}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{p.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-5 pl-12 sm:pl-0">
                <div className="flex-1 sm:w-[120px]">
                  <p className="text-[10px] text-slate-500 mb-1">Coverage</p>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={p.coverage} color={p.coverage >= 90 ? '#22c55e' : '#fbbf24'} height={5} />
                    <span className="text-[11px] font-semibold text-slate-200 font-mono">{p.coverage}%</span>
                  </div>
                </div>
                <ChevronRight size={15} className="text-slate-600 flex-shrink-0" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Policy Rule Schema</h3>
        <div className="bg-surface-base/60 rounded-lg p-4 border border-slate-800/40 overflow-x-auto">
          <pre className="text-[11px] text-slate-400 font-mono leading-relaxed m-0 whitespace-pre">{POLICY_SCHEMA_EXAMPLE}</pre>
        </div>
      </Card>
    </div>
  );
}
