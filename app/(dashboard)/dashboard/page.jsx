'use client';
import { useState, useEffect, useMemo } from 'react';
import { api, getWebSocketURL } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import { useWebSocket, useWebSocketMessages } from '@/lib/useWebSocket';
import { useAuth } from '@/lib/auth';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import DonutChart from '@/components/charts/DonutChart';
import LoadingState from '@/components/ui/LoadingState';
import ConnectionStatus from '@/components/ui/ConnectionStatus';
import { LogOut, Shield, Lock, Globe, Wifi, Activity, Zap, Radio } from 'lucide-react';

const PROTO_ICONS = { tls: Lock, ssh: Shield, ipsec: Globe, vpn: Wifi };
const PROTO_COLORS = { tls: '#a78bfa', ssh: '#38bdf8', ipsec: '#22c55e', vpn: '#f59e0b' };
const PROTO_LABELS = { tls: 'TLS 1.3', ssh: 'SSH', ipsec: 'IPsec', vpn: 'VPN' };

/** Animated counter that smoothly transitions between values */
function AnimatedValue({ value, suffix = '' }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (typeof value !== 'number' || isNaN(value)) { setDisplay(value); return; }
    const start = typeof display === 'number' ? display : 0;
    const diff = value - start;
    if (diff === 0) return;
    const duration = 600;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{display}{suffix}</>;
}

function ProtocolCard({ id, data, isLive }) {
  const Icon = PROTO_ICONS[id];
  const color = PROTO_COLORS[id];
  const conns = data.active_connections || data.active_sessions || data.active_tunnels || data.active_peers || 0;
  return (
    <div className="bg-surface-raised border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/60 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color + '15' }}>
            <Icon size={16} style={{ color }} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{PROTO_LABELS[id]}</div>
            <div className="text-[10px] text-slate-500">{data.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isLive && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ background: color }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: color }} />
            </span>
          )}
          <Badge variant={data.status === 'operational' ? 'success' : 'warning'}>{data.status}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div><div className="text-[10px] text-slate-500 uppercase">Active</div><div className="text-lg font-bold text-white"><AnimatedValue value={conns} /></div></div>
        <div><div className="text-[10px] text-slate-500 uppercase">Latency</div><div className="text-lg font-bold text-white">{data.avg_latency_ms}ms</div></div>
        <div><div className="text-[10px] text-slate-500 uppercase">Success</div><div className="text-lg font-bold text-emerald-400">{data.success_rate}%</div></div>
        <div><div className="text-[10px] text-slate-500 uppercase">PQC</div><div className="text-lg font-bold" style={{ color }}>{data.pqc_percentage}%</div></div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: data.pqc_percentage + '%', background: 'linear-gradient(90deg, ' + color + ', ' + color + '80)' }} />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px]">
        <span style={{ color }}>PQC {data.pqc_percentage}%</span>
        <span className="text-slate-500">Hybrid {data.hybrid_percentage}%</span>
        {data.classical_percentage > 0 && <span className="text-red-400">Classic {data.classical_percentage}%</span>}
      </div>
    </div>
  );
}

