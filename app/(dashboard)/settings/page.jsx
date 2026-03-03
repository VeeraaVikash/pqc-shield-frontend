'use client';

import { useState } from 'react';
import {
  Shield, Key, Bell, Globe, Lock, Save, RotateCcw, CheckCircle,
  ChevronDown,
} from 'lucide-react';

const cn = (...c) => c.filter(Boolean).join(' ');

/* ── Form Primitives ── */

function Section({ icon: Icon, title, description, children }) {
  return (
    <div className="bg-[rgba(15,23,42,0.45)] backdrop-blur-2xl border border-slate-800/40 rounded-2xl p-4 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-slate-400" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="space-y-0">{children}</div>
    </div>
  );
}

function Row({ label, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-3.5 border-b border-slate-800/30 last:border-0">
      <div className="min-w-0">
        <p className="text-[13px] text-slate-300 font-medium">{label}</p>
        {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} type="button"
      className={cn('w-10 h-[22px] rounded-full transition-colors relative', checked ? 'bg-sky-500' : 'bg-slate-700')}>
      <div className={cn('absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform', checked ? 'translate-x-[22px]' : 'translate-x-[3px]')} />
    </button>
  );
}

function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 pr-8 text-[12px] text-slate-300 font-mono focus:outline-none focus:border-sky-500/40 transition-colors cursor-pointer w-full sm:w-auto sm:min-w-[180px]">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  );
}

function NumInput({ value, onChange, unit }) {
  return (
    <div className="flex items-center gap-2">
      <input type="number" value={value} onChange={e => onChange(e.target.value)}
        className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-[12px] text-slate-300 font-mono focus:outline-none focus:border-sky-500/40 transition-colors w-20 sm:w-24" />
      {unit && <span className="text-[11px] text-slate-500 flex-shrink-0">{unit}</span>}
    </div>
  );
}

function StatusBadge({ children, variant = 'success' }) {
  const v = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/12',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/12',
    danger: 'bg-red-500/10 text-red-400 border-red-500/12',
  };
  return <span className={cn('inline-flex items-center px-2 py-[3px] rounded-md text-[10px] font-semibold font-mono border', v[variant])}>{children}</span>;
}

