'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Shield, Lock, Globe, Terminal, Zap, ArrowRight, CheckCircle, ChevronRight, Menu, X, BookOpen, BarChart3 } from 'lucide-react';
import { HOMEPAGE_NAV } from '@/constants/navigation';
import { api } from '@/lib/api';

const ParticleHero = dynamic(() => import('@/components/ui/ParticleHero'), { ssr: false });
const BentoGrid = dynamic(() => import('@/components/ui/BentoGrid'), { ssr: false });

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-surface-base/90 backdrop-blur-2xl border-b border-slate-800/40 py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2.5 no-underline">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                        <span className="text-sm font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>PQ</span>
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>PQC Shield</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    {HOMEPAGE_NAV.map(n => (
                        <Link key={n.label} href={n.href} className="text-sm text-slate-400 hover:text-white transition-colors no-underline">{n.label}</Link>
                    ))}
                </nav>
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors no-underline px-3 py-1.5">Sign In</Link>
                    <Link href="/dashboard" className="text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2 rounded-lg no-underline hover:opacity-90 transition-opacity">
                        Dashboard →
                    </Link>
                </div>
                <button className="md:hidden text-slate-400" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            {mobileOpen && (
                <div className="md:hidden border-t border-slate-800/40 bg-surface-base/95 backdrop-blur-2xl p-4 space-y-2 animate-fade-in">
                    {HOMEPAGE_NAV.map(n => (
                        <Link key={n.label} href={n.href} onClick={() => setMobileOpen(false)} className="block text-slate-300 py-2 px-3 rounded-lg hover:bg-slate-800/40 no-underline">{n.label}</Link>
                    ))}
                    <Link href="/login" className="block text-slate-300 py-2 px-3 no-underline">Sign In</Link>
                    <Link href="/dashboard" className="block text-white bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 px-4 rounded-lg text-center font-semibold no-underline mt-2">Dashboard →</Link>
                </div>
            )}
        </header>
    );
};

function LiveStats() {
    const [stats, setStats] = useState(null);
    useEffect(() => {
        const fetchStats = async () => {
            const data = await api.getProtocolOverview();
            if (data) setStats(data.summary);
        };
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);
    const items = [
        { value: '4', label: 'Protocol Integrations' },
        { value: stats?.total_connections ? stats.total_connections.toLocaleString() : '—', label: 'Active Connections', live: true },
        { value: stats?.uptime || '99.97%', label: 'Uptime' },
        { value: stats?.overall_pqc_coverage ? stats.overall_pqc_coverage + '%' : '—', label: 'PQC Coverage', live: true },
    ];
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            {items.map((s, i) => (
                <div key={i} className="text-center">
                    <p className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-1" style={{ fontFamily: 'var(--font-display)' }}>
                        {s.live && stats && (
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                            </span>
                        )}
                        {s.value}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
            ))}
        </div>
    );
}

const ProtocolCard = ({ icon: Icon, title, status, statusColor, description, algorithms, link }) => (
    <div className="group relative bg-surface-raised/60 border border-slate-800/60 rounded-2xl p-6 hover:border-sky-400/20 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Icon size={24} />
            </div>
            <span className={`text-[11px] font-semibold font-mono px-2.5 py-1 rounded-md border ${statusColor}`}>{status}</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">{description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
            {algorithms.map(a => (
                <span key={a} className="text-[10px] font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">{a}</span>
            ))}
        </div>
        <Link href={link} className="inline-flex items-center gap-1 text-sm text-sky-400 font-medium no-underline group-hover:gap-2 transition-all">
            Learn more <ChevronRight size={14} />
        </Link>
    </div>
);

