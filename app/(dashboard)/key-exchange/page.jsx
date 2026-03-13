'use client';
import { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { ArrowRight, Lock, Unlock, Key, Shield, RefreshCw } from 'lucide-react';

/* ── Animated particle flowing along a path ── */
function Particle({ active, color = '#a78bfa', delay = 0 }) {
    return (
        <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full shadow-lg"
            style={{
                background: color,
                boxShadow: `0 0 10px ${color}`,
                left: active ? '100%' : '0%',
                transition: `left 1.8s ease-in-out ${delay}s, opacity 0.3s`,
                opacity: active ? 1 : 0,
            }}
        />
    );
}

/* ── A node box (Server / Client) ── */
function Node({ label, sublabel, icon: Icon, color, side, children }) {
    return (
        <div className={`flex flex-col items-center gap-2 ${side === 'right' ? 'items-end' : 'items-start'}`}>
            <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 relative"
                style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)`, borderColor: `${color}30` }}
            >
                <Icon size={36} style={{ color }} />
                {children}
            </div>
            <div className="text-center">
                <div className="text-sm font-bold text-white">{label}</div>
                <div className="text-[10px] text-slate-500 font-mono">{sublabel}</div>
            </div>
        </div>
    );
}

/* ── Step labels along the flow ── */
function Step({ number, label, active }) {
    return (
        <div className={`flex flex-col items-center gap-1 transition-all duration-500 ${active ? 'scale-110' : 'scale-100 opacity-50'}`}>
            <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border"
                style={{
                    background: active ? '#a78bfa22' : 'transparent',
                    borderColor: active ? '#a78bfa' : '#334155',
                    color: active ? '#a78bfa' : '#475569',
                }}
            >
                {number}
            </div>
            <span className="text-[9px] text-slate-500 text-center leading-tight max-w-[60px]">{label}</span>
        </div>
    );
}

const STEPS = [
    { id: 0, title: 'Step 1: Server sends Public Key', desc: 'The server generates a Kyber768 key pair. The PUBLIC key is sent to the client openly — anyone can see it. The PRIVATE key stays on the server and is never shared.', color: '#38bdf8', particle: '#38bdf8', direction: 'right', label: 'Server → Client' },
    { id: 1, title: 'Step 2: Client encapsulates a Secret', desc: 'The client uses the server\'s Public Key to "encapsulate" a random secret. It produces a Ciphertext (encrypted message) and keeps the Shared Secret locally.', color: '#a78bfa', particle: '#a78bfa', direction: 'left', label: 'Client → Server' },
    { id: 2, title: 'Step 3: Server decapsulates', desc: 'The server receives the Ciphertext and uses its PRIVATE Key to "decapsulate" it — recovering the same Shared Secret. Only the private key holder can do this.', color: '#22c55e', particle: '#22c55e', direction: 'right', label: 'Key Confirmed ✓' },
    { id: 3, title: 'Step 4: Encrypted Session Begins', desc: 'Both sides now have the same Shared Secret. This becomes the Session Key for symmetric AES-256 encryption. All further communication is quantum-safe.', color: '#f59e0b', particle: '#f59e0b', direction: 'both', label: 'Bidirectional Secure' },
];

import { useWebSocket, useWebSocketMessages } from '@/lib/useWebSocket';
import { getWebSocketURL } from '@/lib/api';

export default function KeyExchangePage() {
    const [step, setStep] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [mode, setMode] = useState('demo'); // 'demo' or 'live'
    const [lastHandshake, setLastHandshake] = useState(null);

    // WebSocket connection for Live Mode
    const wsUrl = useMemo(() => getWebSocketURL(), []);
    const { lastMessage } = useWebSocket(wsUrl);
    const handshakesMsg = useWebSocketMessages(lastMessage, 'handshake_stream');

    // Live mode trigger
    useEffect(() => {
        if (mode !== 'live' || !handshakesMsg || !handshakesMsg.handshakes || handshakesMsg.handshakes.length === 0) return;

        // Get the latest handshake
        const latest = handshakesMsg.handshakes[0];
        setLastHandshake(latest);

        // Run the 4-step animation sequence fast
        if (animating) return;
        setAnimating(true);
        setStep(0);

        const runSequence = async () => {
            await new Promise(r => setTimeout(r, 400));
            setStep(1);
            await new Promise(r => setTimeout(r, 400));
            setStep(2);
            await new Promise(r => setTimeout(r, 400));
            setStep(3);
            await new Promise(r => setTimeout(r, 600));
            setAnimating(false);
        };
        runSequence();
    }, [handshakesMsg, mode]);


    // Demo auto-play trigger
    const nextStep = () => {
        if (animating || mode === 'live') return;
        setAnimating(true);
        setTimeout(() => {
            setStep(s => (s + 1) % STEPS.length);
            setAnimating(false);
        }, 400);
    };

    const prevStep = () => {
        if (animating || mode === 'live') return;
        setStep(s => (s - 1 + STEPS.length) % STEPS.length);
    };

    useEffect(() => {
        if (mode !== 'demo') return;
        const t = setInterval(nextStep, 3500);
        return () => clearInterval(t);
    }, [mode, animating]);

    const current = STEPS[step];

    // Dynamic algorithm display
    const algoName = mode === 'live' && lastHandshake ? lastHandshake.kem : 'Kyber768';
    const isPQC = algoName.includes('Kyber');
    const displayColor = isPQC ? '#a78bfa' : '#fbbf24';

    return (<>
        <PageHeader title="Key Exchange Visualizer" subtitle="How KEM key exchange works — step by step">
            <div className="flex items-center gap-2 bg-surface-raised p-1 rounded-lg border border-slate-800">
                <button
                    onClick={() => { setMode('demo'); setStep(0); }}
                    className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all ${mode === 'demo' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    ▶ Auto Demo
                </button>
                <div className="w-px h-3 bg-slate-700 mx-1" />
                <button
                    onClick={() => { setMode('live'); setStep(0); }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-semibold transition-all ${mode === 'live' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <div className={`w-1.5 h-1.5 rounded-full ${mode === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                    Live Network
                </button>
            </div>
        </PageHeader>

        {/* Main Diagram */}
        <Card>
            <div className="py-6 px-4">
                {/* Live info badge */}
                {mode === 'live' && (
                    <div className="flex justify-center mb-6">
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5 flex items-center gap-3">
                            <span className="text-[10px] text-slate-400 font-mono">LATEST HANDSHAKE</span>
                            <span className="text-xs font-bold" style={{ color: displayColor }}>{algoName}</span>
                            {lastHandshake?.latency_ms && <span className="text-[10px] text-slate-500">{lastHandshake.latency_ms}ms</span>}
                        </div>
                    </div>
                )}

                {/* Nodes + Flow line */}
                <div className="relative flex items-center justify-between gap-4 mb-8">
                    {/* Server Node */}
                    <Node label="Server" sublabel={algoName} icon={Shield} color="#22c55e" side="left">
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Lock size={8} className="text-white" />
                        </div>
                    </Node>

                    {/* Flow line with particles */}
                    <div className="flex-1 flex flex-col gap-3">
                        {/* Steps indicator */}
                        <div className="flex justify-between px-2 mb-2">
                            {STEPS.map((s, i) => (
                                <Step key={i} number={i + 1} label={s.label} active={step === i} />
                            ))}
                        </div>

                        {/* Animated flow lanes */}
                        <div className="relative">
                            {/* Right-going lane (Server → Client) */}
                            <div className="relative h-10 flex items-center">
                                <div className="w-full h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #22c55e33, #38bdf833)' }} />
                                <div className="absolute left-0 right-0 h-px bg-transparent">
                                    {(current.direction === 'right' || current.direction === 'both') && (
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 h-2.5 rounded-full shadow-lg transition-all"
                                            style={{
                                                background: current.particle,
                                                boxShadow: `0 0 12px ${current.particle}`,
                                                width: animating ? '0%' : '100%',
                                                left: 0,
                                                transition: 'width 1.5s ease-in-out',
                                                opacity: 0.8,
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] text-slate-600 font-mono pr-1">→</div>
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] px-1.5 py-0.5 rounded font-mono"
                                    style={{ background: `${current.color}15`, color: current.color }}>
                                    {current.direction === 'right' ? '📤 Public Key' : current.direction === 'both' ? '🔒 Encrypted Data' : '⬆️ Ciphertext'}
                                </div>
                            </div>

                            {/* Left-going lane (Client → Server) */}
                            <div className="relative h-10 flex items-center">
                                <div className="w-full h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #a78bfa33, #22c55e33)' }} />
                                {(current.direction === 'left' || current.direction === 'both') && (
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 h-2.5 rounded-full shadow-lg"
                                        style={{
                                            background: current.particle,
                                            boxShadow: `0 0 12px ${current.particle}`,
                                            width: '100%',
                                            right: 0,
                                            left: 'auto',
                                            transition: 'width 1.5s ease-in-out',
                                            opacity: 0.8,
                                        }}
                                    />
                                )}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[9px] text-slate-600 font-mono pl-1">←</div>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] px-1.5 py-0.5 rounded font-mono"
                                    style={{ background: `${current.color}15`, color: current.color }}>
                                    {current.direction === 'left' ? '📦 Ciphertext' : current.direction === 'both' ? '🔒 Encrypted Data' : ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Client Node */}
                    <Node label="Client" sublabel={algoName} icon={Key} color="#38bdf8" side="right">
                        <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center">
                            <Unlock size={8} className="text-white" />
                        </div>
                    </Node>
                </div>

                {/* Step description */}
                <div
                    className="rounded-xl p-4 border transition-all duration-500 mb-6"
                    style={{ background: `${current.color}08`, borderColor: `${current.color}25` }}
                >
                    <div className="text-sm font-bold mb-1" style={{ color: current.color }}>{current.title}</div>
                    <p className="text-[12px] text-slate-400 leading-relaxed">{current.desc}</p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button onClick={prevStep} disabled={step === 0} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-xs disabled:opacity-30 hover:bg-slate-800 transition-colors">← Previous</button>
                    <div className="flex gap-2">
                        {STEPS.map((_, i) => (
                            <button key={i} onClick={() => setStep(i)}
                                className="w-2 h-2 rounded-full transition-all"
                                style={{ background: step === i ? current.color : '#334155' }}
                            />
                        ))}
                    </div>
                    <button onClick={nextStep} className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                        style={{ background: `${current.color}20`, borderColor: `${current.color}30`, color: current.color, border: '1px solid' }}>
                        {step === STEPS.length - 1 ? 'Restart ↺' : 'Next →'}
                    </button>
                </div>
            </div>
        </Card>

        {/* Key types legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {[
                { icon: '🔑', label: 'Public Key', color: '#38bdf8', desc: 'Shared openly. Used to ENCRYPT / encapsulate. Safe to publish.' },
                { icon: '🔒', label: 'Private Key', color: '#ef4444', desc: 'Never shared. Used to DECRYPT / decapsulate. Known only to its owner.' },
                { icon: '🤝', label: 'Shared Secret', color: '#22c55e', desc: 'Derived independently by both sides. Becomes the AES session key.' },
            ].map((k, i) => (
                <div key={i} className="rounded-xl p-4 border" style={{ background: `${k.color}08`, borderColor: `${k.color}20` }}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{k.icon}</span>
                        <span className="text-sm font-bold" style={{ color: k.color }}>{k.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{k.desc}</p>
                </div>
            ))}
        </div>

        {/* vs classical comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <Card title="Live Payload Inspector" className="h-full">
                <div className="bg-slate-950 rounded-lg p-3 font-mono text-[10px] leading-relaxed h-[220px] overflow-y-auto border border-slate-800">
                    <div className="text-slate-500 mb-2">// Intercepting KEM Handshake...</div>

                    {step >= 0 && (
                        <div className="mb-2">
                            <span className="text-sky-400">[SERVER]</span> Generating {algoName} Keypair...<br />
                            <span className="text-slate-400">&gt; Public Key (1184 bytes): </span>
                            <span className="text-sky-200 break-all">{lastHandshake?.keys?.server_public_key || `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('')}...`}</span>
                        </div>
                    )}

                    {step >= 1 && (
                        <div className="mb-2">
                            <span className="text-violet-400">[CLIENT]</span> Encapsulating Shared Secret...<br />
                            <span className="text-slate-400">&gt; Ciphertext (1088 bytes): </span>
                            <span className="text-violet-200 break-all">{lastHandshake?.keys?.ciphertext || `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('')}...`}</span><br />
                            <span className="text-slate-400">&gt; Client Secret (32 bytes): </span>
                            <span className="text-emerald-300 break-all">{lastHandshake?.keys?.shared_secret || `0x${Array.from({ length: 8 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('')}...`}</span>
                        </div>
                    )}

                    {step >= 2 && (
                        <div className="mb-2">
                            <span className="text-emerald-400">[SERVER]</span> Decapsulating Ciphertext with Private Key...<br />
                            <span className="text-slate-400">&gt; Server Secret (32 bytes): </span>
                            <span className="text-emerald-300 break-all">{lastHandshake?.keys?.shared_secret || `0x${Array.from({ length: 8 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('')}...`}</span>
                        </div>
                    )}

                    {step >= 3 && (
                        <div className="text-amber-400 font-bold mt-2">
                            [SUCCESS] Secrets match! AES-256-GCM Session Established.
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Classical RSA vs PQC Kyber768" className="h-full">
                <div className="grid grid-cols-2 gap-4 py-2">
                    {[
                        { label: 'Algorithm', rsa: 'RSA-2048 / ECDH', kyber: 'Kyber768 (ML-KEM)' },
                        { label: 'Key Type', rsa: 'Mathematical (factoring)', kyber: 'Lattice-based (LWE)' },
                        { label: 'Post-Quantum Safe', rsa: '❌ Broken by Shor\'s algo', kyber: '✅ NIST FIPS 203 certified' },
                        { label: 'Key Size', rsa: '256 bytes public key', kyber: '1184 bytes public key' },
                        { label: 'Security Bits', rsa: '112 bits (vs quantum)', kyber: '178 bits (quantum-safe)' },
                        { label: 'CNSA 2.0', rsa: '❌ Not approved', kyber: '✅ Required by 2030' },
                    ].map((row, i) => (
                        <div key={i} className="contents">
                            <div className="col-span-2 grid grid-cols-3 gap-2 py-2 border-b border-slate-800/30 last:border-0">
                                <span className="text-[11px] text-slate-500">{row.label}</span>
                                <span className="text-[11px] text-amber-400 font-mono">{row.rsa}</span>
                                <span className="text-[11px] text-emerald-400 font-mono">{row.kyber}</span>
                            </div>
                        </div>
                    ))}
                    <div className="col-span-2 grid grid-cols-3 gap-2 pt-1">
                        <span />
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Classical</span>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">PQC (Kyber)</span>
                    </div>
                </div>
            </Card>
        </div>

        <div className="mt-4 flex justify-center">
            <Link href="/keys" className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center gap-1 no-underline">
                View live key vault <ArrowRight size={11} />
            </Link>
        </div>
    </>);
}
