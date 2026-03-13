'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext(null);
const API = process.env.NEXT_PUBLIC_API_URL || '/backend';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('pqc_token');
      const savedUser = sessionStorage.getItem('pqc_user');
      if (saved && savedUser) { setToken(saved); setUser(JSON.parse(savedUser)); }
    } catch (e) { }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    const pp = ['/dashboard', '/inventory', '/policy', '/tls', '/ssh', '/ipsec', '/vpn', '/keys', '/telemetry', '/audit', '/qos', '/settings'];
    if (!token && pp.some(p => pathname.startsWith(p))) router.push('/login');
  }, [token, loading, pathname, router]);

  const login = useCallback(async (email, password) => {
    const res = await fetch(API + '/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      let msg = 'Login failed';
      try { const err = await res.json(); msg = err.detail || msg; } catch (e) { try { msg = await res.text(); } catch (e2) { } }
      throw new Error(msg);
    }
    const data = await res.json();
    setToken(data.token); setUser(data.user);
    sessionStorage.setItem('pqc_token', data.token);
    sessionStorage.setItem('pqc_user', JSON.stringify(data.user));
    router.push('/dashboard');
    return data;
  }, [router]);

  const register = useCallback(async (email, password, name, role) => {
    const res = await fetch(API + '/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });
    if (!res.ok) {
      let msg = 'Registration failed';
      try { const err = await res.json(); msg = err.detail || msg; } catch (e) { try { msg = await res.text(); } catch (e2) { } }
      throw new Error(msg);
    }
    const data = await res.json();
    setToken(data.token); setUser(data.user);
    sessionStorage.setItem('pqc_token', data.token);
    sessionStorage.setItem('pqc_user', JSON.stringify(data.user));
    router.push('/dashboard');
    return data;
  }, [router]);

  const logout = useCallback(() => {
    setToken(null); setUser(null);
    sessionStorage.removeItem('pqc_token'); sessionStorage.removeItem('pqc_user');
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
