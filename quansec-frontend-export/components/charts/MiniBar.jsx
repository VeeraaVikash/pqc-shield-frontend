export default function MiniBar({ data = [], color = '#38bdf8', height = 60 }) {
  if (!data.length) return null;

  const max = Math.max(...data);
  const gap = 1.2;
  const barW = (100 - gap * (data.length - 1)) / data.length;

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="block">
      <defs>
        <linearGradient id="miniBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor={color} stopOpacity="0.25" />
        </linearGradient>
      </defs>
      {data.map((v, i) => {
        const bH = Math.max((v / max) * (height - 6), 2);
        return (
          <rect
            key={i}
            x={i * (barW + gap)}
            y={height - bH - 2}
            width={barW}
            height={bH}
            rx={0.8}
            fill="url(#miniBarGrad)"
          />
        );
      })}
    </svg>
  );
}