/* ── Main ── */

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  // Crypto
  const [defaultKEM, setDefaultKEM] = useState('kyber768');
  const [defaultSig, setDefaultSig] = useState('dilithium3');
  const [fallback, setFallback] = useState('hybrid');
  const [keyRotDays, setKeyRotDays] = useState('90');
  const [certRotDays, setCertRotDays] = useState('365');
  const [autoRotate, setAutoRotate] = useState(true);

  // Security
  const [mfa, setMfa] = useState(true);
  const [sessionMin, setSessionMin] = useState('30');
  const [ipWhitelist, setIpWhitelist] = useState(false);
  const [auditDays, setAuditDays] = useState('365');

  // Alerts
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [pagerDuty, setPagerDuty] = useState(false);
  const [threshold, setThreshold] = useState('critical');

  // Network
  const [rateLimit, setRateLimit] = useState('1000');
  const [telemetryInt, setTelemetryInt] = useState('5');
  const [proxyMode, setProxyMode] = useState('transparent');

  const doSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="pb-6 max-w-[900px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Platform configuration, security, and compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-[7px] rounded-lg text-[11px] font-medium border border-slate-800/50 text-slate-500 hover:text-slate-300 transition-colors">
            <RotateCcw size={12} /> Reset
          </button>
          <button onClick={doSave}
            className={cn(
              'flex items-center gap-1.5 px-4 py-[7px] rounded-lg text-[11px] font-semibold transition-all',
              saved ? 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-400' : 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90'
            )}>
            {saved ? <><CheckCircle size={12} /> Saved!</> : <><Save size={12} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="space-y-4">

        {/* ═══ CRYPTOGRAPHY ═══ */}
        <Section icon={Shield} title="Cryptography Defaults" description="Default PQC algorithms for new connections and policies">
          <Row label="Default KEM Algorithm" description="Key encapsulation for TLS/IPsec handshakes">
            <Select value={defaultKEM} onChange={setDefaultKEM} options={[
              { value: 'kyber512', label: 'Kyber-512 (Level 1)' },
              { value: 'kyber768', label: 'Kyber-768 (Level 3)' },
              { value: 'kyber1024', label: 'Kyber-1024 (Level 5)' },
            ]} />
          </Row>
          <Row label="Default Signature" description="Digital signature for auth and certificates">
            <Select value={defaultSig} onChange={setDefaultSig} options={[
              { value: 'dilithium2', label: 'Dilithium2 (Level 2)' },
              { value: 'dilithium3', label: 'Dilithium3 (Level 3)' },
              { value: 'dilithium5', label: 'Dilithium5 (Level 5)' },
              { value: 'sphincs', label: 'SPHINCS+-SHA256' },
            ]} />
          </Row>
          <Row label="Classical Fallback" description="When PQC negotiation fails with legacy clients">
            <Select value={fallback} onChange={setFallback} options={[
              { value: 'hybrid', label: 'Hybrid (PQC + Classical)' },
              { value: 'allow', label: 'Allow Classical Only' },
              { value: 'deny', label: 'Deny (PQC Required)' },
            ]} />
          </Row>
        </Section>

        {/* ═══ KEY MANAGEMENT ═══ */}
        <Section icon={Key} title="Key Management" description="Key rotation schedules and certificate lifecycle">
          <Row label="Auto Key Rotation" description="Automatically rotate PQC keys on schedule">
            <Toggle checked={autoRotate} onChange={setAutoRotate} />
          </Row>
          <Row label="Rotation Interval" description="Days between automatic key rotations">
            <NumInput value={keyRotDays} onChange={setKeyRotDays} unit="days" />
          </Row>
          <Row label="Certificate Renewal" description="Days between certificate renewals">
            <NumInput value={certRotDays} onChange={setCertRotDays} unit="days" />
          </Row>
          <Row label="HSM Backend" description="Hardware security module for key storage">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-slate-300 font-mono">SoftHSM2 (PKCS#11)</span>
              <StatusBadge>CONNECTED</StatusBadge>
            </div>
          </Row>
        </Section>

        {/* ═══ SECURITY ═══ */}
        <Section icon={Lock} title="Security & Access" description="Authentication, sessions, and access control">
          <Row label="Multi-Factor Authentication" description="Require MFA for admin and operator accounts">
            <Toggle checked={mfa} onChange={setMfa} />
          </Row>
          <Row label="Session Timeout" description="Auto-logout after inactivity">
            <NumInput value={sessionMin} onChange={setSessionMin} unit="min" />
          </Row>
          <Row label="IP Whitelisting" description="Restrict access to approved IP ranges">
            <Toggle checked={ipWhitelist} onChange={setIpWhitelist} />
          </Row>
          <Row label="Audit Log Retention" description="How long security events are stored">
            <NumInput value={auditDays} onChange={setAuditDays} unit="days" />
          </Row>
          <Row label="Session Auth" description="Token signature scheme">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-slate-300 font-mono">Dilithium3 JWT</span>
              <StatusBadge>PQC</StatusBadge>
            </div>
          </Row>
        </Section>

        {/* ═══ NOTIFICATIONS ═══ */}
        <Section icon={Bell} title="Notifications" description="Alert channels and severity thresholds">
          <Row label="Email Alerts" description="Send to admin email addresses">
            <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
          </Row>
          <Row label="Slack Integration" description="Post to configured Slack channel">
            <Toggle checked={slackAlerts} onChange={setSlackAlerts} />
          </Row>
          <Row label="PagerDuty Escalation" description="Route critical alerts to on-call">
            <Toggle checked={pagerDuty} onChange={setPagerDuty} />
          </Row>
          <Row label="Alert Threshold" description="Minimum severity to trigger alerts">
            <Select value={threshold} onChange={setThreshold} options={[
              { value: 'info', label: 'Info & above' },
              { value: 'warning', label: 'Warning & above' },
              { value: 'critical', label: 'Critical only' },
            ]} />
          </Row>
        </Section>

        {/* ═══ NETWORK ═══ */}
        <Section icon={Globe} title="Network & API" description="Rate limits, telemetry, and proxy settings">
          <Row label="API Rate Limit" description="Max requests per minute per client">
            <NumInput value={rateLimit} onChange={setRateLimit} unit="req/min" />
          </Row>
          <Row label="Telemetry Interval" description="Metrics collection frequency">
            <NumInput value={telemetryInt} onChange={setTelemetryInt} unit="sec" />
          </Row>
          <Row label="TLS Proxy Mode" description="How PQC proxy intercepts connections">
            <Select value={proxyMode} onChange={setProxyMode} options={[
              { value: 'transparent', label: 'Transparent (inline)' },
              { value: 'sidecar', label: 'Sidecar (Kubernetes)' },
              { value: 'reverse', label: 'Reverse Proxy' },
            ]} />
          </Row>
          <Row label="Backend API" description="Primary service endpoint">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-slate-300 font-mono">api.pqc-vault.io/v1</span>
              <StatusBadge>LIVE</StatusBadge>
            </div>
          </Row>
        </Section>

        {/* ═══ COMPLIANCE ═══ */}
        <Section icon={CheckCircle} title="Compliance Status" description="NIST and ITU-T standard compliance">
          {[
            { std: 'FIPS 203 (ML-KEM)', status: 'Compliant', v: 'success', detail: 'Kyber768/1024 implemented' },
            { std: 'FIPS 204 (ML-DSA)', status: 'Compliant', v: 'success', detail: 'Dilithium3/5 implemented' },
            { std: 'FIPS 205 (SLH-DSA)', status: 'Partial', v: 'warning', detail: 'SPHINCS+ for code signing only' },
            { std: 'CNSA 2.0 Timeline', status: 'On Track', v: 'success', detail: 'Classical sunset: 2026-06-01' },
            { std: 'ITU-T X.1702', status: 'Aligned', v: 'success', detail: 'PQC framework compliance' },
          ].map((c, i) => (
            <Row key={i} label={c.std} description={c.detail}>
              <StatusBadge variant={c.v}>{c.status}</StatusBadge>
            </Row>
          ))}
        </Section>

        {/* ═══ ABOUT ═══ */}
        <div className="bg-[rgba(15,23,42,0.25)] border border-slate-800/25 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                <span className="text-[9px] font-extrabold text-white">PQ</span>
              </div>
              <div>
                <span className="text-[13px] font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>PQC Shield</span>
                <span className="text-[10px] text-slate-600 font-mono ml-2">v1.0-mvp</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-600 font-mono">
              <span>Build 2026.03.02</span>
              <span>·</span>
              <span>Next.js 14 · React 18</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
