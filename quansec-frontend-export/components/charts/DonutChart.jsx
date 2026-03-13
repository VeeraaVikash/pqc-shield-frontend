export default function DonutChart({ segments = [], size = 120 }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const r = 42;
  const circ = 2 * Math.PI * r;
  let cum = 0;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      {/* Background ring */}
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(51,65,85,0.25)" strokeWidth="10" />

      {/* Segments */}
      {segments.map((seg, i) => {
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
        {total}
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
