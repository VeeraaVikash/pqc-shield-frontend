'use client';
import { api } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import LoadingState from '@/components/ui/LoadingState';
export default function QoSPage() {
  const {data:d, loading} = useAPI(api.getCommandCenter, 5000);
  if (loading && !d) return <LoadingState label="Loading QoS..."/>;
  if (!d) return <div className="text-slate-500 py-20 text-center">Backend not reachable.</div>;
  const qos=d.qos||{}, alerts=d.alerts_summary||{}, risk=d.risk||{}, sp=[99.9,99.9,99.95,99.97,99.97,99.97,99.97,99.97,99.97,99.97,99.97,99.97];
  const stats=[{label:'Availability',value:(qos.availability||0)+'%',color:'#22c55e',sparkData:sp},{label:'MTTR',value:(qos.mttr_seconds||0)+'s',color:'#38bdf8',sparkData:sp},{label:'Failed 24h',value:qos.failed_handshakes_24h||0,color:'#ef4444',sparkData:sp}];
  return (<>
    <PageHeader title="Quality of Service" subtitle="SLA compliance">
      <Badge variant={qos.status==='HEALTHY'?'success':qos.status==='DEGRADED'?'warning':'critical'}>{qos.status||'UNKNOWN'}</Badge>
    </PageHeader>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">{stats.map((s,i)=><StatCard key={i} {...s}/>)}</div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="System Health">
        <div className="space-y-3 py-2">
          <div className="flex justify-between"><span className="text-sm text-slate-400">Status</span><Badge variant={d.system_status==='ALL SYSTEMS NOMINAL'?'success':'warning'}>{d.system_status}</Badge></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Open Alerts</span><span className="text-sm font-bold text-yellow-400">{alerts.open_alerts||0}</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Critical</span><span className="text-sm font-bold text-red-400">{alerts.critical||0}</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Fallbacks 24h</span><span className="text-sm font-bold text-orange-400">{qos.fallback_triggers_24h||0}</span></div>
        </div>
      </Card>
      <Card title="Risk">
        <div className="space-y-3 py-2">
          <div className="flex justify-between"><span className="text-sm text-slate-400">Score</span><span className="text-sm font-bold" style={{color:risk.risk_level==='LOW'?'#22c55e':'#fbbf24'}}>{risk.risk_score}</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Level</span><Badge variant={risk.risk_level==='LOW'?'success':'warning'}>{risk.risk_level}</Badge></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Coverage</span><span className="text-sm text-white">{risk.factors?.policy_coverage||0}%</span></div>
        </div>
      </Card>
    </div>
  </>);
}
