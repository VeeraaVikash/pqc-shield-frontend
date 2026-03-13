import { getStatusColor } from '@/lib/utils';

export default function StatusDot({ status = 'inactive', size = 8 }) {
  const color = getStatusColor(status);
  const pulse = status === 'active' || status === 'critical';

  return (
    <span className="relative inline-flex flex-shrink-0" style={{ width: size, height: size }}>
      {pulse && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-40"
          style={{ backgroundColor: color }}
        />
      )}
      <span
        className="relative inline-block w-full h-full rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: pulse ? `0 0 8px ${color}60` : 'none',
        }}
      />
    </span>
  );
}
