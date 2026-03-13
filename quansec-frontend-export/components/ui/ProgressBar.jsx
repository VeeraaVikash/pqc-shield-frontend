export default function ProgressBar({ value, max = 100, color = '#38bdf8', height = 5 }) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, background: 'rgba(51,65,85,0.35)' }}
    >
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}bb, ${color})`,
          boxShadow: `0 0 10px ${color}25`,
        }}
      />
    </div>
  );
}
