'use client';
import { api } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import LoadingState from '@/components/ui/LoadingState';
export default function InventoryPage() {
  const { data: ov } = useAPI(api.getInventoryOverview, 10000);
  const { data: assets, loading } = useAPI(api.getInventoryAssets, 10000);
  if (loading && !ov) return <LoadingState label="Loading inventory..." />;
  const o = ov || {}, sp = [40, 42, 44, 46, 48, 50, 50, 50, 50, 50, 50, 50];
  const stats = [{ label: 'Total', value: o.total_assets || 0, color: '#e2e8f0', sparkData: sp }, { label: 'PQC Ready', value: o.pqc_ready || 0, color: '#22c55e', sparkData: sp }, { label: 'Hybrid', value: o.hybrid || 0, color: '#fbbf24', sparkData: sp }, { label: 'Legacy', value: o.legacy || 0, color: '#ef4444', sparkData: sp }];
  const cols = [{ key: 'hostname', label: 'Host', mono: true }, { key: 'type', label: 'Type' }, { key: 'algorithm', label: 'Algorithm', mono: true }, { key: 'status', label: 'Status', render: r => <Badge variant={r.status === 'active' ? 'success' : 'warning'}>{r.status}</Badge> }, { key: 'pqc_readiness', label: 'PQC %' }, { key: 'cert_expiry', label: 'Expiry' }];
  return (<>
    <PageHeader title="Asset Inventory" subtitle="Endpoint monitoring">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✓ Live DB</span>
    </PageHeader>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">{stats.map((s, i) => <StatCard key={i} {...s} />)}</div>
    <Card title="Assets">{assets ? <DataTable columns={cols} data={assets} /> : <p className="text-slate-500 py-4">No assets</p>}</Card>
  </>);
}
