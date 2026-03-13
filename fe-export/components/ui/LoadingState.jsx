export default function LoadingState({ label }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-sky-400 rounded-full animate-spin" />
        <span className="text-xs text-slate-500">{label || 'Loading...'}</span>
      </div>
    </div>
  );
}
