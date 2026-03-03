'use client';

import { PageHeader, Card, StatusDot, ProgressBar } from '@/components/ui';
import { Sparkline } from '@/components/charts';
import { TELEMETRY_METRICS, ALGO_USAGE, TELEMETRY_PIPELINE } from '@/constants';

export default function TelemetryPage() {
  return (
    <div>
      <PageHeader title="Telemetry & Analytics" subtitle="Handshake telemetry, algorithm usage, and performance analytics" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {TELEMETRY_METRICS.map((m, i) => (
          <Card key={i}>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">{m.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-xl sm:text-2xl font-bold text-slate-100" style={{ fontFamily: 'var(--font-display)' }}>{m.value}</p>
              <span className={`text-[10px] font-semibold ${
                m.label.includes('Failure') || m.label.includes('Duration') ? 'text-green-400' : m.trending === 'up' ? 'text-green-400' : 'text-amber-300'
              }`}>{m.change}</span>
            </div>
            <div className="mt-2"><Sparkline data={m.data} color="#38bdf8" /></div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Algorithm Usage Breakdown</h3>
          {ALGO_USAGE.map((a, i) => (
            <div key={i} className="mb-3.5 last:mb-0">
              <div className="flex justify-between mb-1">
                <span className="text-[11px] text-slate-300 font-mono">{a.algo}</span>
                <span className="text-[11px] text-slate-400">{a.count.toLocaleString()} ({a.pct}%)</span>
              </div>
              <ProgressBar value={a.pct} color={a.algo.includes('Classic') ? '#fbbf24' : '#a78bfa'} height={5} />
            </div>
          ))}
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Telemetry Pipeline Status</h3>
          <div className="flex flex-col gap-2.5">
            {TELEMETRY_PIPELINE.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2.5 bg-surface-base/40 rounded-lg border border-slate-800/40">
                <div className="flex items-center gap-2">
                  <StatusDot status={s.status} />
                  <span className="text-[12px] text-slate-200 font-medium">{s.stage}</span>
                </div>
                <div className="flex gap-3 sm:gap-5">
                  <span className="text-[10px] text-slate-400 font-mono">{s.throughput}</span>
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">lag: {s.lag}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
