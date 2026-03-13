'use client';
import { useState, useMemo } from 'react';
import { api } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';
import LoadingState from '@/components/ui/LoadingState';
import { Search, Download, Filter } from 'lucide-react';

export default function AuditPage() {
  const { data: logs, loading } = useAPI(api.getAuditLogs, 8000);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Get unique event types for filter dropdown
  const eventTypes = useMemo(() => {
    if (!logs) return [];
    const types = [...new Set(logs.map(l => l.event_type))];
    return types.sort();
  }, [logs]);

  // Filter logs based on search and type
  const filtered = useMemo(() => {
    if (!logs) return [];
    return logs.filter(l => {
      const matchesSearch = !search ||
        l.event_type?.toLowerCase().includes(search.toLowerCase()) ||
        l.description?.toLowerCase().includes(search.toLowerCase()) ||
        l.actor?.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'ALL' || l.event_type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [logs, search, typeFilter]);

  // Export to CSV
  const exportCSV = () => {
    if (!filtered || filtered.length === 0) return;
    const header = 'Timestamp,Severity,Event Type,Actor,Description\n';
    const rows = filtered.map(l =>
      `"${l.timestamp || ''}","${l.severity}","${l.event_type}","${l.actor || ''}","${(l.description || '').replace(/"/g, '""')}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `pqc-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  if (loading && !logs) return <LoadingState label="Loading audit..." />;
  const sv = s => s === 'CRITICAL' ? 'critical' : s === 'WARNING' ? 'warning' : 'info';

  return (<>
    <PageHeader title="Audit Trail" subtitle="System event log">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✓ Live DB</span>
        <button onClick={exportCSV} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-semibold hover:bg-sky-500/20 transition-colors">
          <Download size={11} />Export CSV
        </button>
      </div>
    </PageHeader>

    {/* Search & Filter Bar */}
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search events, descriptions, actors..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-surface-raised border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition-colors"
        />
      </div>
      <div className="flex items-center gap-1.5">
        <Filter size={12} className="text-slate-500" />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="bg-surface-raised border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500/50"
        >
          <option value="ALL">All Events</option>
          {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
    </div>

    <Card title={`Events (${filtered.length}${typeFilter !== 'ALL' || search ? ` of ${(logs || []).length}` : ''})`}>
      <div className="space-y-2.5 py-1 max-h-[600px] overflow-y-auto">
        {filtered.map((l, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-800/25 last:border-0 animate-fade-in">
            <Badge variant={sv(l.severity)}>{l.severity}</Badge>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-white">{l.event_type}</span>
                <span className="text-[11px] text-slate-500">{l.actor}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{l.description}</div>
            </div>
            <div className="text-[10px] text-slate-600 whitespace-nowrap">{l.timestamp ? new Date(l.timestamp).toLocaleTimeString() : ''}</div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-slate-500 text-sm text-center py-4">{search || typeFilter !== 'ALL' ? 'No matching events' : 'No logs yet'}</div>}
      </div>
    </Card>
  </>);
}
