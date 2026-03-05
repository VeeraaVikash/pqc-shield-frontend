'use client';
import { api } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import DonutChart from '@/components/charts/DonutChart';
import LoadingState from '@/components/ui/LoadingState';

export default function TelemetryPage() {
    const { data: d, loading } = useAPI(api.getTelemetryMetrics, 3000);
    const { data: pipeline } = useAPI(api.getTelemetryPipeline, 5000);
    const { data: handshakes } = useAPI(api.getRecentHandshakes, 2000);

    if (loading && !d) return <LoadingState label="Loading telemetry..." />;
    if (!d) return <div className="text-slate-500 py-20 text-center">Backend not reachable. Start the backend server first.</div>;

    const perf = d.performance || {};
    const colors = ['#a78bfa', '#38bdf8', '#22c55e', '#fbbf24', '#ef4444'];
    const donut = Object.entries(d.algorithm_distribution || {}).map(([l, p], i) => ({ label: l, percentage: p, color: colors[i % 5] }));
    const sp = [100, 120, 140, 160, 180, 200, 210, 220, 230, 240, 250, 260];

    const stats = [
        { label: 'Handshakes/hr', value: d.handshakes_per_hour || 0, trending: 'up', color: '#38bdf8', sparkData: sp },
        { label: 'Active Connections', value: d.active_connections || 0, color: '#22c55e', sparkData: sp },
        { label: 'P50 Latency', value: (perf.p50_latency || 0) + 'ms', color: '#fbbf24', sparkData: sp },
        { label: 'P99 Latency', value: (perf.p99_latency || 0) + 'ms', color: '#a78bfa', sparkData: sp },
    ];

    return (<>
        <PageHeader title="Telemetry" subtitle="Real-time protocol analytics">
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] text-emerald-400">Live from DB</span>
            </div>
        </PageHeader>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">{stats.map((s, i) => <StatCard key={i} {...s} />)}</div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card title="Algorithm Distribution">
                {donut.length > 0 ? (
                    <div className="flex justify-center py-6"><DonutChart data={donut} size={160} /></div>
                ) : (
                    <div className="text-slate-500 text-sm text-center py-8">Waiting for data...</div>
                )}
            </Card>
            <Card title="Performance">
                <div className="space-y-3 py-2">
                    <div className="flex justify-between"><span className="text-sm text-slate-400">Success Rate</span><span className="text-sm font-bold text-emerald-400">{perf.success_rate || 0}%</span></div>
                    <div className="flex justify-between"><span className="text-sm text-slate-400">Failure Rate</span><span className="text-sm font-bold text-red-400">{perf.failure_rate || 0}%</span></div>
                    <div className="flex justify-between"><span className="text-sm text-slate-400">P50 Latency</span><span className="text-sm font-bold text-white">{perf.p50_latency || 0}ms</span></div>
                    <div className="flex justify-between"><span className="text-sm text-slate-400">P99 Latency</span><span className="text-sm font-bold text-white">{perf.p99_latency || 0}ms</span></div>
                </div>
            </Card>
        </div>

        {/* Handshake Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card title={`Handshake Timeline (${(d.timeline || []).length} intervals)`}>
                <div className="flex items-end gap-0.5 h-24 px-2 py-3">
                    {(d.timeline || []).map((t, i) => {
                        const max = Math.max(...(d.timeline || []).map(x => x.handshakes || 1), 1);
                        const h = Math.max(4, (t.handshakes / max) * 80);
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full bg-sky-400/30 rounded-sm relative group" style={{ height: h + 'px' }}>
                                    <div className="absolute bottom-0 left-0 right-0 bg-sky-400 rounded-sm transition-all" style={{ height: h + 'px' }} />
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[9px] text-white bg-slate-800 px-1.5 py-0.5 rounded whitespace-nowrap z-10">{t.handshakes}</div>
                                </div>
                                <span className="text-[8px] text-slate-600">{t.time}</span>
                            </div>
                        );
                    })}
                </div>
            </Card>
            <Card title="Live Handshake Feed">
                <div className="space-y-1 py-1 max-h-[160px] overflow-y-auto">
                    {(handshakes || []).slice(0, 8).map((h, i) => (
                        <div key={h.connection_id || i} className="flex items-center gap-2 py-1 border-b border-slate-800/20 last:border-0 animate-fade-in">
                            <div className={'w-1.5 h-1.5 rounded-full flex-shrink-0 ' + (h.success ? 'bg-emerald-400' : 'bg-red-400')} />
                            <span className="text-[10px] font-mono text-violet-400">{h.kem}</span>
                            <span className="text-[10px] text-slate-600">→</span>
                            <span className="text-[10px] font-mono text-sky-400">{h.signature}</span>
                            <span className="ml-auto text-[10px] text-slate-500">{h.latency_ms}ms</span>
                        </div>
                    ))}
                    {(!handshakes || handshakes.length === 0) && <p className="text-slate-500 text-sm py-4 text-center">Waiting for handshakes...</p>}
                </div>
            </Card>
        </div>

        {/* Pipeline Status */}
        <Card title="Pipeline Health">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 py-2">
                {(pipeline?.stages || []).map((stage, i) => (
                    <div key={i} className="bg-slate-800/30 rounded-lg p-3 border border-slate-800/40">
                        <div className="flex items-center gap-1.5 mb-2">
                            <div className={'w-2 h-2 rounded-full ' + (stage.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600')} />
                            <span className="text-[11px] font-semibold text-white">{stage.stage}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{stage.throughput}</div>
                        <div className="text-[10px] text-slate-600">Lag: {stage.lag}</div>
                    </div>
                ))}
            </div>
        </Card>

        <div className="mt-2 text-[10px] text-slate-600 text-center">
            Data from SQLite · Refresh 3s · {d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : 'syncing...'}
        </div>
    </>);
}
