'use client';
import { api } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import LoadingState from '@/components/ui/LoadingState';
export default function TLSPage() {
  const {data:conns, loading} = useAPI(api.getTLSConnections, 3000);
  if (loading && !conns) return <LoadingState label="Loading TLS..."/>;
  const cols=[{key:'conn_id',label:'ID',mono:true,render:r=><span className="text-[10px]">{(r.conn_id||'').slice(0,8)}</span>},{key:'source',label:'Source'},{key:'destination',label:'Dest'},{key:'kem',label:'KEM',mono:true},{key:'signature',label:'Sig',mono:true},{key:'mode',label:'Mode',render:r=><Badge variant={r.mode==='PQC-Only'?'success':r.mode==='Hybrid'?'info':'warning'}>{r.mode}</Badge>},{key:'latency',label:'Latency'},{key:'status',label:'Status',render:r=><Badge variant={r.status==='active'?'success':'warning'}>{r.status}</Badge>}];
  return (<>
    <PageHeader title="TLS Connections" subtitle="Live PQC sessions"/>
    <Card title={'Active ('+((conns||[]).length)+')'}>{conns&&conns.length>0?<DataTable columns={cols} data={conns}/>:<p className="text-slate-500 text-sm py-8 text-center">No connections yet</p>}</Card>
    <div className="mt-2 text-[10px] text-slate-600 text-center">Refresh 3s</div>
  </>);
}
