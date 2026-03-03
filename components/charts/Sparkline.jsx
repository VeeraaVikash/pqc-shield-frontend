export default function Sparkline({ data = [], color = '#38bdf8', height = 32 }) {
  if (!data.length) return null;

  const w = 80;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const id = `spark-${color.replace('#', '')}`;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `${points} ${w},${height} 0,${height}`;

  return (
    <svg width={w} height={height} className="block flex-shrink-0 opacity-85">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${id})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
