export default function DonutChart({ segments, data, size = 120 }) {
  // Normalize input: support both formats
  // Format A (tls_page): segments = [{ value, color }]
  // Format B (dashboard/telemetry): data = [{ label, percentage, color }]
  const normalizedSegments = segments
    ? segments.filter(s => s.value > 0)
    : (data || []).filter(d => d.percentage > 0).map(d => ({
        value: d.percentage,
        color: d.color,
        label: d.label,
      }));

  const total = normalizedSegments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={42} fill="none" stroke="rgba(51,65,85,0.25)" strokeWidth="10" />
        <text x="60" y="56" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="600">—</text>
        <text x="60" y="72" textAnchor="middle" fill="#64748b" fontSize="8">NO DATA</text>
      </svg>
    );
  }

  const r = 42;
  const circ = 2 * Math.PI * r;
  let cum = 0;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      {/* Background ring */}
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(51,65,85,0.25)" strokeWidth="10" />

      {/* Segments */}
      {normalizedSegments.map((seg, i) => {
        const offset = (cum / total) * circ;
        const length = (seg.value / total) * circ;
        cum += seg.value;
        return (
          <circle
            key={i}
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="10"
            strokeDasharray={`${length} ${circ - length}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        );
      })}

      {/* Center text */}
      <text
        x="60" y="56"
        textAnchor="middle"
        fill="#f1f5f9"
        fontSize="18"
        fontWeight="700"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {total % 1 === 0 ? total : total.toFixed(1)}
      </text>
      <text
        x="60" y="72"
        textAnchor="middle"
        fill="#64748b"
        fontSize="8"
        letterSpacing="0.8"
      >
        TOTAL
      </text>
    </svg>
  );
}
