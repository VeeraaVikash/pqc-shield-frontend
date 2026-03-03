import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DOCS_PAGES } from '@/constants/docs';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function generateStaticParams() {
  return DOCS_PAGES.map(doc => ({ slug: doc.slug }));
}

export function generateMetadata({ params }) {
  const doc = DOCS_PAGES.find(d => d.slug === params.slug);
  return { title: doc ? `${doc.title} | PQC Shield Docs` : 'Not Found' };
}

export default function DocPage({ params }) {
  const doc = DOCS_PAGES.find(d => d.slug === params.slug);
  if (!doc) return notFound();

  const currentIdx = DOCS_PAGES.findIndex(d => d.slug === params.slug);
  const prev = currentIdx > 0 ? DOCS_PAGES[currentIdx - 1] : null;
  const next = currentIdx < DOCS_PAGES.length - 1 ? DOCS_PAGES[currentIdx + 1] : null;

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/docs" className="hover:text-white transition-colors no-underline">Docs</Link>
        <span>/</span>
        <span className="text-slate-300">{doc.category}</span>
        <span>/</span>
        <span className="text-slate-300">{doc.title}</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{doc.icon}</span>
          <span className="text-[11px] font-semibold font-mono uppercase tracking-widest" style={{
            color: doc.category === 'Protocols' ? '#a78bfa' : '#38bdf8'
          }}>{doc.category}</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>{doc.title}</h1>
        <p className="text-lg text-slate-400 leading-relaxed">{doc.description}</p>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {doc.sections.map((section, i) => (
          <div key={i} id={section.heading.toLowerCase().replace(/\s+/g, '-')}>
            <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-slate-800/60" style={{ fontFamily: 'var(--font-display)' }}>
              {section.heading}
            </h2>
            {section.heading === 'API Endpoints' ? (
              <div className="bg-surface-raised/60 border border-slate-800/60 rounded-xl p-5 overflow-auto">
                <pre className="text-sm text-slate-300 font-mono leading-loose whitespace-pre-wrap">{section.content}</pre>
              </div>
            ) : (
              <p className="text-[15px] text-slate-400 leading-relaxed whitespace-pre-line">{section.content}</p>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-16 pt-8 border-t border-slate-800/60">
        {prev ? (
          <Link href={`/docs/${prev.slug}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors no-underline">
            <ArrowLeft size={16} /> {prev.title}
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/docs/${next.slug}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors no-underline">
            {next.title} <ArrowRight size={16} />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
