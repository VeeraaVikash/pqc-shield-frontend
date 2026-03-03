import { DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// Space Grotesk loaded via CSS since next/font has limited weights
export const metadata = {
  title: 'PQC Shield | Post-Quantum Cryptography VPN Platform',
  description: 'Enterprise-grade post-quantum cryptography management for secure VPN infrastructure. Protect your organization against quantum threats with hybrid KEM, policy enforcement, and real-time telemetry.',
  keywords: 'PQC, post-quantum, cryptography, VPN, Kyber, Dilithium, NIST, FIPS, enterprise security',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`
          :root { --font-display: 'Outfit', system-ui, sans-serif; }
        `}</style>
      </head>
      <body className="font-body bg-surface-base text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
