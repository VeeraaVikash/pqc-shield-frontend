/**
 * PQC Shield — Backend API Layer
 *
 * Centralized fetch wrapper for all FastAPI endpoints.
 * In development, Next.js rewrites proxy /backend/* → http://localhost:8000/api/*
 * In production, set NEXT_PUBLIC_API_URL to your deployed backend URL.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || '/backend';

async function fetchAPI(path) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      console.error(`API ${path} returned ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(`API ${path} failed:`, err);
    return null;
  }
}

// ═══ COMMAND CENTER (main dashboard aggregator) ═══
export const api = {
  // Returns: { system_status, overview, risk, policy, performance, alerts_summary, algorithm_distribution, metrics, qos }
  getCommandCenter: () => fetchAPI('/command-center/overview'),

  // ═══ INVENTORY ═══
  getInventoryOverview: () => fetchAPI('/inventory/overview'),
  getInventoryAssets:   () => fetchAPI('/inventory/assets'),

  // ═══ POLICY ═══
  getPolicyCoverage: (name = 'pqc-tls-mandate') => fetchAPI(`/policy/coverage/${name}`),

  // ═══ TLS ═══
  getTLSConnections: () => fetchAPI('/tls/active'),

  // ═══ ALERTS ═══
  getAlerts: () => fetchAPI('/alerts/'),

  // ═══ KMS / KEYS ═══
  getKeyMetrics: () => fetchAPI('/kms/metrics'),
  rotateKey: (keyId) => fetch(`${BASE}/kms/rotate/${keyId}`, { method: 'POST' }).then(r => r.json()),

  // ═══ AUDIT ═══
  getAuditLogs: () => fetchAPI('/audit/logs'),

  // ═══ RISK ═══
  getRiskScore:   () => fetchAPI('/risk/score'),
  getRiskHistory: (limit = 50) => fetchAPI(`/risk/history?limit=${limit}`),

  // ═══ DASHBOARD METRICS ═══
  getDashboardMetrics: () => fetchAPI('/dashboard/full'),

  // ═══ HEALTH CHECK ═══
  health: () => fetchAPI('/../'),  // root endpoint
};
