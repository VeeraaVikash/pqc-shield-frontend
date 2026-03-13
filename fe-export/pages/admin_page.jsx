'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Shield, Server, Key, AlertTriangle, Plus, Trash2, Settings, ArrowLeft } from 'lucide-react';

const Badge = ({ variant = 'default', children }) => {
  const styles = { default: 'bg-slate-500/15 text-slate-400 border-slate-500/20', success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20', danger: 'bg-red-500/10 text-red-400 border-red-500/20' };
  return <span className={`text-[11px] font-semibold font-mono px-2 py-0.5 rounded-md border ${styles[variant]}`}>{children}</span>;
};

const USERS = [
  { id: 1, name: 'Veeraa (Admin)', email: 'admin@pqc-vault.io', role: 'admin', status: 'active', lastLogin: '2 min ago' },
  { id: 2, name: 'Priya Sharma', email: 'priya@team.io', role: 'operator', status: 'active', lastLogin: '1h ago' },
  { id: 3, name: 'Ravi Kumar', email: 'ravi@team.io', role: 'operator', status: 'active', lastLogin: '3h ago' },
  { id: 4, name: 'Sarah Chen', email: 'sarah@team.io', role: 'viewer', status: 'active', lastLogin: '1d ago' },
  { id: 5, name: 'Deploy Bot', email: 'bot@ci.io', role: 'service', status: 'active', lastLogin: '5m ago' },
  { id: 6, name: 'Legacy User', email: 'old@team.io', role: 'viewer', status: 'inactive', lastLogin: '30d ago' },
];

const ROLES = [
  { role: 'admin', permissions: 'Full access — users, policies, keys, config', count: 1, color: 'text-red-400' },
  { role: 'operator', permissions: 'Manage policies, keys, view telemetry, audit', count: 2, color: 'text-amber-300' },
  { role: 'viewer', permissions: 'Read-only dashboard, telemetry, audit', count: 2, color: 'text-green-400' },
  { role: 'service', permissions: 'API-only — key rotation, deploy, telemetry emit', count: 1, color: 'text-sky-400' },
];

export default function AdminPage() {
  const [tab, setTab] = useState('users');

  return (
    <div className="min-h-screen bg-surface-base text-slate-200">
      {/* Top Bar */}
      <header className="border-b border-slate-800/60 bg-surface-base/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-500 hover:text-white transition-colors no-underline"><ArrowLeft size={20} /></Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                <span className="text-xs font-extrabold text-white">PQ</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Admin Panel</p>
                <p className="text-[10px] text-slate-600 font-mono">Role: Super Admin</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {['users', 'roles', 'system'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                  tab === t ? 'bg-violet-500/10 border-violet-500/30 text-violet-400' : 'border-slate-800 text-slate-500 hover:text-slate-300'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>User Management</h2>
                <p className="text-sm text-slate-500 mt-1">Manage team access and authentication</p>
              </div>
              <button className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold px-4 py-2 rounded-lg">
                <Plus size={14} /> Add User
              </button>
            </div>

            <div className="bg-surface-raised/60 border border-slate-800/60 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/60">
                    {['User', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {USERS.map(u => (
                    <tr key={u.id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm text-white font-medium">{u.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{u.email}</p>
                      </td>
                      <td className="px-4 py-3"><Badge variant={u.role === 'admin' ? 'danger' : u.role === 'service' ? 'default' : 'success'}>{u.role}</Badge></td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-slate-600'}`} />
                          <span className="text-xs text-slate-400">{u.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 font-mono">{u.lastLogin}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="text-slate-600 hover:text-sky-400 transition-colors"><Settings size={14} /></button>
                          <button className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'roles' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>Role Definitions</h2>
            <div className="grid gap-4">
              {ROLES.map(r => (
                <div key={r.role} className="bg-surface-raised/60 border border-slate-800/60 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-base font-bold capitalize ${r.color}`} style={{ fontFamily: 'var(--font-display)' }}>{r.role}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{r.count} user(s)</span>
                    </div>
                    <p className="text-sm text-slate-400">{r.permissions}</p>
                  </div>
                  <button className="text-xs text-slate-600 hover:text-white border border-slate-800 px-3 py-1.5 rounded-lg transition-colors">Edit Permissions</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'system' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>System Configuration</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Server, title: 'Backend API', status: 'Connected', url: 'https://api.pqc-vault.io/v1', badge: 'success' },
                { icon: Shield, title: 'Auth Provider', status: 'PQC-TLS + Dilithium3', url: 'Internal SSO', badge: 'success' },
                { icon: Key, title: 'HSM Connection', status: 'Active', url: 'PKCS#11 / SoftHSM2', badge: 'success' },
                { icon: AlertTriangle, title: 'Alert Channels', status: '3 configured', url: 'Slack, Email, PagerDuty', badge: 'warning' },
              ].map((s, i) => (
                <div key={i} className="bg-surface-raised/60 border border-slate-800/60 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <s.icon size={20} className="text-slate-400" />
                    <Badge variant={s.badge}>{s.status}</Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-500 font-mono">{s.url}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
