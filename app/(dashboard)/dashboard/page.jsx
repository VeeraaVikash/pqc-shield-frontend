'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Lock, KeyRound, Activity, AlertTriangle, CheckCircle,
  TrendingUp, TrendingDown, Bell, RefreshCw, ChevronRight, Globe,
  Terminal, Shield, Wifi, Clock, Zap, Eye, ArrowUpRight, Layers,
} from 'lucide-react';
import {
  DASHBOARD_STATS,
  DASHBOARD_ALERTS,
  PROTOCOL_ROLLOUT,
  ALGORITHM_DISTRIBUTION,
  HANDSHAKE_METRICS,
} from '@/constants';

/* ═══════════════════════════════════════════
   DESIGN SYSTEM — LOCAL PRIMITIVES
   Scoped to dashboard for maximum performance
   ═══════════════════════════════════════════ */

const cn = (...c) => c.filter(Boolean).join(' ');

function Spark({ data, color, h = 26 }) {
  if (!data?.length) return null;
  const w = 72, max = Math.max(...data), min = Math.min(...data), r = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / r) * (h - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={h} className="block flex-shrink-0 opacity-80">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${pts} ${w},${h} 0,${h}`} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Donut({ segments, size = 104 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r = 36, circ = 2 * Math.PI * r;
  let cum = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(51,65,85,0.25)" strokeWidth="9" />
      {segments.map((seg, i) => {
        const off = (cum / total) * circ, len = (seg.value / total) * circ;
        cum += seg.value;
        return (
          <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={seg.color} strokeWidth="9"
            strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-off}
            transform="rotate(-90 50 50)" strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        );
      })}
      <text x="50" y="48" textAnchor="middle" fill="#f1f5f9" fontSize="15" fontWeight="700"
        style={{ fontFamily: 'var(--font-display)' }}>{total}%</text>
      <text x="50" y="60" textAnchor="middle" fill="#64748b" fontSize="7.5" letterSpacing="0.5">COVERED</text>
    </svg>
  );
}

function BarChart({ data, color, h = 72 }) {
  if (!data?.length) return null;
  const max = Math.max(...data), gap = 1.2, barW = (100 - gap * (data.length - 1)) / data.length;
  return (
    <svg width="100%" height={h} viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" className="block">
      <defs>
        <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor={color} stopOpacity="0.25" />
        </linearGradient>
      </defs>
      {data.map((v, i) => {
        const bH = Math.max((v / max) * (h - 6), 2);
        return (
          <rect key={i} x={i * (barW + gap)} y={h - bH - 2} width={barW} height={bH}
            rx={0.8} fill="url(#bGrad)" />
        );
      })}
    </svg>
  );
}

function Badge({ children, variant = 'default', className = '' }) {
  const v = {
    default: 'bg-slate-500/10 text-slate-400 border-slate-500/12',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/12',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/12',
    danger: 'bg-red-500/10 text-red-400 border-red-500/12',
    info: 'bg-sky-400/10 text-sky-400 border-sky-400/12',
    pqc: 'bg-violet-500/10 text-violet-400 border-violet-500/12',
  };
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-[3px] rounded-md text-[10px] font-semibold font-mono tracking-wide border',
      v[variant], className
    )}>{children}</span>
  );
}

function Progress({ value, max = 100, color = '#38bdf8' }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-[5px] rounded-full overflow-hidden bg-slate-800/40">
      <div className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}bb, ${color})`, boxShadow: `0 0 10px ${color}25` }} />
    </div>
  );
}

/* Card wrapper */
function GlassCard({ children, className = '', pad = true }) {
  return (
    <div className={cn(
      'bg-[rgba(15,23,42,0.45)] backdrop-blur-2xl border border-slate-800/40 rounded-2xl',
      'transition-all duration-300 hover:border-slate-700/50',
      pad && 'p-4 sm:p-5',
      className
    )}>{children}</div>
  );
}

/* Section title */
function SectionLabel({ icon: Icon, title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-slate-500" />}
        <h3 className="text-[13px] font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
      </div>
      {action}
    </div>
  );
}

const PROTO_ICONS = {
  'TLS 1.3 + Kyber768': Lock,
  'SSH + Dilithium3': Terminal,
  'IPsec (Planned)': Shield,
  'WPA3 (Planned)': Wifi,
};

const STAT_ICONS = [ShieldCheck, Lock, KeyRound, Activity];

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════ */

