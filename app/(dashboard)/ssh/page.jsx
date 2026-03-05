'use client';
import { api } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import StatusDot from '@/components/ui/StatusDot';
import DataTable from '@/components/ui/DataTable';
import LoadingState from '@/components/ui/LoadingState';
export default function SSHPage() {
  const {data:metrics} = useAPI(api.getSSHMetrics, 5000);
  const {data:bastions} = useAPI(api.getSSHBastions, 5000);
  const {data:sessions, loading} = useAPI(api.getSSHSessions, 5000);
  if (loading && !bastions) return <LoadingState label="Loading SSH bastions..."/>;
  const m = metrics || {};
  const sp=[200,220,240,260,280,300,310,320,330,340,340,340];
  const stats=[
    {label:'Bastions Active',value:m.bastions_active||0,color:'#38bdf8',sparkData:sp},
    {label:'Active Sessions',value:m.total_active_sessions||0,color:'#22c55e',sparkData:sp},
    {label:'PQC Coverage',value:(m.pqc_percentage||0)+'%',color:'#a78bfa',sparkData:sp},
    {label:'Auth Latency',value:(m.avg_auth_latency_ms||0)+'ms',color:'#fbbf24',sparkData:sp},
  ];

  const sessionCols=[
    {key:'session_id',label:'Session',mono:true,render:r=><span className="text-[10px]">{(r.session_id||'').slice(0,12)}</span>},
    {key:'user',label:'User',mono:true},
    {key:'bastion',label:'Bastion'},
    {key:'target',label:'Target',mono:true},
    {key:'auth_algorithm',label:'Auth Algo',mono:true},
    {key:'kex_algorithm',label:'KEX',mono:true},
    {key:'mode',label:'Mode',render:r=><Badge variant={r.mode==='PQC-Only'?'success':r.mode==='Hybrid'?'info':'warning'}>{r.mode}</Badge>},
    {key:'duration',label:'Duration'},
    {key:'status',label:'Status',render:r=><Badge variant={r.status==='active'?'success':'default'}>{r.status}</Badge>},
  ];

  return (<>
    <PageHeader title="SSH Bastions" subtitle="PQC-authenticated jump hosts">
      <div className="flex items-center gap-2">
        <Badge variant="info">{m.primary_auth_algo||'--'}</Badge>
        <Badge variant="info">{m.primary_kex_algo||'--'}</Badge>
      </div>
    </PageHeader>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">{stats.map((s,i)=><StatCard key={i} {...s}/>)}</div>

    {/* Bastion Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {(bastions||[]).map(b=>(
        <Card key={b.id}>
          <div className="flex items-start justify-between mb-3">
            <div className="text-[11px] font-mono text-slate-400">{b.id}</div>
            <StatusDot status={b.status==='active'?'active':'warning'}/>
          </div>
          <div className="text-sm font-semibold text-white mb-1">{b.host.split('.')[0]}</div>
          <div className="text-[11px] text-slate-500 mb-3">{b.region}</div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]"><span className="text-slate-500">Sessions</span><span className="text-white font-semibold">{b.active_sessions}</span></div>
            <div className="flex justify-between text-[11px]"><span className="text-slate-500">Auth Algo</span><span className="text-violet-400 font-mono">{b.auth_algorithm}</span></div>
            <div className="flex justify-between text-[11px]"><span className="text-slate-500">KEX</span><span className="text-sky-400 font-mono">{b.kex_algorithm}</span></div>
            <div className="flex justify-between text-[11px]"><span className="text-slate-500">Mode</span><Badge variant={b.mode==='PQC-Only'?'success':'info'}>{b.mode}</Badge></div>
            <div className="flex justify-between text-[11px]"><span className="text-slate-500">CPU</span><span className="text-white">{b.cpu_usage}%</span></div>
            <div className="flex justify-between text-[11px]"><span className="text-slate-500">Uptime</span><span className="text-emerald-400">{b.uptime}</span></div>
            <div className="flex justify-between text-[11px]"><span className="text-slate-500">PQC</span><span className="text-violet-400 font-semibold">{b.pqc_percentage}%</span></div>
          </div>
        </Card>
      ))}
    </div>

    {/* Sessions Table */}
    <Card title={'Active Sessions ('+((sessions||[]).length)+')'}>
      {sessions&&sessions.length>0?<DataTable columns={sessionCols} data={sessions}/>:<p className="text-slate-500 text-sm py-4">No active sessions</p>}
    </Card>
    <div className="mt-2 text-[10px] text-slate-600 text-center">Real-time from backend &middot; Refresh 5s</div>
  </>);
}
