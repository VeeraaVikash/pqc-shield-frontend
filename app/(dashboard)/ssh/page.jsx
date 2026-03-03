'use client';

import { PageHeader, Card, Badge, StatusDot, DataTable } from '@/components/ui';
import { SSH_BASTIONS, SSH_SESSIONS } from '@/constants';
import { getAlgoBadgeVariant } from '@/lib/utils';

export default function SSHPage() {
  const sessionColumns = [
    { key: 'user', label: 'User', mono: true },
    { key: 'bastion', label: 'Bastion', mono: true },
    { key: 'target', label: 'Target Host', mono: true },
    { label: 'Algorithm', render: (r) => <Badge variant={getAlgoBadgeVariant(r.algo)}>{r.algo}</Badge> },
    { key: 'duration', label: 'Duration', mono: true },
    { label: 'Status', render: (r) => <span className="flex items-center gap-1.5"><StatusDot status={r.status} />{r.status}</span> },
  ];

  return (
    <div>
      <PageHeader title="SSH Integration" subtitle="Agent/bastion model with PQC-secured SSH authentication" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {SSH_BASTIONS.map((b) => (
          <Card key={b.id} hoverable>
            <div className="flex items-center gap-2 mb-3">
              <StatusDot status={b.status} />
              <span className="text-[12px] font-semibold text-slate-200 font-mono">{b.id}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono break-all mb-2">{b.host}</p>
            {[
              ['Region', b.region],
              ['Sessions', b.sessions],
              ['Uptime', b.uptime],
            ].map(([label, val], i) => (
              <div key={i} className="flex justify-between py-0.5">
                <span className="text-[11px] text-slate-500">{label}</span>
                <span className={`text-[11px] font-mono ${label === 'Sessions' ? 'text-sky-400 font-semibold' : label === 'Uptime' ? 'text-green-400 font-semibold' : 'text-slate-400'}`}>
                  {val}
                </span>
              </div>
            ))}
            <div className="flex justify-between py-0.5 mt-0.5">
              <span className="text-[11px] text-slate-500">Algorithm</span>
              <Badge variant={getAlgoBadgeVariant(b.algo)}>{b.algo}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Active SSH Sessions</h3>
        <DataTable columns={sessionColumns} data={SSH_SESSIONS} />
      </Card>
    </div>
  );
}
