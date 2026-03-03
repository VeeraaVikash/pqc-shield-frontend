'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PageHeader, Card, Badge, StatusDot, DataTable, FilterTabs, ProgressBar } from '@/components/ui';
import { INVENTORY_ASSETS, INVENTORY_SUMMARY } from '@/constants';
import { getAlgoBadgeVariant } from '@/lib/utils';

export default function InventoryPage() {
  const [filterIdx, setFilterIdx] = useState(0);

  const columns = [
    { key: 'id', label: 'ID', mono: true },
    { key: 'name', label: 'Hostname', mono: true },
    { key: 'type', label: 'Type' },
    { label: 'Algorithm', mono: true, render: (row) => <Badge variant={getAlgoBadgeVariant(row.algo)}>{row.algo}</Badge> },
    { label: 'Status', render: (row) => <span className="flex items-center gap-1.5"><StatusDot status={row.status} />{row.status}</span> },
    { key: 'expiry', label: 'Cert Expiry', mono: true, render: (row) => (
      <span className={row.expiry === '2026-02-22' ? 'text-red-400' : 'text-slate-400'}>{row.expiry}</span>
    )},
    { label: 'PQC Readiness', render: (row) => (
      <div className="flex items-center gap-2 min-w-[120px]">
        <ProgressBar value={row.readiness} color={row.readiness >= 90 ? '#22c55e' : row.readiness >= 50 ? '#fbbf24' : '#ef4444'} height={5} />
        <span className="text-[11px] text-slate-400 font-mono min-w-[32px]">{row.readiness}%</span>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Inventory & Readiness"
        subtitle="PQC migration status across all managed endpoints"
        actions={
          <>
            <button className="px-3 py-1.5 rounded-lg border border-sky-400/30 bg-sky-400/8 text-sky-400 text-[11px] font-semibold flex items-center gap-1.5 hover:bg-sky-400/15 transition-colors">
              <RefreshCw size={13} /> Sync Now
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-700/50 text-slate-400 text-[11px] font-semibold hover:text-slate-300 transition-colors">
              Export CSV
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {INVENTORY_SUMMARY.map((c, i) => (
          <Card key={i}>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">{c.label}</p>
            <p className="text-xl sm:text-2xl font-bold mt-1" style={{ fontFamily: 'var(--font-display)', color: c.color }}>{c.value}</p>
            <p className="text-[11px] text-slate-500">{c.sub}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Endpoint Inventory</h3>
          <FilterTabs tabs={['All', 'PQC Ready', 'Hybrid', 'Legacy']} activeIdx={filterIdx} onChange={setFilterIdx} />
        </div>
        <DataTable columns={columns} data={INVENTORY_ASSETS} />
      </Card>
    </div>
  );
}