export default function DashboardPage() {
  const [syncing, setSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => { setMounted(true); }, []);

  const doSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1400);
  };

  return (
    <div className="pb-6 max-w-[1160px]">

      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-7">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-none"
              style={{ fontFamily: 'var(--font-display)' }}>Command Center</h1>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/8 border border-emerald-500/12">
              <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-400 tracking-wide">LIVE</span>
            </div>
          </div>
          <p className="text-[12px] text-slate-500">Real-time security posture across 4 protocol integrations</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={doSync}
            className={cn(
              'flex items-center gap-1.5 px-3 py-[7px] rounded-lg text-[11px] font-medium border transition-all',
              syncing
                ? 'border-sky-500/25 bg-sky-500/8 text-sky-400'
                : 'border-slate-800/50 text-slate-500 hover:text-slate-300 hover:border-slate-700 active:scale-[0.97]'
            )}>
            <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Refresh'}</span>
          </button>
          <div className="flex items-center gap-1.5 px-2.5 py-[7px] rounded-lg border border-slate-800/50">
            <Clock size={11} className="text-slate-600" />
            <span className="text-[10px] font-mono text-slate-600">4s ago</span>
          </div>
        </div>
      </div>

      {/* ═══ STATS — 2x2 mobile, 4-col desktop ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {DASHBOARD_STATS.map((s, i) => {
          const Icon = STAT_ICONS[i];
          const up = s.trending === 'up';
          return (
            <div key={i}
              className={cn(
                'relative overflow-hidden rounded-2xl p-4 border transition-all duration-500',
                'bg-[rgba(15,23,42,0.45)] backdrop-blur-2xl border-slate-800/40',
                'hover:border-slate-700/50 group',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              )}
              style={{ transitionDelay: `${i * 80}ms` }}>
              {/* Ambient glow */}
              <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-[0.06] group-hover:opacity-[0.1] transition-opacity"
                style={{ background: `radial-gradient(circle, ${s.color}, transparent 70%)` }} />

              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center"
                  style={{ background: `${s.color}0F`, border: `1px solid ${s.color}18` }}>
                  <Icon size={15} style={{ color: s.color }} />
                </div>
                <Spark data={s.sparkData} color={s.color} />
              </div>

              <p className="text-[24px] sm:text-[28px] font-bold text-white leading-none mb-1.5 relative z-10"
                style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>

              <div className="flex items-center justify-between relative z-10">
                <p className="text-[11px] text-slate-500 font-medium truncate pr-3">{s.label}</p>
                <span className={cn(
                  'inline-flex items-center gap-[3px] text-[10px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded-md',
                  up ? 'text-emerald-400 bg-emerald-500/8' : 'text-amber-300 bg-amber-500/8'
                )}>
                  {up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                  {s.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ PROTOCOL COVERAGE — horizontal cards ═══ */}
      <GlassCard className="mb-5">
        <SectionLabel icon={Layers} title="Protocol Coverage"
          action={<Badge variant="info">4 INTEGRATIONS</Badge>} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PROTOCOL_ROLLOUT.map((r, i) => {
            const Icon = PROTO_ICONS[r.protocol] || Globe;
            const active = r.status === 'active';
            return (
              <div key={i} className={cn(
                'rounded-xl p-3.5 border transition-all',
                active
                  ? 'bg-gradient-to-b from-slate-800/30 to-transparent border-slate-700/40 hover:border-slate-600/50'
                  : 'bg-slate-900/20 border-slate-800/25 opacity-60'
              )}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={cn(
                    'w-[30px] h-[30px] rounded-lg flex items-center justify-center',
                    active ? 'bg-sky-500/10 text-sky-400' : 'bg-slate-800/40 text-slate-600'
                  )}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-[11px] font-semibold truncate leading-tight', active ? 'text-white' : 'text-slate-500')}>
                      {r.protocol}
                    </p>
                    <p className="text-[9px] text-slate-600 font-mono mt-0.5">
                      {active ? `${r.endpoints.toLocaleString()} eps` : 'Phase 2'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex-1"><Progress value={r.coverage} color={active ? '#38bdf8' : '#334155'} /></div>
                  <span className={cn('text-[11px] font-bold font-mono w-[30px] text-right', active ? 'text-sky-400' : 'text-slate-700')}>
                    {r.coverage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* ═══ ALERTS + ALGO MIX — responsive split ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 mb-5">

        {/* Alerts */}
        <GlassCard>
          <SectionLabel icon={Bell} title="Recent Alerts"
            action={
              <Link href="/audit" className="text-[10px] text-slate-500 hover:text-sky-400 transition-colors flex items-center gap-0.5 no-underline">
                All events <ChevronRight size={11} />
              </Link>
            } />
          <div>
            {DASHBOARD_ALERTS.map((a, i) => {
              const cfg = {
                critical: { color: '#ef4444', bg: 'bg-red-500/8', Icon: AlertTriangle },
                warning:  { color: '#f59e0b', bg: 'bg-amber-500/8', Icon: AlertTriangle },
                info:     { color: '#38bdf8', bg: 'bg-sky-400/8', Icon: CheckCircle },
              }[a.severity] || { color: '#38bdf8', bg: 'bg-sky-400/8', Icon: CheckCircle };

              return (
                <div key={a.id} className={cn(
                  'flex items-start gap-3 py-3',
                  i < DASHBOARD_ALERTS.length - 1 && 'border-b border-slate-800/30'
                )}>
                  <div className={cn('w-[28px] h-[28px] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', cfg.bg)}>
                    <cfg.Icon size={12} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-slate-300 leading-relaxed">{a.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] text-slate-600 font-mono">{a.time}</span>
                      <Badge variant={a.severity === 'critical' ? 'danger' : a.severity === 'warning' ? 'warning' : 'default'}>
                        {a.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Algorithm Distribution */}
        <GlassCard>
          <SectionLabel title="Algorithm Mix" />
          <div className="flex justify-center mb-4">
            <Donut segments={ALGORITHM_DISTRIBUTION.map(a => ({ value: a.percentage, color: a.color }))} />
          </div>
          <div className="space-y-3">
            {ALGORITHM_DISTRIBUTION.map((a, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: a.color, boxShadow: `0 0 6px ${a.color}30` }} />
                <span className="text-[11px] text-slate-400 flex-1 truncate">{a.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-[4px] rounded-full bg-slate-800/40 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${a.percentage}%`, backgroundColor: a.color }} />
                  </div>
                  <span className="text-[10px] text-slate-300 font-bold font-mono w-7 text-right">{a.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ═══ HANDSHAKE PERFORMANCE ═══ */}
      <GlassCard className="mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-[13px] font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Handshake Performance
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Rolling window across all PQC key exchanges</p>
          </div>
          <div className="flex items-center gap-1">
            {['1h', '6h', '24h', '7d'].map(t => (
              <button key={t} onClick={() => setTimeRange(t)}
                className={cn(
                  'px-2.5 py-[5px] rounded-lg text-[10px] font-semibold border transition-all',
                  timeRange === t
                    ? 'bg-sky-400/10 border-sky-400/18 text-sky-400'
                    : 'border-transparent text-slate-600 hover:text-slate-400'
                )}>{t}</button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
          {[
            { label: 'Success Rate', val: HANDSHAKE_METRICS.successRate, color: '#22c55e', Icon: CheckCircle, sub: '14.2K/hr avg' },
            { label: 'P50 Latency',  val: HANDSHAKE_METRICS.p50Latency, color: '#38bdf8', Icon: Zap, sub: 'Median' },
            { label: 'P99 Latency',  val: HANDSHAKE_METRICS.p99Latency, color: '#fbbf24', Icon: Eye, sub: 'Tail' },
          ].map((m, i) => (
            <div key={i} className="rounded-xl p-3 sm:p-3.5 bg-slate-800/20 border border-slate-800/30">
              <div className="flex items-center gap-1.5 mb-2">
                <m.Icon size={11} style={{ color: m.color }} />
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-wider">{m.label}</span>
              </div>
              <p className="text-[20px] sm:text-[24px] font-bold leading-none"
                style={{ color: m.color, fontFamily: 'var(--font-display)' }}>{m.val}</p>
              <p className="text-[9px] text-slate-600 mt-1 hidden sm:block">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="rounded-xl bg-slate-800/12 border border-slate-800/25 p-3 sm:p-4">
          <BarChart data={HANDSHAKE_METRICS.barData} color="#38bdf8" />
          <div className="flex justify-between mt-2.5 px-0.5">
            {['00:00', '06:00', '12:00', '18:00', '23:59'].map(t => (
              <span key={t} className="text-[8px] sm:text-[9px] text-slate-600 font-mono">{t}</span>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* ═══ QUICK ACTIONS — mobile-friendly grid ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: 'Inventory',     sub: '2,847 assets',   icon: ShieldCheck, href: '/inventory', color: '#22c55e' },
          { label: 'Policy Engine', sub: '86 active',      icon: Lock,        href: '/policy',    color: '#a78bfa' },
          { label: 'Key Rotation',  sub: '12 expiring',    icon: KeyRound,    href: '/keys',      color: '#38bdf8' },
          { label: 'Audit Trail',   sub: 'View events',    icon: Activity,    href: '/audit',     color: '#f59e0b' },
        ].map((a, i) => (
          <Link key={i} href={a.href}
            className="group flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/15 border border-slate-800/30 hover:border-slate-700/50 hover:bg-slate-800/25 transition-all no-underline active:scale-[0.98]">
            <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{ background: `${a.color}0C`, border: `1px solid ${a.color}15` }}>
              <a.icon size={15} style={{ color: a.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] sm:text-[12px] font-semibold text-slate-300 group-hover:text-white transition-colors truncate">{a.label}</p>
              <p className="text-[9px] text-slate-600">{a.sub}</p>
            </div>
            <ArrowUpRight size={12} className="text-slate-700 group-hover:text-slate-500 transition-colors flex-shrink-0 hidden sm:block" />
          </Link>
        ))}
      </div>
    </div>
  );
}
