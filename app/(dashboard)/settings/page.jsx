'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';
import { Save, RotateCcw } from 'lucide-react';
export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [saved, setSaved] = useState(false);
  const [cfg, setCfg] = useState({kem:'Kyber768',sig:'Dilithium3',fallback:'hybrid',autoRotate:true,rotDays:30,mfa:true,timeout:60,auditDays:90,emailAlerts:true,slackAlerts:false,threshold:'medium'});
  const u=(k,v)=>setCfg(p=>({...p,[k]:v}));
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const Toggle=({on,fn})=>(<button onClick={()=>fn(!on)} className={'relative w-10 h-5 rounded-full '+(on?'bg-sky-500':'bg-slate-700')}><div className={'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform '+(on?'translate-x-5':'translate-x-0.5')}/></button>);
  const Sel=({v,fn,opts})=>(<select value={v} onChange={e=>fn(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-sky-500/50">{opts.map(o=><option key={o[0]} value={o[0]}>{o[1]}</option>)}</select>);
  return (<>
    <PageHeader title="Settings" subtitle="System configuration">
      <div className="flex gap-2">
        <button onClick={()=>window.location.reload()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-[11px]"><RotateCcw size={12}/>Reset</button>
        <button onClick={save} className={'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold '+(saved?'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400':'bg-sky-500/10 border border-sky-500/20 text-sky-400')}><Save size={12}/>{saved?'Saved!':'Save'}</button>
      </div>
    </PageHeader>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <Card title="Account">
        <div className="space-y-3 py-2">
          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Email</span><span className="text-sm text-white font-mono">{user?.email}</span></div>
          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Name</span><span className="text-sm text-white">{user?.name}</span></div>
          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Role</span><Badge variant="info">{user?.role}</Badge></div>
          <button onClick={logout} className="w-full mt-2 py-2 rounded-lg border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10">Sign Out</button>
        </div>
      </Card>
      <Card title="Crypto Defaults">
        <div className="space-y-3 py-2">
          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">KEM</span><Sel v={cfg.kem} fn={v=>u('kem',v)} opts={[['Kyber768','Kyber768'],['Kyber1024','Kyber1024']]}/></div>
          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Signature</span><Sel v={cfg.sig} fn={v=>u('sig',v)} opts={[['Dilithium3','Dilithium3'],['Dilithium5','Dilithium5'],['SPHINCS+','SPHINCS+-SHA256']]}/></div>
          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Fallback</span><Sel v={cfg.fallback} fn={v=>u('fallback',v)} opts={[['hybrid','Hybrid'],['strict','Strict PQC'],['classic','Classic']]}/></div>
        </div>
      </Card>
      <Card title="Key Management">
        <div className="space-y-3 py-2">
          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Auto-Rotation</span><Toggle on={cfg.autoRotate} fn={v=>u('autoRotate',v)}/></div>
          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Interval</span><div className="flex items-center gap-2"><input type="number" value={cfg.rotDays} onChange={e=>u('rotDays',e.target.value)} className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white text-center focus:outline-none"/><span className="text-xs text-slate-500">days</span></div></div>
        </div>
      </Card>
      <Card title="Security">
        <div className="space-y-3 py-2">
          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">MFA</span><Toggle on={cfg.mfa} fn={v=>u('mfa',v)}/></div>
          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Session Timeout</span><div className="flex items-center gap-2"><input type="number" value={cfg.timeout} onChange={e=>u('timeout',e.target.value)} className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white text-center focus:outline-none"/><span className="text-xs text-slate-500">min</span></div></div>
        </div>
      </Card>
      <Card title="Notifications">
        <div className="space-y-3 py-2">
          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Email Alerts</span><Toggle on={cfg.emailAlerts} fn={v=>u('emailAlerts',v)}/></div>
          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Slack</span><Toggle on={cfg.slackAlerts} fn={v=>u('slackAlerts',v)}/></div>
          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Threshold</span><Sel v={cfg.threshold} fn={v=>u('threshold',v)} opts={[['low','Low'],['medium','Medium'],['high','High Only']]}/></div>
        </div>
      </Card>
      <Card title="Compliance">
        <div className="space-y-3 py-2">
          {[['FIPS 203 (ML-KEM)','Compliant','success'],['FIPS 204 (ML-DSA)','Compliant','success'],['FIPS 205 (SLH-DSA)','Partial','warning'],['CNSA 2.0','On Track','success'],['ITU-T X.1702','Aligned','info']].map(([s,st,v],i)=>(
            <div key={i} className="flex justify-between items-center"><span className="text-sm text-slate-400">{s}</span><Badge variant={v}>{st}</Badge></div>
          ))}
        </div>
      </Card>
    </div>
    <div className="text-center text-[10px] text-slate-600">PQC Shield v1.0.0</div>
  </>);
}
