export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div>
        <h1
          className="text-[20px] sm:text-[24px] font-bold text-white tracking-tight leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[12px] text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-wrap">{actions}</div>
      )}
    </div>
  );
}
