'use client';

import { useState } from 'react';
import { PageHeader, Card, Badge, FilterTabs } from '@/components/ui';
import { AUDIT_LOGS } from '@/constants';
import { getSeverityVariant } from '@/lib/utils';

export default function AuditPage() {
  const [filterIdx, setFilterIdx] = useState(0);

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        subtitle="Comprehensive security event trail and compliance audit"
        actions={
          <button className="px-3 py-1.5 rounded-lg border border-slate-700/50 text-slate-400 text-[11px] font-semibold hover:text-slate-300 transition-colors">
            Export Logs
          </button>
        }
      />

      <Card>
        <div className="mb-4 overflow-x-auto -mx-1 px-1">
          <FilterTabs tabs={['All Events', 'Critical', 'Warnings', 'Info']} activeIdx={filterIdx} onChange={setFilterIdx} />
        </div>

        {AUDIT_LOGS.map((log, i) => (
          <div key={i} className={`flex items-start gap-2.5 sm:gap-3 py-3 ${i < AUDIT_LOGS.length - 1 ? 'border-b border-slate-800/40' : ''}`}>
            <span
              className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
              style={{ backgroundColor: log.severity === 'critical' ? '#ef4444' : log.severity === 'warning' ? '#f59e0b' : '#475569' }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[10px] text-slate-600 font-mono">{log.ts}</span>
                <Badge variant={getSeverityVariant(log.severity)}>{log.action}</Badge>
                <span className="text-[11px] text-slate-400 hidden sm:inline">{log.actor}</span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-slate-300 mt-1">
                <span className="font-mono text-[10px] sm:text-[11px] text-slate-500">{log.resource}</span>
                <span className="mx-1 text-slate-700">·</span>
                <span className="break-words">{log.detail}</span>
              </p>
              {/* Actor shown below on mobile */}
              <p className="text-[10px] text-slate-500 mt-0.5 sm:hidden">{log.actor}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
