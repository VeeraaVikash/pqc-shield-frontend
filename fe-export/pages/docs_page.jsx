import Link from 'next/link';
import { DOCS_PAGES, DOCS_CATEGORIES } from '@/constants/docs';
import { ChevronRight } from 'lucide-react';

export default function DocsIndexPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Documentation
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Complete reference for all protocols, features, and API endpoints. Built for your backend team to integrate each module independently.
        </p>
      </div>

      {DOCS_CATEGORIES.map(cat => (
        <div key={cat} className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{
            color: cat === 'Protocols' ? '#a78bfa' : '#38bdf8'
          }}>{cat}</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {DOCS_PAGES.filter(d => d.category === cat).map(doc => (
              <Link key={doc.slug} href={`/docs/${doc.slug}`}
                className="group bg-surface-raised/60 border border-slate-800/60 rounded-xl p-5 hover:border-sky-400/20 transition-all no-underline">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{doc.icon}</span>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>{doc.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{doc.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-mono text-slate-600">{doc.sections.length} sections</span>
                  <span className="text-slate-800">·</span>
                  <span className="text-[10px] font-mono text-slate-600">API endpoints included</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Quick API Reference */}
      <div className="mt-16 bg-surface-raised/40 border border-slate-800/60 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>Backend Team Quick Reference</h2>
        <p className="text-sm text-slate-400 mb-6">All API endpoints follow REST conventions. Base URL: <code className="text-sky-400 font-mono text-xs bg-sky-400/10 px-1.5 py-0.5 rounded">/api/v1</code></p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { method: 'GET', path: '/api/v1/dashboard/stats', desc: 'Dashboard overview metrics' },
            { method: 'GET', path: '/api/v1/inventory', desc: 'Endpoint inventory with filters' },
            { method: 'GET', path: '/api/v1/policies', desc: 'List all PQC policies' },
            { method: 'POST', path: '/api/v1/policies', desc: 'Create new policy' },
            { method: 'GET', path: '/api/v1/tls/connections', desc: 'Active TLS connections' },
            { method: 'GET', path: '/api/v1/ssh/bastions', desc: 'Bastion node status' },
            { method: 'POST', path: '/api/v1/keys/generate', desc: 'Generate PQC key pair' },
            { method: 'GET', path: '/api/v1/telemetry/metrics', desc: 'Handshake telemetry' },
            { method: 'GET', path: '/api/v1/audit', desc: 'Query audit logs' },
            { method: 'GET', path: '/api/v1/qos/slas', desc: 'SLA status and health' },
          ].map((ep, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface-base/40 border border-slate-800/40">
              <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                ep.method === 'GET' ? 'bg-green-500/10 text-green-400' : 'bg-sky-400/10 text-sky-400'
              }`}>{ep.method}</span>
              <code className="text-xs text-slate-300 font-mono flex-1">{ep.path}</code>
              <span className="text-[11px] text-slate-500 hidden lg:block">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
