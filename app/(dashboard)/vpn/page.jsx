'use client';
import { api } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import LoadingState from '@/components/ui/LoadingState';
import { Wifi } from 'lucide-react';
export default function VPNPage() {
  const {data:proto} = useAPI(api.getProtocolOverview, 5000);
  const {data:peers, loading} = useAPI(api.getVPNPeers, 5000);
  if (loading && !peers) return <LoadingState label="Loading VPN..."/>;
  const v = proto?.protocols?.vpn || {};
  const sp=[100,110,120,130,140,145,150,155,158,160,162,165];
  const stats=[
    {label:'Active Peers',value:v.active_peers||0,color:'#f59e0b',sparkData:sp},
    {label:'PQC Coverage',value:(v.pqc_percentage||0)+'%',color:'#a78bfa',sparkData:sp},
    {label:'Throughput',value:(v.throughput_gbps||0)+' Gbps',color:'#22c55e',sparkData:sp},
    {label:'Success Rate',value:(v.success_rate||0)+'%',color:'#38bdf8',sparkData:sp},
  ];
  const cols=[
    {key:'peer_id',label:'Peer ID',mono:true},
    {key:'endpoint',label:'Endpoint',mono:true},
    {key:'tunnel_ip',label:'Tunnel IP',mono:true},
    {key:'kem',label:'KEM',mono:true},
    {key:'mode',label:'Mode',render:r=><Badge variant={r.mode==='PQC-Only'?'success':r.mode==='Hybrid'?'info':'warning'}>{r.mode}</Badge>},
    {key:'rx_bytes',label:'RX'},
    {key:'tx_bytes',label:'TX'},
    {key:'uptime',label:'Uptime'},
    {key:'status',label:'Status',render:r=><Badge variant={r.status==='active'?'success':'default'}>{r.status}</Badge>},
  ];
  return (<>
    <PageHeader title="VPN Connections" subtitle="WireGuard + PQC Overlay">
      <Badge variant={v.status==='operational'?'success':'warning'}>{v.status||'--'}</Badge>
    </PageHeader>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">{stats.map((s,i)=><StatCard key={i} {...s}/>)}</div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <Card title="Connection Breakdown">
        <div className="space-y-3 py-2">
          <div className="flex justify-between"><span className="text-sm text-slate-400">Roaming Clients</span><span className="text-sm font-bold text-white">{v.roaming_clients||0}</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Site-to-Site</span><span className="text-sm font-bold text-white">{v.site_to_site||0}</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Primary KEM</span><span className="text-sm font-mono text-violet-400">{v.primary_kem||'--'}</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Primary Sig</span><span className="text-sm font-mono text-sky-400">{v.primary_sig||'--'}</span></div>
        </div>
      </Card>
      <Card title="Latency">
        <div className="space-y-3 py-2">
          <div className="flex justify-between"><span className="text-sm text-slate-400">Avg</span><span className="text-sm font-bold text-white">{v.avg_latency_ms||0}ms</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">P99</span><span className="text-sm font-bold text-white">{v.p99_latency_ms||0}ms</span></div>
          <div className="flex justify-between"><span className="text-sm text-slate-400">Connections/hr</span><span className="text-sm font-bold text-white">{v.connections_per_hour||0}</span></div>
        </div>
      </Card>
    </div>
    <Card title={'Active Peers ('+((peers||[]).length)+')'}>
      {peers&&peers.length>0?<DataTable columns={cols} data={peers}/>:<p className="text-slate-500 py-4">No peers</p>}
    </Card>
    <div className="mt-2 text-[10px] text-slate-600 text-center">Refresh 5s</div>
  </>);
}