/** Live activity feed showing recent events */
function ActivityFeed({ recentHandshakes }) {
  if (!recentHandshakes || recentHandshakes.length === 0) return null;
  return (
    <Card title="Live Activity Feed">
      <div className="space-y-1.5 py-1 max-h-[260px] overflow-y-auto scrollbar-thin">
        {recentHandshakes.slice(0, 10).map((h, i) => (
          <div key={h.connection_id || i} className="flex items-center gap-2 py-1.5 border-b border-slate-800/25 last:border-0 animate-fade-in">
            <div className={'w-1.5 h-1.5 rounded-full flex-shrink-0 ' + (h.success ? 'bg-emerald-400' : 'bg-red-400')} />
            <span className="text-[10px] font-mono text-slate-500 w-16 flex-shrink-0">{h.timestamp ? new Date(h.timestamp).toLocaleTimeString() : '--'}</span>
            <span className="text-[11px] text-violet-400 font-mono flex-shrink-0">{h.kem}</span>
            <span className="text-[10px] text-slate-600">→</span>
            <span className="text-[11px] text-sky-400 font-mono">{h.signature}</span>
            <span className="ml-auto text-[10px] text-slate-500">{h.latency_ms}ms</span>
            {h.fallback && <Badge variant="warning">fallback</Badge>}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: pd, loading: l1 } = useAPI(api.getProtocolOverview, 3000);
  const { data: cd, loading: l2 } = useAPI(api.getCommandCenter, 5000);
  const { data: handshakes } = useAPI(api.getRecentHandshakes, 3000);
  const { user, logout } = useAuth();

  // WebSocket for live streaming
  const wsUrl = useMemo(() => getWebSocketURL(), []);
  const { lastMessage, status: wsStatus, connectionInfo } = useWebSocket(wsUrl);

  // Merge WebSocket data with polled data
  const protocolWS = useWebSocketMessages(lastMessage, 'protocol_update');
  const alertWS = useWebSocketMessages(lastMessage, 'alert_update');

  // Use WS data when available, fall back to polled data
  const protocols = protocolWS?.protocols || pd?.protocols || {};
  const summary = protocolWS?.summary || pd?.summary || {};
  const algoDist = protocolWS?.algorithm_distribution || pd?.algorithm_distribution || cd?.algorithm_distribution || {};

  if ((l1 || l2) && !pd && !cd) return <LoadingState label="Connecting to PQC Shield..." />;

  const p = protocols;
  const s = summary;
  const risk = cd?.risk || {};
  const alerts = alertWS || cd?.alerts_summary || {};
  const perf = cd?.performance || {};
  const colors = ['#a78bfa', '#38bdf8', '#22c55e', '#fbbf24', '#ef4444'];
  const donut = Object.entries(algoDist).map(([l, v], i) => ({ label: l, percentage: v, color: colors[i % 5] }));
  const timeline = pd?.migration_timeline || [];
  const isLive = wsStatus === 'connected';

  return (<>
    <PageHeader title="Command Center" subtitle={'Welcome, ' + (user?.name || user?.email || 'Operator')}>
      <div className="flex items-center gap-3">
        <ConnectionStatus status={wsStatus} info={connectionInfo} />
        <Badge variant="success">{s.protocols_operational || 0}/{s.protocols_total || 4} Protocols</Badge>
        <button onClick={logout} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400"><LogOut size={14} />Logout</button>
      </div>
    </PageHeader>

    {/* Top Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <StatCard label="Total Connections" value={s.total_connections || 0} color="#22c55e" sparkData={[800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350]} trending="up" />
      <StatCard label="PQC Coverage" value={(s.overall_pqc_coverage || 0) + '%'} color="#a78bfa" sparkData={[60, 62, 65, 68, 70, 72, 74, 76, 78, 80, 82, 84]} trending="up" />
      <StatCard label="Migration Phase" value={s.migration_phase ? s.migration_phase.split(' ')[0] + ' ' + s.migration_phase.split(' ')[1] : 'Phase 2'} color="#38bdf8" sparkData={[1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2]} />
      <StatCard label="Days to CNSA 2.0" value={s.days_to_target || 'N/A'} color="#f59e0b" sparkData={[2000, 1950, 1900, 1850, 1800, 1750, 1700, 1650, 1600, 1550, 1500, 1450]} trending="down" />
    </div>

    {/* 4 Protocol Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {['tls', 'ssh', 'ipsec', 'vpn'].map(id => p[id] ? <ProtocolCard key={id} id={id} data={p[id]} isLive={isLive} /> : null)}
    </div>

    {/* Bottom row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <Card title="Risk Score" className="text-center py-4">
        <div className="text-5xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: risk.risk_level === 'LOW' ? '#22c55e' : '#fbbf24' }}>{risk.risk_score || '--'}</div>
        <Badge variant={risk.risk_level === 'LOW' ? 'success' : 'warning'}>{risk.risk_level || 'CALCULATING'}</Badge>
      </Card>
      <Card title="Algorithm Distribution">
        {donut.length > 0 ? <div className="flex justify-center py-4"><DonutChart data={donut} size={140} /></div> : <div className="text-slate-500 text-sm text-center py-8">Waiting...</div>}
      </Card>
      <Card title="Migration Timeline">
        <div className="space-y-2.5 py-1">
          {timeline.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={'w-2 h-2 rounded-full ' + (t.status === 'completed' ? 'bg-emerald-400' : t.status === 'in_progress' ? 'bg-sky-400 animate-pulse' : 'bg-slate-600')} />
              <div className="flex-1 flex justify-between items-center">
                <span className={'text-[11px] ' + (t.status === 'completed' ? 'text-slate-400 line-through' : t.status === 'in_progress' ? 'text-white font-semibold' : 'text-slate-500')}>{t.phase}</span>
                <span className="text-[10px] text-slate-600">{t.target}</span>
              </div>
              {t.status === 'in_progress' && <span className="text-[10px] text-sky-400 font-semibold">{t.progress}%</span>}
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Alerts + Live Feed + Performance */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card title="Alerts">
        <div className="space-y-3 py-2">
          <div className="flex justify-between"><span className="text-sm text-slate-400">Total</span><span className="text-sm font-semibold text-white">{alerts.total_alerts || 0}</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Open</span><span className="text-sm font-semibold text-yellow-400">{alerts.open_alerts || 0}</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Critical</span><span className="text-sm font-semibold text-red-400">{alerts.critical || 0}</span></div>
        </div>
      </Card>
      <ActivityFeed recentHandshakes={handshakes} />
      <Card title="Performance">
        <div className="grid grid-cols-2 gap-4 py-2">
          <div><div className="text-[10px] text-slate-500 uppercase mb-1">P50</div><div className="text-lg font-bold text-white">{perf.p50_latency || 0}ms</div></div>
          <div><div className="text-[10px] text-slate-500 uppercase mb-1">P99</div><div className="text-lg font-bold text-white">{perf.p99_latency || 0}ms</div></div>
          <div><div className="text-[10px] text-slate-500 uppercase mb-1">Success</div><div className="text-lg font-bold text-emerald-400">{perf.success_rate || 0}%</div></div>
          <div><div className="text-[10px] text-slate-500 uppercase mb-1">Uptime</div><div className="text-lg font-bold text-sky-400">{s.uptime || '--'}</div></div>
        </div>
      </Card>
    </div>

    <div className="mt-4 flex items-center justify-center gap-3 text-[10px] text-slate-600">
      {isLive ? (
        <>
          <Radio size={10} className="text-emerald-400 animate-pulse" />
          <span>WebSocket Live · {connectionInfo.connectedClients} client{connectionInfo.connectedClients !== 1 ? 's' : ''}</span>
        </>
      ) : (
        <span>Polling · Auto-refresh 3s · {pd?.timestamp ? new Date(pd.timestamp).toLocaleTimeString() : 'syncing...'}</span>
      )}
    </div>
  </>);
}