export default function HomePage() {
    return (
        <div className="min-h-screen bg-surface-base text-slate-200">
            <Navbar />

            {/* HERO WITH PARTICLE EFFECT */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
                <ParticleHero />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5 mb-8 animate-fade-in backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
                        <span className="text-xs text-slate-400">NIST FIPS 203 / 204 / 205 Compliant</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 animate-slide-up mix-blend-difference" style={{ fontFamily: 'var(--font-display)', animationDelay: '0.1s', animationFillMode: 'both' }}>
                        Quantum-Proof Your<br /><span className="text-gradient">Network Security</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                        Enterprise post-quantum cryptography platform protecting VPN infrastructure across TLS, SSH, IPsec, and WPA3 with hybrid KEM, centralized policy enforcement, and real-time telemetry.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base no-underline hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20">
                            Open Dashboard <ArrowRight size={18} />
                        </Link>
                        <Link href="/docs" className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 text-slate-300 font-medium px-6 py-3.5 rounded-xl text-base no-underline hover:bg-slate-800 hover:text-white transition-colors backdrop-blur-sm">
                            <BookOpen size={18} /> Read the Docs
                        </Link>
                    </div>
                    <LiveStats />
                </div>
            </section>

            {/* PROTOCOLS */}
            <section id="protocols" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Protocol Coverage</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4" style={{ fontFamily: 'var(--font-display)' }}>Four Protocols, One Platform</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Unified PQC protection across your entire network stack.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <ProtocolCard icon={Lock} title="TLS 1.3 + Kyber768" status="ACTIVE" statusColor="bg-green-500/10 text-green-400 border-green-500/20" description="Hybrid post-quantum key exchange for all HTTPS/TLS connections." algorithms={['CRYSTALS-Kyber768', 'X25519', 'Dilithium3', 'ECDSA P-384']} link="/tls" />
                        <ProtocolCard icon={Terminal} title="SSH + Dilithium3" status="ACTIVE" statusColor="bg-green-500/10 text-green-400 border-green-500/20" description="Quantum-resistant SSH authentication through bastion/agent model." algorithms={['Dilithium3', 'Kyber768', 'Ed25519', 'RSA-4096']} link="/ssh" />
                        <ProtocolCard icon={Shield} title="IPsec + Hybrid IKEv2" status="ACTIVE" statusColor="bg-green-500/10 text-green-400 border-green-500/20" description="Post-quantum IKEv2 key exchange for site-to-site VPN tunnels." algorithms={['Kyber1024', 'Dilithium5', 'DH Group 20', 'AES-256-GCM']} link="/ipsec" />
                        <ProtocolCard icon={Globe} title="WireGuard + PQC" status="ACTIVE" statusColor="bg-green-500/10 text-green-400 border-green-500/20" description="Quantum-resistant VPN overlay with WireGuard performance." algorithms={['Kyber768', 'Dilithium3', 'Noise_IK', 'ChaCha20']} link="/vpn" />
                    </div>
                </div>
            </section>

            {/* BENTO GRID */}
            <section id="platform" className="py-20 px-6 bg-surface-raised/30">
                <div className="max-w-7xl mx-auto"><BentoGrid /></div>
            </section>

            {/* ARCHITECTURE */}
            <section id="architecture" className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">System Design</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4" style={{ fontFamily: 'var(--font-display)' }}>Architecture Overview</h2>
                    </div>
                    <div className="bg-surface-raised/40 border border-slate-800/60 rounded-2xl p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Protocol Layer', items: ['TLS 1.3 Proxy', 'SSH Bastion', 'IPsec Gateway', 'WireGuard Overlay'], color: 'from-violet-500/20 to-violet-600/10', border: 'border-violet-500/20' },
                                { label: 'Core Platform', items: ['Policy Engine', 'Key Management', 'Crypto Services', 'Certificate Authority'], color: 'from-sky-500/20 to-sky-600/10', border: 'border-sky-500/20' },
                                { label: 'Observability', items: ['WebSocket Streaming', 'Audit Logging', 'QoS Monitoring', 'Alert Engine'], color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/20' },
                            ].map((col, i) => (
                                <div key={i} className={`rounded-xl p-5 bg-gradient-to-b ${col.color} border ${col.border}`}>
                                    <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>{col.label}</h4>
                                    <div className="space-y-2">
                                        {col.items.map((item, j) => (<div key={j} className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400 flex-shrink-0" /><span className="text-[13px] text-slate-300">{item}</span></div>))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-center"><p className="text-xs text-slate-500 font-mono">FastAPI Backend → WebSocket Live Feed → Next.js Dashboard → Real-Time Monitoring</p></div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>Ready to Get Started?</h2>
                    <p className="text-slate-400 mb-8">Access the dashboard, explore the documentation, or dive into the API reference.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold px-8 py-3.5 rounded-xl no-underline">Open Dashboard <ArrowRight size={18} /></Link>
                        <Link href="/docs" className="inline-flex items-center gap-2 border border-slate-700 text-slate-300 font-medium px-6 py-3.5 rounded-xl no-underline hover:bg-slate-800 transition-colors"><BookOpen size={18} /> Browse Docs</Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-800/60 py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center"><span className="text-[10px] font-extrabold text-white">PQ</span></div>
                        <span className="text-sm text-slate-500">PQC Shield Platform · NIST Compliant · CNSA 2.0 Aligned</span>
                    </div>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <Link href="/docs" className="hover:text-white transition-colors no-underline">Docs</Link>
                        <Link href="/dashboard" className="hover:text-white transition-colors no-underline">Dashboard</Link>
                        <Link href="/login" className="hover:text-white transition-colors no-underline">Sign In</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
