'use client';
import { api } from '@/lib/api';
import { useAPI } from '@/lib/useAPI';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';
import LoadingState from '@/components/ui/LoadingState';
export default function AuditPage() {
  const {data:logs, loading} = useAPI(api.getAuditLogs, 8000);
  if (loading && !logs) return <LoadingState label="Loading audit..."/>;
  const sv=s=>s==='CRITICAL'?'critical':s==='WARNING'?'warning':'info';
  return (<>
    <PageHeader title="Audit Trail" subtitle="System event log"/>
    <Card title={'Events ('+((logs||[]).length)+')'}>
      <div className="space-y-2.5 py-1">
        {(logs||[]).map((l,i)=>(
          <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-800/25 last:border-0">
            <Badge variant={sv(l.severity)}>{l.severity}</Badge>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap"><span className="text-[12px] font-semibold text-white">{l.event_type}</span><span className="text-[11px] text-slate-500">{l.actor}</span></div>
              <div className="text-[11px] text-slate-400 mt-0.5">{l.description}</div>
            </div>
            <div className="text-[10px] text-slate-600 whitespace-nowrap">{l.timestamp?new Date(l.timestamp).toLocaleTimeString():''}</div>
          </div>
        ))}
        {(!logs||logs.length===0)&&<div className="text-slate-500 text-sm text-center py-4">No logs yet</div>}
      </div>
    </Card>
  </>);
}
