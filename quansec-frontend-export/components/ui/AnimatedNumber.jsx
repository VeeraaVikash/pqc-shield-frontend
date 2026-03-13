'use client';
import { useEffect, useState, useRef } from 'react';

export default function AnimatedNumber({ value, duration = 600, decimals = 0, prefix = '', suffix = '' }) {
    const [display, setDisplay] = useState(value);
    const prevRef = useRef(value);
    const frameRef = useRef(null);

    useEffect(() => {
        const from = prevRef.current;
        const to = typeof value === 'number' ? value : parseFloat(value) || 0;
        if (from === to) return;

        const start = performance.now();
        const diff = to - from;

        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = from + diff * eased;
            setDisplay(current);
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplay(to);
                prevRef.current = to;
            }
        };

        frameRef.current = requestAnimationFrame(animate);
        return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
    }, [value, duration]);

    const formatted = typeof display === 'number' ? display.toFixed(decimals) : display;
    return <>{prefix}{formatted}{suffix}</>;
}
