'use client';
import { api } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import LoadingState from '@/components/ui/LoadingState';
import { Globe } from 'lucide-react';
export default function IPsecPage() {
  const {data:proto} = useAPI(api.getProtocolOverview, 5000);
  const {data:tunnels, loading} = useAPI(api.getIPsecTunnels, 5000);
  if (loading && !tunnels) return <LoadingState label="Loading IPsec..."/>;
  const ip = proto?.protocols?.ipsec || {};
  const sp=[70,72,75,78,80,82,84,86,88,89,89,89];
  const stats=[
    {label:'Active Tunnels',value:ip.active_tunnels||0,color:'#22c55e',sparkData:sp},
    {label:'PQC Coverage',value:(ip.pqc_percentage||0)+'%',color:'#a78bfa',sparkData:sp},
    {label:'Throughput',value:(ip.throughput_gbps||0)+' Gbps',color:'#38bdf8',sparkData:sp},
    {label:'Success Rate',value:(ip.success_rate||0)+'%',color:'#fbbf24',sparkData:sp},
  ];
  const cols=[
    {key:'tunnel_id',label:'Tunnel ID',mono:true,render:r=><span className="text-[10px]">{(r.tunnel_id||'').slice(0,14)}</span>},
    {key:'source',label:'Source'},{key:'destination',label:'Destination'},
    {key:'kem',label:'KEM',mono:true},{key:'auth',label:'Auth',mono:true},
    {key:'mode',label:'Mode',render:r=><Badge variant={r.mode==='PQC-Only'?'success':r.mode==='Hybrid'?'info':'warning'}>{r.mode}</Badge>},
    {key:'bytes_transferred',label:'Data'},
    {key:'sa_lifetime',label:'SA Life'},
    {key:'status',label:'Status',render:r=><Badge variant={r.status==='established'?'success':'info'}>{r.status}</Badge>},
  ];
  return (<>
    <PageHeader title="IPsec Tunnels" subtitle="IKEv2 + PQC Site-to-Site">
      <Badge variant={ip.status==='operational'?'success':'warning'}>{ip.status||'--'}</Badge>
    </PageHeader>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">{stats.map((s,i)=><StatCard key={i} {...s}/>)}</div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <Card title="Tunnel Breakdown">
        <div className="space-y-3 py-2">
          <div className="flex justify-between"><span className="text-sm text-slate-400">PQC Tunnels</span><span className="text-sm font-bold text-emerald-400">{ip.tunnels_pqc||0}</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Hybrid</span><span className="text-sm font-bold text-yellow-400">{ip.tunnels_hybrid||0}</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Classical</span><span className="text-sm font-bold text-red-400">{ip.tunnels_classical||0}</span></div>
        </div>
      </Card>
      <Card title="IKE Config">
        <div className="space-y-3 py-2">
          <div className="flex justify-between"><span className="text-sm text-slate-400">Primary KEM</span><span className="text-sm font-mono text-violet-400">{ip.primary_kem||'--'}</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Primary Auth</span><span className="text-sm font-mono text-sky-400">{ip.primary_sig||'--'}</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">SA Negotiations/hr</span><span className="text-sm font-bold text-white">{ip.sa_negotiations_per_hour||0}</span></div>
        </div>
      </Card>
      <Card title="Latency">
        <div className="space-y-3 py-2">
          <div className="flex justify-between"><span className="text-sm text-slate-400">Avg</span><span className="text-sm font-bold text-white">{ip.avg_latency_ms||0}ms</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">P99</span><span className="text-sm font-bold text-white">{ip.p99_latency_ms||0}ms</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Failure Rate</span><span className="text-sm font-bold text-red-400">{ip.failure_rate||0}%</span></div>
        </div>
      </Card>
    </div>
    <Card title={'Active Tunnels ('+((tunnels||[]).length)+')'}>
      {tunnels&&tunnels.length>0?<DataTable columns={cols} data={tunnels}/>:<p className="text-slate-500 py-4">No tunnels</p>}
    </Card>
    <div className="mt-2 text-[10px] text-slate-600 text-center">Refresh 5s</div>
  </>);
}
