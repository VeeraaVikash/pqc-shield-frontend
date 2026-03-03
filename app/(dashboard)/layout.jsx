import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

export const metadata = { title: 'Dashboard | PQC Shield' };

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-surface-base text-slate-200 font-body overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-7 pb-20 md:pb-7 relative">
        <div className="grid-bg fixed inset-0 pointer-events-none z-0" />
        <div className="fixed -top-48 -right-48 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent 70%)' }} />
        <div className="relative z-10 max-w-[1200px] animate-fade-in">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
