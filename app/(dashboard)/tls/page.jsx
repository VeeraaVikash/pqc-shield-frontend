'use client';

import { PageHeader, Card, Badge, StatusDot, DataTable } from '@/components/ui';
import { TLS_CONNECTIONS } from '@/constants';
import { getAlgoBadgeVariant } from '@/lib/utils';

const ARCH_STEPS = [
  { label: 'Client', sub: 'TLS Client Hello', color: '#38bdf8' },
  { label: 'PQC Proxy', sub: 'Kyber768 KEM + Dilithium3 Auth', color: '#a78bfa' },
  { label: 'Backend', sub: 'Plaintext / mTLS Forward', color: '#22c55e' },
];

export default function TLSPage() {
  const columns = [
    { key: 'id', label: 'Conn ID', mono: true },
    { key: 'src', label: 'Source', mono: true },
    { key: 'dst', label: 'Destination', mono: true },
    { label: 'KEM', render: (r) => <Badge variant={getAlgoBadgeVariant(r.kem)}>{r.kem}</Badge> },
    { label: 'Signature', render: (r) => <Badge variant={getAlgoBadgeVariant(r.sig)}>{r.sig}</Badge> },
    { label: 'Mode', render: (r) => <Badge variant={r.mode === 'PQC-Only' ? 'success' : r.mode === 'Hybrid' ? 'info' : 'warning'}>{r.mode}</Badge> },
    { key: 'latency', label: 'Latency', mono: true },
    { label: 'Status', render: (r) => <span className="flex items-center gap-1.5"><StatusDot status={r.status} />{r.status}</span> },
  ];

  return (
    <div>
      <PageHeader title="TLS Integration" subtitle="PQC-enabled TLS proxy/sidecar management" />

      {/* Architecture — responsive: vertical on mobile, horizontal on desktop */}
      <Card className="mb-5 !p-5 sm:!p-7">
        <h3 className="text-sm font-semibold text-slate-200 mb-5">Proxy/Sidecar Architecture</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0">
          {ARCH_STEPS.map((node, i) => (
            <div key={i} className="contents">
              <div className="flex flex-col items-center px-5 sm:px-6 py-4 bg-surface-base/50 rounded-xl w-full sm:w-auto sm:min-w-[160px]"
                style={{ border: `1px solid ${node.color}30` }}>
                <span className="text-[13px] font-semibold text-slate-200">{node.label}</span>
                <span className="text-[10px] text-slate-500 text-center mt-1">{node.sub}</span>
              </div>
              {i < ARCH_STEPS.length - 1 && (
                <>
                  {/* Horizontal arrow (desktop) */}
                  <div className="hidden sm:flex items-center px-2">
                    <svg width="50" height="20"><line x1="0" y1="10" x2="40" y2="10" stroke="#475569" strokeWidth="2" strokeDasharray="4 3" />
                      <polygon points="40,5 50,10 40,15" fill="#475569" /></svg>
                  </div>
                  {/* Vertical arrow (mobile) */}
                  <div className="sm:hidden flex justify-center py-1">
                    <svg width="20" height="24"><line x1="10" y1="0" x2="10" y2="16" stroke="#475569" strokeWidth="2" strokeDasharray="4 3" />
                      <polygon points="5,16 10,24 15,16" fill="#475569" /></svg>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Active TLS Connections</h3>
          <Badge variant="info">{TLS_CONNECTIONS.length} active</Badge>
        </div>
        <DataTable columns={columns} data={TLS_CONNECTIONS} />
      </Card>
    </div>
  );
}
