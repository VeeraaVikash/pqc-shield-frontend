'use client';
import { useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import LoadingState from '@/components/ui/LoadingState';
import ToastContainer, { useToast } from '@/components/ui/Toast';
import { RotateCcw } from 'lucide-react';

export default function KeysPage() {
  const { data: metrics } = useAPI(api.getKeyMetrics, 10000);
  const { data: keys, loading, refetch } = useAPI(api.getKeys, 10000);
  const { toasts, addToast, removeToast } = useToast();
  const prevRotationsRef = useRef({});

  // Detect auto-rotations by comparing rotation counts
  useEffect(() => {
    if (!keys || keys.length === 0) return;
    const prev = prevRotationsRef.current;
    keys.forEach(k => {
      if (prev[k.id] !== undefined && k.rotations > prev[k.id]) {
        addToast(`🔑 Key "${k.id}" auto-rotated (count: ${k.rotations})`, 'key', 5000);
      }
      prev[k.id] = k.rotations;
    });
  }, [keys, addToast]);

  if (loading && !metrics) return <LoadingState label="Loading key vault..." />;
  const m = metrics || {};
  const sp = [30, 31, 32, 33, 34, 34, 34, 34, 34, 34, 34, 34];
  const stats = [
    { label: 'Total Keys', value: m.total_keys || 0, color: '#e2e8f0', sparkData: sp },
    { label: 'PQC Keys', value: m.pqc_keys || 0, color: '#a78bfa', sparkData: sp },
    { label: 'Classical', value: m.classical_keys || 0, color: '#fbbf24', sparkData: sp },
    { label: 'Expiring Soon', value: m.expiring_soon || 0, color: '#ef4444', sparkData: sp },
  ];
  const handleRotate = async (keyId) => {
    await api.rotateKey(keyId);
    addToast(`✅ Key "${keyId}" manually rotated`, 'success');
    refetch();
  };
  const cols = [
    { key: 'id', label: 'Key ID', mono: true },
    { key: 'type', label: 'Type', render: r => <Badge variant={r.type === 'KEM' ? 'info' : 'default'}>{r.type}</Badge> },
    { key: 'algorithm', label: 'Algorithm', mono: true },
    { key: 'usage', label: 'Usage' },
    { key: 'rotations', label: 'Rotations', render: r => <span className="font-mono text-violet-400 font-bold">{r.rotations}</span> },
    { key: 'auto_rotate', label: 'Auto', render: r => <span className={r.auto_rotate ? 'text-emerald-400' : 'text-slate-500'}>{r.auto_rotate ? 'ON' : 'OFF'}</span> },
    { key: 'status', label: 'Status', render: r => <Badge variant={r.status === 'active' ? 'success' : r.status === 'warning' ? 'warning' : 'critical'}>{r.status}</Badge> },
    { key: 'expires', label: 'Expires' },
    { key: '_action', label: '', render: r => <button onClick={() => handleRotate(r.id)} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-sky-400 hover:bg-sky-500/10 border border-sky-500/20" title="Rotate key"><RotateCcw size={10} />Rotate</button> },
  ];
  return (<>
    <ToastContainer toasts={toasts} removeToast={removeToast} />
    <PageHeader title="Key Vault" subtitle="PQC key lifecycle management">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✓ Live DB</span>
    </PageHeader>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">{stats.map((s, i) => <StatCard key={i} {...s} />)}</div>
    <Card title={'Keys (' + ((keys || []).length) + ')'}>
      {keys && keys.length > 0 ? <DataTable columns={cols} data={keys} /> : <p className="text-slate-500 text-sm py-4">No keys in vault. Backend will seed keys on startup.</p>}
    </Card>
    <div className="mt-2 text-[10px] text-slate-600 text-center">Data from SQLite &middot; Refresh 10s &middot; Watch DEMO-KEY-LIVE for auto-rotation toast</div>
  </>);
}
