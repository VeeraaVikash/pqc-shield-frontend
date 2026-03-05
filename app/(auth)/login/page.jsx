'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, Shield, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth';
export default function LoginPage() {
  const { login, register } = useAuth();
  const [s,setS] = useState({pw:false,role:'operator',email:'',pass:'',name:'',reg:false,err:'',busy:false});
  const u=(k,v)=>setS(p=>({...p,[k]:v}));
  const onSubmit = async(e) => {
    e.preventDefault(); u('err',''); u('busy',true);
    try { s.reg ? await register(s.email,s.pass,s.name||'Admin',s.role) : await login(s.email,s.pass); }
    catch(err){ u('err',err.message); } finally { u('busy',false); }
  };
  const inp='w-full bg-surface-raised border border-slate-800 rounded-lg py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50';
  return (
    <div className="min-h-screen bg-surface-base flex">
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-gradient-to-b from-violet-950/80 to-surface-base border-r border-slate-800/60 p-10">
        <div>
          <Link href="/" className="flex items-center gap-2.5 no-underline mb-16">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center"><span className="text-base font-extrabold text-white">PQ</span></div>
            <span className="text-xl font-bold text-white" style={{fontFamily:'var(--font-display)'}}>PQC Shield</span>
          </Link>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4" style={{fontFamily:'var(--font-display)'}}>Secure Access to Your<br/>Quantum-Ready Network</h2>
          <p className="text-slate-400">Post-quantum cryptography management for enterprise VPN.</p>
        </div>
        <div className="space-y-3">
          {['NIST FIPS 203/204/205','CNSA 2.0 Timeline','Zero-Trust Arch'].map((t,i)=>(<div key={i} className="flex items-center gap-2 text-sm text-slate-400"><Shield size={14} className="text-violet-400"/>{t}</div>))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-2" style={{fontFamily:'var(--font-display)'}}>{s.reg?'Create account':'Sign in'}</h1>
          <p className="text-sm text-slate-500 mb-8">{s.reg?'Set up dashboard access':'Access PQC dashboard'}</p>
          {s.err && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{s.err}</div>}
          <form onSubmit={onSubmit} className="space-y-5">
            <div><label className="text-xs text-slate-500 font-medium mb-1.5 block">Access Level</label>
              <div className="grid grid-cols-3 gap-2">{['operator','admin','viewer'].map(r=>(<button key={r} type="button" onClick={()=>u('role',r)} className={`py-2 rounded-lg text-xs font-semibold capitalize border ${s.role===r?'bg-violet-500/10 border-violet-500/30 text-violet-400':'border-slate-800 text-slate-500'}`}>{r}</button>))}</div>
            </div>
            {s.reg && <div><label className="text-xs text-slate-500 font-medium mb-1.5 block">Name</label><input type="text" value={s.name} onChange={e=>u('name',e.target.value)} placeholder="Name" className={inp+' px-4'}/></div>}
            <div><label className="text-xs text-slate-500 font-medium mb-1.5 block">Email</label>
              <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"/><input type="email" value={s.email} onChange={e=>u('email',e.target.value)} placeholder="admin@pqc-vault.io" required className={inp+' pl-10 pr-4'}/></div></div>
            <div><label className="text-xs text-slate-500 font-medium mb-1.5 block">Password</label>
              <div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"/>
                <input type={s.pw?'text':'password'} value={s.pass} onChange={e=>u('pass',e.target.value)} placeholder="Password" required className={inp+' pl-10 pr-10'}/>
                <button type="button" onClick={()=>u('pw',!s.pw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">{s.pw?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></div>
            <button type="submit" disabled={s.busy} className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold py-3 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {s.busy?'Processing...':s.reg?<><UserPlus size={16}/>Create Account</>:<><LogIn size={16}/>Sign In</>}</button>
          </form>
          <button onClick={()=>{u('reg',!s.reg);u('err','');}} className="w-full text-center text-sm text-slate-500 hover:text-violet-400 mt-4">{s.reg?'Have account? Sign in':"No account? Register"}</button>
        </div>
      </div>
    </div>
  );
}
