'use client';
import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import LoadingState from '@/components/ui/LoadingState';
import DonutChart from '@/components/charts/DonutChart';

/* ── Animated counter ── */
function AnimNum({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const n = typeof value === 'number' ? value : parseFloat(value) || 0;
    const start = display;
    const diff = n - start;
    if (Math.abs(diff) < 0.01) { setDisplay(n); return; }
    let frame;
    const duration = 600;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      setDisplay(start + diff * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  const isInt = Number.isInteger(typeof value === 'number' ? value : parseFloat(value));
  return <>{isInt ? Math.round(display) : display.toFixed(2)}{suffix}</>;
}

/* ── Mini bar chart (pure SVG) ── */
function BarChart({ data = [], height = 100, color = '#38bdf8' }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  const barW = Math.max(2, (100 / data.length) - 1);
  return (
    <div className="relative" style={{ height }}>
      <svg width="100%" height={height} viewBox={`0 0 ${data.length * (barW + 1)} ${height}`} preserveAspectRatio="none">
        {data.map((d, i) => {
          const h = Math.max(2, (d.value / max) * (height - 20));
          return (
            <g key={i}>
              <rect x={i * (barW + 1)} y={height - h} width={barW} height={h} rx={1}
                fill={color} opacity={0.3} />
              <rect x={i * (barW + 1)} y={height - h} width={barW} height={h} rx={1}
                fill={color} style={{ transition: 'height 0.5s ease, y 0.5s ease' }} />
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-0.5">
        {data.filter((_, i) => i % 3 === 0).map((d, i) => (
          <span key={i} className="text-[7px] text-slate-600">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Latency sparkline (pure SVG) ── */
function LatencyLine({ data = [], height = 60, color = '#a78bfa' }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 200;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 10)}`).join(' ');
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${w},${height}`} fill="url(#latGrad)" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.length > 0 && (
        <circle cx={w} cy={height - ((data[data.length - 1] - min) / range) * (height - 10)} r="3" fill={color}>
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}

/* ── Live handshake feed item ── */
function HandshakeEntry({ h, isNew }) {
  return (
    <div className={`flex items-center gap-2 py-1.5 border-b border-slate-800/30 last:border-0 ${isNew ? 'animate-fade-in' : ''}`}>
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${h.success ? 'bg-emerald-400' : 'bg-red-400'}`}>
        {h.success && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-40" />}
      </div>
      <span className="text-[10px] text-slate-500 w-16 flex-shrink-0">
        {h.timestamp ? new Date(h.timestamp).toLocaleTimeString() : '—'}
      </span>
      <span className="text-[11px] font-mono text-violet-400">{h.kem}</span>
      <span className="text-[10px] text-slate-600">→</span>
      <span className="text-[11px] font-mono text-sky-400">{h.signature}</span>
      {h.fallback && <Badge variant="warning">fallback</Badge>}
      <span className="ml-auto text-[11px] font-mono text-white">{h.latency_ms}ms</span>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN TLS PAGE
   ════════════════════════════════════════════════ */
export default function TLSPage() {
  const { data: metrics, loading: mLoading } = useAPI(api.getTelemetryMetrics, 2000);
  const { data: conns } = useAPI(api.getTLSConnections, 3000);
  const { data: handshakes } = useAPI(api.getRecentHandshakes, 1500);
  const { data: pipeline } = useAPI(api.getTelemetryPipeline, 5000);

  // Track latency history for the line chart
  const [latencyHistory, setLatencyHistory] = useState([]);
  const prevTimestamp = useRef(null);

  useEffect(() => {
    if (!metrics?.performance?.p50_latency) return;
    const ts = metrics.timestamp;
    if (ts === prevTimestamp.current) return;
    prevTimestamp.current = ts;
    setLatencyHistory(prev => [...prev.slice(-29), metrics.performance.p50_latency]);
  }, [metrics]);

  if (mLoading && !metrics) return <LoadingState label="Loading TLS analytics..." />;
  if (!metrics) return <div className="text-slate-500 py-20 text-center">Backend not reachable. Start the backend first.</div>;

  const perf = metrics.performance || {};
  const hs = metrics.handshakes || {};
  const modes = metrics.connection_modes || {};
  const timeline = (metrics.timeline || []).map(t => ({ label: t.time, value: t.handshakes }));
  const kemAlgos = metrics.kem_algorithms || {};

  // Stat cards
  const stats = [
    { label: 'Handshakes/hr', value: hs.per_hour || 0, trending: 'up', color: '#38bdf8', sparkData: timeline.map(t => t.value) },
    { label: 'Active Conns', value: metrics.active_connections || 0, color: '#22c55e', sparkData: timeline.map(t => t.value) },
    { label: 'P50 Latency', value: (perf.p50_latency || 0) + 'ms', color: '#a78bfa', sparkData: timeline.map(t => t.value) },
    { label: 'P99 Latency', value: (perf.p99_latency || 0) + 'ms', color: '#fbbf24', sparkData: timeline.map(t => t.value) },
    { label: 'Success Rate', value: (perf.success_rate || 0) + '%', color: '#22c55e', sparkData: timeline.map(t => t.value) },
    { label: 'Fallback Rate', value: (hs.fallback_rate || 0) + '%', color: '#ef4444', sparkData: timeline.map(t => t.value) },
  ];

  // Mode donut segments
  const modeSegments = [
    { value: modes['PQC-Only'] || 0, color: '#22c55e' },
    { value: modes['Hybrid'] || 0, color: '#fbbf24' },
    { value: modes['Classic'] || 0, color: '#ef4444' },
  ];

  // KEM donut segments
  const kemColors = { 'Kyber768': '#a78bfa', 'Kyber768+X25519': '#38bdf8', 'Classic': '#ef4444' };
  const kemSegments = Object.entries(kemAlgos).map(([k, v]) => ({ value: v, color: kemColors[k] || '#64748b' }));

  const connCols = [
    { key: 'conn_id', label: 'ID', mono: true, render: r => <span className="text-[10px]">{(r.conn_id || '').slice(0, 8)}</span> },
    { key: 'source', label: 'Source' },
    { key: 'destination', label: 'Dest' },
    { key: 'kem', label: 'KEM', mono: true },
    { key: 'signature', label: 'Sig', mono: true },
    { key: 'mode', label: 'Mode', render: r => <Badge variant={r.mode === 'PQC-Only' ? 'success' : r.mode === 'Hybrid' ? 'info' : 'warning'}>{r.mode}</Badge> },
    { key: 'latency', label: 'Latency' },
    { key: 'status', label: 'Status', render: r => <Badge variant={r.status === 'active' ? 'success' : 'warning'}>{r.status}</Badge> },
  ];

  return (<>
    {/* HEADER */}
    <PageHeader title="TLS 1.3 + PQC" subtitle="Real-time handshake analytics from SQLite">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold">Live</span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono">
          {metrics.timestamp ? new Date(metrics.timestamp).toLocaleTimeString() : '—'}
        </span>
      </div>
    </PageHeader>

    {/* STAT CARDS ROW */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((s, i) => <StatCard key={i} {...s} />)}
    </div>

    {/* ROW 2: Timeline + Mode Breakdown + KEM Breakdown */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* Handshake Timeline */}
      <Card title="Handshake Timeline (1hr)" className="lg:col-span-2">
        <div className="px-2 py-4">
          <BarChart data={timeline} height={120} color="#38bdf8" />
        </div>
        <div className="flex justify-between px-2 text-[9px] text-slate-600 -mt-1">
          <span>5-min buckets</span>
          <span>Total: <span className="text-white font-semibold">{hs.last_hour || 0}</span> handshakes</span>
        </div>
      </Card>

      {/* Mode Breakdown */}
      <Card title="Connection Modes">
        <div className="flex flex-col items-center py-4 gap-4">
          <DonutChart segments={modeSegments} size={130} />
          <div className="flex gap-4">
            {[
              { label: 'PQC-Only', color: '#22c55e', count: modes['PQC-Only'] || 0 },
              { label: 'Hybrid', color: '#fbbf24', count: modes['Hybrid'] || 0 },
              { label: 'Classic', color: '#ef4444', count: modes['Classic'] || 0 },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                <span className="text-[10px] text-slate-400">{m.label}</span>
                <span className="text-[10px] font-bold text-white">{m.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>

    {/* ROW 3: Latency Trend + Live Handshake Feed */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* Latency Trend Line */}
      <Card title="P50 Latency Trend">
        <div className="px-2 py-4">
          <LatencyLine data={latencyHistory} height={80} color="#a78bfa" />
        </div>
        <div className="flex justify-between px-2">
          <div className="flex gap-3">
            <div>
              <div className="text-[9px] text-slate-600 uppercase">Current P50</div>
              <div className="text-lg font-bold text-violet-400"><AnimNum value={perf.p50_latency || 0} suffix="ms" /></div>
            </div>
            <div>
              <div className="text-[9px] text-slate-600 uppercase">Current P99</div>
              <div className="text-lg font-bold text-amber-400"><AnimNum value={perf.p99_latency || 0} suffix="ms" /></div>
            </div>
          </div>
          <div>
            <div className="text-[9px] text-slate-600 uppercase">Samples</div>
            <div className="text-sm font-bold text-white">{latencyHistory.length}</div>
          </div>
        </div>
      </Card>

      {/* Live Handshake Feed */}
      <Card title={`Live Handshake Feed (${(handshakes || []).length})`}>
        <div className="max-h-[200px] overflow-y-auto space-y-0 py-1">
          {(handshakes || []).map((h, i) => (
            <HandshakeEntry key={h.connection_id || i} h={h} isNew={i < 3} />
          ))}
          {(!handshakes || handshakes.length === 0) && (
            <p className="text-slate-500 text-sm py-8 text-center">Waiting for handshakes...</p>
          )}
        </div>
      </Card>
    </div>

    {/* ROW 4: KEM Usage + Performance Gauges + Failure Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* KEM Algorithm Usage */}
      <Card title="KEM Algorithm Usage">
        <div className="flex flex-col items-center py-4 gap-3">
          <DonutChart segments={kemSegments} size={110} />
          <div className="space-y-1 w-full px-2">
            {Object.entries(kemAlgos).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: kemColors[k] || '#64748b' }} />
                  <span className="text-[10px] font-mono text-slate-400">{k}</span>
                </div>
                <span className="text-[10px] font-bold text-white">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Performance Gauges */}
      <Card title="Performance">
        <div className="space-y-4 py-3 px-1">
          {[
            { label: 'Success Rate', value: perf.success_rate || 0, unit: '%', color: '#22c55e' },
            { label: 'Failure Rate', value: perf.failure_rate || 0, unit: '%', color: '#ef4444' },
            { label: 'Uptime', value: perf.uptime_minutes || 0, unit: 'm', color: '#38bdf8' },
          ].map((g, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-slate-400">{g.label}</span>
                <span className="text-[11px] font-bold" style={{ color: g.color }}>{g.value}{g.unit}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{
                  width: `${g.unit === '%' ? Math.min(g.value, 100) : Math.min(g.value / 60 * 100, 100)}%`,
                  background: g.color,
                }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Failure & Fallback Stats */}
      <Card title="Failure Analysis">
        <div className="space-y-3 py-3 px-1">
          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-800/40">
            <div className="text-[9px] text-slate-600 uppercase mb-1">Failures (1hr)</div>
            <div className="text-2xl font-bold text-red-400"><AnimNum value={hs.failures_1h || 0} /></div>
            <div className="text-[10px] text-slate-500 mt-0.5">of {hs.last_hour || 0} total</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-800/40">
            <div className="text-[9px] text-slate-600 uppercase mb-1">Fallbacks (1hr)</div>
            <div className="text-2xl font-bold text-amber-400"><AnimNum value={hs.fallbacks_1h || 0} /></div>
            <div className="text-[10px] text-slate-500 mt-0.5">Rate: <span className="text-amber-400">{hs.fallback_rate || 0}%</span></div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-800/40">
            <div className="text-[9px] text-slate-600 uppercase mb-1">24h Volume</div>
            <div className="text-2xl font-bold text-sky-400"><AnimNum value={hs.last_24h || 0} /></div>
          </div>
        </div>
      </Card>
    </div>

    {/* ROW 5: Pipeline Health */}
    <Card title="Data Pipeline">
      <div className="flex items-center gap-2 py-3 px-2 overflow-x-auto">
        {(pipeline?.stages || []).map((stage, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-slate-800/40 border border-slate-800/60 rounded-xl p-3 min-w-[140px]">
              <div className="flex items-center gap-1.5 mb-2">
                <div className={`w-2 h-2 rounded-full ${stage.status === 'active' ? 'bg-emerald-400' : 'bg-slate-600'}`}>
                  {stage.status === 'active' && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-40" />}
                </div>
                <span className="text-[11px] font-semibold text-white">{stage.stage}</span>
              </div>
              <div className="text-[10px] text-sky-400 font-mono">{stage.throughput}</div>
              <div className="text-[9px] text-slate-600 mt-0.5">Lag: {stage.lag}</div>
            </div>
            {i < (pipeline?.stages || []).length - 1 && (
              <div className="text-slate-600 text-lg">→</div>
            )}
          </div>
        ))}
      </div>
    </Card>

    {/* ROW 6: Active Connections Table */}
    <div className="mt-6">
      <Card title={`Active Connections (${(conns || []).length})`}>
        {conns && conns.length > 0 ? (
          <DataTable columns={connCols} data={conns} />
        ) : (
          <p className="text-slate-500 text-sm py-8 text-center">No active connections</p>
        )}
      </Card>
    </div>

    {/* Footer */}
    <div className="mt-3 flex justify-between text-[9px] text-slate-600">
      <span>Data from SQLite · Real handshake records · Scheduler: 1 event/sec</span>
      <span>Refresh: stats 2s · connections 3s · feed 1.5s · pipeline 5s</span>
    </div>
  </>);
}
