'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Globe, Shield, Zap, BarChart3 } from 'lucide-react';

function TypeTester() {
    const [scale, setScale] = useState(1);
    useEffect(() => {
        const interval = setInterval(() => setScale(prev => prev === 1 ? 1.5 : 1), 2000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="flex items-center justify-center h-full">
            <motion.span className="font-display text-6xl md:text-8xl text-white font-medium" animate={{ scale }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>PQ</motion.span>
        </div>
    );
}

function LayoutAnimation() {
    const [layout, setLayout] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setLayout(prev => (prev + 1) % 3), 2500);
        return () => clearInterval(interval);
    }, []);
    const layouts = ['grid-cols-2', 'grid-cols-3', 'grid-cols-1'];
    return (
        <div className="h-full flex items-center justify-center">
            <motion.div className={`grid ${layouts[layout]} gap-1.5 w-full max-w-[140px] h-full`} layout transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                {[1, 2, 3].map(i => (<motion.div key={i} className="bg-white/20 rounded-md h-5 w-full" layout transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />))}
            </motion.div>
        </div>
    );
}

function SpeedIndicator() {
    const [loading, setLoading] = useState(true);
    useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="h-10 flex items-center justify-center overflow-hidden relative w-full">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loader" className="h-8 w-24 bg-white/10 rounded" initial={{ opacity: 0.5 }} animate={{ opacity: [0.4, 0.7, 0.4] }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 1, repeat: Infinity }} />
                    ) : (
                        <motion.span key="text" initial={{ y: 20, opacity: 0, filter: 'blur(5px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} className="text-3xl md:text-4xl font-body font-medium text-white">2.1ms</motion.span>
                    )}
                </AnimatePresence>
            </div>
            <span className="text-sm text-slate-400">PQC Latency</span>
            <div className="w-full max-w-[120px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full bg-violet-400 rounded-full" initial={{ width: 0 }} animate={{ width: loading ? 0 : '100%' }} transition={{ type: 'spring', stiffness: 100, damping: 15, mass: 1 }} />
            </div>
        </div>
    );
}

function SecurityBadge() {
    const [shields, setShields] = useState([{ id: 1, active: false }, { id: 2, active: false }, { id: 3, active: false }]);
    useEffect(() => {
        const interval = setInterval(() => {
            setShields(prev => {
                const nextI = prev.findIndex(s => !s.active);
                if (nextI === -1) return prev.map(() => ({ id: Math.random(), active: false }));
                return prev.map((s, i) => i === nextI ? { ...s, active: true } : s);
            });
        }, 800);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="flex items-center justify-center h-full gap-2">
            {shields.map(s => (
                <motion.div key={s.id} className={`w-12 h-12 rounded-lg flex items-center justify-center ${s.active ? 'bg-white/20' : 'bg-white/5'}`} animate={{ scale: s.active ? 1.1 : 1 }} transition={{ duration: 0.3 }}>
                    <Shield className={`w-5 h-5 ${s.active ? 'text-violet-400' : 'text-slate-600'}`} />
                </motion.div>
            ))}
        </div>
    );
}

function GlobalNetwork() {
    return (
        <div className="flex items-center justify-center h-full relative">
            <Globe className="w-16 h-16 text-sky-400/80 z-10" />
            {[0, 1, 2, 3, 4].map(p => (
                <motion.div key={p} className="absolute w-16 h-16 border-2 border-sky-400/30 rounded-full" initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 3, repeat: Infinity, delay: p * 0.8, ease: 'easeOut' }} />
            ))}
        </div>
    );
}

export default function BentoGrid() {
    return (
        <div className="w-full">
            <motion.p className="text-sky-400 text-xs uppercase tracking-widest mb-8 font-semibold" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Platform Capabilities</motion.p>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[200px]">
                <motion.div className="md:col-span-2 md:row-span-2 bg-surface-raised/60 border border-slate-800/60 rounded-xl p-8 flex flex-col hover:border-violet-500/20 transition-colors cursor-pointer overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ scale: 1.02 }}>
                    <div className="flex-1"><TypeTester /></div>
                    <div className="mt-4"><h3 className="font-display text-xl text-white font-medium">Post-Quantum</h3><p className="text-slate-400 text-sm mt-1">NIST-standard algorithms protecting your infrastructure.</p></div>
                </motion.div>
                <motion.div className="md:col-span-2 bg-surface-raised/60 border border-slate-800/60 rounded-xl p-8 flex flex-col hover:border-sky-400/20 transition-colors cursor-pointer overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} whileHover={{ scale: 0.98 }}>
                    <div className="flex-1"><LayoutAnimation /></div>
                    <div className="mt-4"><h3 className="font-display text-xl text-white font-medium">4 Protocols</h3><p className="text-slate-400 text-sm mt-1">TLS, SSH, IPsec, VPN — unified management.</p></div>
                </motion.div>
                <motion.div className="md:col-span-2 md:row-span-2 bg-surface-raised/60 border border-slate-800/60 rounded-xl p-6 flex flex-col hover:border-sky-400/20 transition-colors cursor-pointer overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} whileHover={{ scale: 1.02 }}>
                    <div className="flex-1 flex items-center justify-center"><GlobalNetwork /></div>
                    <div className="mt-auto"><h3 className="font-display text-xl text-white flex items-center gap-2 font-medium"><Globe className="w-5 h-5 text-sky-400" />Global Coverage</h3><p className="text-slate-400 text-sm mt-1">Protect endpoints across every region.</p></div>
                </motion.div>
                <motion.div className="md:col-span-2 bg-surface-raised/60 border border-slate-800/60 rounded-xl p-8 flex flex-col hover:border-emerald-400/20 transition-colors cursor-pointer overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} whileHover={{ scale: 0.98 }}>
                    <div className="flex-1"><SpeedIndicator /></div>
                    <div className="mt-4"><h3 className="font-display text-xl text-white font-medium flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" />Speed</h3><p className="text-slate-400 text-sm mt-1">Blazing fast PQC handshakes.</p></div>
                </motion.div>
                <motion.div className="md:col-span-3 bg-surface-raised/60 border border-slate-800/60 rounded-xl p-8 flex flex-col hover:border-violet-500/20 transition-colors cursor-pointer overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} whileHover={{ scale: 0.98 }}>
                    <div className="flex-1"><SecurityBadge /></div>
                    <div className="mt-4"><h3 className="font-display text-xl text-white flex items-center gap-2 font-medium"><Lock className="w-5 h-5 text-violet-400" />Security First</h3><p className="text-slate-400 text-sm mt-1">Enterprise-grade quantum-resistant encryption.</p></div>
                </motion.div>
                <motion.div className="md:col-span-3 bg-surface-raised/60 border border-slate-800/60 rounded-xl p-8 flex flex-col hover:border-sky-400/20 transition-colors cursor-pointer overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} whileHover={{ scale: 0.98 }}>
                    <div className="flex-1 flex items-center justify-center"><BarChart3 className="w-16 h-16 text-sky-400" /></div>
                    <div className="mt-4"><h3 className="font-display text-xl text-white font-medium">Real-Time Telemetry</h3><p className="text-slate-400 text-sm mt-1">Live monitoring and WebSocket streaming.</p></div>
                </motion.div>
            </div>
        </div>
    );
}
