'use client';

import { PageHeader, Card, Badge, StatusDot, DataTable } from '@/components/ui';
import { CRYPTO_KEYS, KEY_SUMMARY } from '@/constants';
import { getAlgoBadgeVariant } from '@/lib/utils';

export default function KeyManagementPage() {
  const columns = [
    { key: 'id', label: 'Key ID', mono: true },
    { label: 'Type', render: (r) => <Badge variant={r.type === 'KEM' ? 'info' : 'pqc'}>{r.type}</Badge> },
    { label: 'Algorithm', mono: true, render: (r) => <Badge variant={getAlgoBadgeVariant(r.algo)}>{r.algo}</Badge> },
    { key: 'usage', label: 'Usage' },
    { key: 'created', label: 'Created', mono: true },
    { key: 'expires', label: 'Expires', mono: true, render: (r) => (
      <span className={r.expires < '2026-07-01' ? 'text-amber-300' : 'text-slate-400'}>{r.expires}</span>
    )},
    { key: 'rotations', label: 'Rotations', mono: true },
    { label: 'Status', render: (r) => <span className="flex items-center gap-1.5"><StatusDot status={r.status} />{r.status}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Key Management"
        subtitle="Cryptographic key lifecycle, generation, storage, and rotation"
        actions={
          <button className="px-4 py-2 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-white text-[11px] font-semibold hover:opacity-90 transition-opacity">
            + Generate Key Pair
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {KEY_SUMMARY.map((s, i) => (
          <Card key={i}>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">{s.label}</p>
            <p className="text-xl sm:text-2xl font-bold mt-1" style={{ fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Key Inventory</h3>
        <DataTable columns={columns} data={CRYPTO_KEYS} />
      </Card>
    </div>
  );
}
