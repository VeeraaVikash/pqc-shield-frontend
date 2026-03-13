'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';

const PARTICLE_DENSITY = 0.00015;
const BG_PARTICLE_DENSITY = 0.00005;
const MOUSE_RADIUS = 180;
const RETURN_SPEED = 0.08;
const DAMPING = 0.90;
const REPULSION_STRENGTH = 1.2;

const randomRange = (min, max) => Math.random() * (max - min) + min;

export default function ParticleHero() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const particlesRef = useRef([]);
    const backgroundParticlesRef = useRef([]);
    const mouseRef = useRef({ x: -1000, y: -1000, isActive: false });
    const frameIdRef = useRef(0);

    const initParticles = useCallback((width, height) => {
        const particleCount = Math.floor(width * height * PARTICLE_DENSITY);
        const newParticles = [];
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            newParticles.push({
                x, y, originX: x, originY: y, vx: 0, vy: 0,
                size: randomRange(1, 2.5),
                color: Math.random() > 0.85 ? '#a78bfa' : Math.random() > 0.7 ? '#38bdf8' : '#ffffff',
            });
        }
        particlesRef.current = newParticles;
        const bgCount = Math.floor(width * height * BG_PARTICLE_DENSITY);
        const newBg = [];
        for (let i = 0; i < bgCount; i++) {
            newBg.push({
                x: Math.random() * width, y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
                size: randomRange(0.5, 1.5), alpha: randomRange(0.1, 0.4), phase: Math.random() * Math.PI * 2,
            });
        }
        backgroundParticlesRef.current = newBg;
    }, []);

    const animate = useCallback((time) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2, cy = canvas.height / 2;
        const po = Math.sin(time * 0.0008) * 0.035 + 0.085;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(canvas.width, canvas.height) * 0.7);
        g.addColorStop(0, `rgba(124, 58, 237, ${po})`);
        g.addColorStop(0.5, `rgba(56, 189, 248, ${po * 0.3})`);
        g.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const bg = backgroundParticlesRef.current;
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < bg.length; i++) {
            const p = bg[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            const tw = Math.sin(time * 0.002 + p.phase) * 0.5 + 0.5;
            ctx.globalAlpha = p.alpha * (0.3 + 0.7 * tw);
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1.0;
        const particles = particlesRef.current;
        const mouse = mouseRef.current;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const dx = mouse.x - p.x, dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (mouse.isActive && dist < MOUSE_RADIUS) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * REPULSION_STRENGTH;
                p.vx -= (dx / dist) * force * 5;
                p.vy -= (dy / dist) * force * 5;
            }
            p.vx += (p.originX - p.x) * RETURN_SPEED;
            p.vy += (p.originY - p.y) * RETURN_SPEED;
        }
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.vx *= DAMPING; p.vy *= DAMPING;
            p.x += p.vx; p.y += p.vy;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            const v = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            const op = Math.min(0.3 + v * 0.1, 1);
            ctx.fillStyle = p.color === '#ffffff' ? `rgba(255,255,255,${op})` : p.color;
            ctx.fill();
        }
        frameIdRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                canvasRef.current.width = width * dpr;
                canvasRef.current.height = height * dpr;
                canvasRef.current.style.width = `${width}px`;
                canvasRef.current.style.height = `${height}px`;
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) ctx.scale(dpr, dpr);
                initParticles(width, height);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [initParticles]);

    useEffect(() => {
        frameIdRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameIdRef.current);
    }, [animate]);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, isActive: true };
    };

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden cursor-crosshair"
            onMouseMove={handleMouseMove} onMouseLeave={() => { mouseRef.current.isActive = false; }}>
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}
