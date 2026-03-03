'use client';

import { PageHeader, Card, Badge, StatusDot } from '@/components/ui';
import { QOS_SLAS, FAILOVER_MECHANISMS, ANOMALIES, CLUSTER_NODES } from '@/constants';
import { getNodeHealth, getStatusColor } from '@/lib/utils';

export default function QoSPage() {
  return (
    <div>
      <PageHeader title="QoS & Resilience" subtitle="Quality of service monitoring, failover status, and anomaly detection" />

      {/* SLA Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {QOS_SLAS.map((s, i) => (
          <Card key={i}>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">{s.label}</p>
            <p className="text-[28px] sm:text-[32px] font-bold mt-1.5 mb-1" style={{ fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500">Target: {s.target}</span>
              <Badge variant={s.met ? 'success' : 'danger'}>{s.met ? 'MET' : 'BREACH'}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Failover */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Failover & Fallback Status</h3>
          <div className="space-y-2">
            {FAILOVER_MECHANISMS.map((f, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-3 bg-surface-base/40 rounded-lg border border-slate-800/40">
                <div className="flex items-center gap-2.5 min-w-0">
                  <StatusDot status="active" />
                  <div className="min-w-0">
                    <p className="text-[12px] text-slate-200 font-medium truncate">{f.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Last: {f.lastTriggered}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <Badge variant="success">ARMED</Badge>
                  <p className="text-[10px] text-slate-500 mt-1">{f.triggers24h} / 24h</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Anomaly Detection */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Anomaly Detection</h3>
          <div className="space-y-2">
            {ANOMALIES.map((a, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-3 bg-surface-base/40 rounded-lg"
                style={{ border: `1px solid ${a.severity === 'critical' ? 'rgba(239,68,68,0.2)' : 'rgba(51,65,85,0.3)'}` }}>
                <div className="min-w-0">
                  <p className="text-[12px] text-slate-200 font-medium">{a.type}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Last: {a.lastSeen} · Count: {a.count}</p>
                </div>
                <Badge variant={a.severity === 'critical' ? 'danger' : a.severity === 'warning' ? 'warning' : 'default'}>
                  {a.action}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Cluster Health */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Cluster Health Matrix</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {CLUSTER_NODES.map((node, i) => {
            const health = getNodeHealth(node);
            const color = getStatusColor(health);
            return (
              <div key={i} className="p-2.5 rounded-lg text-center"
                style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}>
                <StatusDot status={health} />
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono mt-1 break-all leading-tight">{node}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
