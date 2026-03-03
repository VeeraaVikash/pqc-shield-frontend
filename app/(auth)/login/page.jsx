'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState('operator');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with actual auth
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-base flex">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-gradient-to-b from-violet-950/80 to-surface-base border-r border-slate-800/60 p-10">
        <div>
          <Link href="/" className="flex items-center gap-2.5 no-underline mb-16">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <span className="text-base font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>PQ</span>
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>PQC Shield</span>
          </Link>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Secure Access to Your<br />Quantum-Ready Network
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Post-quantum cryptography management platform protecting enterprise VPN infrastructure across all protocol layers.
          </p>
        </div>
        <div className="space-y-3">
          {['NIST FIPS 203/204/205 Compliant', 'CNSA 2.0 Migration Timeline', 'Zero-Trust Architecture'].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
              <Shield size={14} className="text-violet-400" /> {t}
            </div>
          ))}
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <span className="text-sm font-extrabold text-white">PQ</span>
            </div>
            <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>PQC Shield</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>Sign in to your account</h1>
          <p className="text-sm text-slate-500 mb-8">Access the PQC management dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Select */}
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1.5 block">Access Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['operator', 'admin', 'viewer'].map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`py-2 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                      role === r ? 'bg-violet-500/10 border-violet-500/30 text-violet-400' : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600'
                    }`}>{r}</button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input type="email" placeholder="admin@pqc-vault.io" required
                  className="w-full bg-surface-raised border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input type={showPw ? 'text' : 'password'} placeholder="••••••••••" required
                  className="w-full bg-surface-raised border border-slate-800 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm">
              Sign In to Dashboard
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            Protected by PQC-TLS · Dilithium3 Session Auth
          </p>
        </div>
      </div>
    </div>
  );
}
