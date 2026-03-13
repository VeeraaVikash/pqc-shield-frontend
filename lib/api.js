const BASE = process.env.NEXT_PUBLIC_API_URL || '/backend';

function getToken() {
  try {
    return sessionStorage.getItem('pqc_token');
  } catch (e) {
    return null;
  }
}

function authHeaders() {
  const h = { 'Content-Type': 'application/json' };
  const t = getToken();
  if (t) h['Authorization'] = 'Bearer ' + t;
  return h;
}

function handleUnauthorized() {
  sessionStorage.removeItem('pqc_token');
  sessionStorage.removeItem('pqc_user');
  if (typeof window !== 'undefined') window.location.href = '/login';
}

async function fetchAPI(path) {
  try {
    const r = await fetch(BASE + path, { cache: 'no-store', headers: authHeaders() });
    if (r.status === 401) { handleUnauthorized(); return null; }
    if (!r.ok) {
      console.warn(`API ${path} returned ${r.status}`);
      return null;
    }
    return await r.json();
  } catch (e) {
    console.error('API ' + path, e);
    return null;
  }
}

async function postAPI(path, body) {
  try {
    const r = await fetch(BASE + path, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body || {}),
    });
    if (r.status === 401) { handleUnauthorized(); return null; }
    if (!r.ok) {
      console.warn(`POST ${path} returned ${r.status}`);
      return null;
    }
    return await r.json();
  } catch (e) {
    console.error('POST ' + path, e);
    return null;
  }
}

async function putAPI(path, body) {
  try {
    const r = await fetch(BASE + path, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body || {}),
    });
    if (r.status === 401) { handleUnauthorized(); return null; }
    if (!r.ok) {
      console.warn(`PUT ${path} returned ${r.status}`);
      return null;
    }
    return await r.json();
  } catch (e) {
    console.error('PUT ' + path, e);
    return null;
  }
}

export const api = {
  // Protocols
  getProtocolOverview: () => fetchAPI('/protocols/overview'),
  getVPNPeers: () => fetchAPI('/protocols/vpn/peers'),
  getIPsecTunnels: () => fetchAPI('/protocols/ipsec/tunnels'),

  // SSH
  getSSHBastions: () => fetchAPI('/ssh/bastions'),
  getSSHSessions: () => fetchAPI('/ssh/sessions'),
  getSSHMetrics: () => fetchAPI('/ssh/metrics'),

  // Command Center / Dashboard
  getCommandCenter: () => fetchAPI('/command-center/overview'),
  getDashboardMetrics: () => fetchAPI('/dashboard/full'),

  // Inventory
  getInventoryOverview: () => fetchAPI('/inventory/overview'),
  getInventoryAssets: () => fetchAPI('/inventory/assets'),

  // Policy
  getPolicyCoverage: (n) => fetchAPI('/policy/coverage/' + (n || 'pqc-tls-mandate')),
  rolloutPolicy: (n, p) => postAPI('/policy/rollout/' + n + '?percentage=' + (p || 90)),

  // TLS
  getTLSConnections: () => fetchAPI('/tls/active'),

  // Alerts
  getAlerts: () => fetchAPI('/alerts/'),

  // KMS
  getKeyMetrics: () => fetchAPI('/kms/metrics'),
  getKeys: () => fetchAPI('/kms/keys'),
  rotateKey: (id) => postAPI('/kms/rotate/' + id),

  // Audit
  getAuditLogs: () => fetchAPI('/audit/logs'),

  // Risk
  getRiskScore: () => fetchAPI('/risk/score'),
  getRiskHistory: (l) => fetchAPI('/risk/history?limit=' + (l || 50)),

  // Telemetry
  getTelemetryMetrics: () => fetchAPI('/telemetry/metrics'),
  getRecentHandshakes: () => fetchAPI('/telemetry/handshakes/recent'),
  getTelemetryPipeline: () => fetchAPI('/telemetry/pipeline'),

  // Settings
  getSettings: () => fetchAPI('/settings/'),
  saveSettings: (settings) => putAPI('/settings/', { settings }),
};

export function getWebSocketURL() {
  if (typeof window === 'undefined') return '';
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  // In production: use same host. In dev: backend is on port 8000
  const host = process.env.NEXT_PUBLIC_WS_HOST
    || (window.location.hostname === 'localhost' ? '127.0.0.1:8000' : window.location.host);
  return proto + '//' + host + '/api/ws/live';
}
