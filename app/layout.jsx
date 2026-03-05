import './globals.css';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
const display = Outfit({ subsets:['latin'], variable:'--font-display', weight:['400','500','600','700','800'] });
const body = Inter({ subsets:['latin'], variable:'--font-body' });
const mono = JetBrains_Mono({ subsets:['latin'], variable:'--font-mono' });
export const metadata = { title:'PQC Shield', description:'Post-Quantum Cryptography Management' };
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-surface-base text-slate-200 font-body antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
