const BASE = process.env.NEXT_PUBLIC_API_URL || '/backend';
function getToken() { try { return sessionStorage.getItem('pqc_token') } catch (e) { return null } }
async function fetchAPI(path) {
  try {
    const h = { 'Content-Type': 'application/json' }; const t = getToken(); if (t) h['Authorization'] = 'Bearer ' + t;
    const r = await fetch(BASE + path, { cache: 'no-store', headers: h });
    if (r.status === 401) { sessionStorage.removeItem('pqc_token'); sessionStorage.removeItem('pqc_user'); if (typeof window !== 'undefined') window.location.href = '/login'; return null; }
    if (!r.ok) return null; return await r.json();
  } catch (e) { console.error('API ' + path, e); return null; }
}
async function postAPI(path, body) {
  try {
    const h = { 'Content-Type': 'application/json' }; const t = getToken(); if (t) h['Authorization'] = 'Bearer ' + t;
    const r = await fetch(BASE + path, { method: 'POST', headers: h, body: JSON.stringify(body || {}) });
    if (!r.ok) return null; return await r.json();
  } catch (e) { return null; }
}
export const api = {
  // Protocol Overview (all 4 protocols: TLS, SSH, IPsec, VPN)
  getProtocolOverview: () => fetchAPI('/protocols/overview'),
  getVPNPeers: () => fetchAPI('/protocols/vpn/peers'),
  getIPsecTunnels: () => fetchAPI('/protocols/ipsec/tunnels'),
  // SSH (real backend, not mock)
  getSSHBastions: () => fetchAPI('/ssh/bastions'),
  getSSHSessions: () => fetchAPI('/ssh/sessions'),
  getSSHMetrics: () => fetchAPI('/ssh/metrics'),
  // Existing endpoints
  getCommandCenter: () => fetchAPI('/command-center/overview'),
  getInventoryOverview: () => fetchAPI('/inventory/overview'),
  getInventoryAssets: () => fetchAPI('/inventory/assets'),
  getPolicyCoverage: (n) => fetchAPI('/policy/coverage/' + (n || 'pqc-tls-mandate')),
  rolloutPolicy: (n, p) => postAPI('/policy/rollout/' + n + '?percentage=' + (p || 90)),
  getTLSConnections: () => fetchAPI('/tls/active'),
  getAlerts: () => fetchAPI('/alerts/'),
  getKeyMetrics: () => fetchAPI('/kms/metrics'),
  getKeys: () => fetchAPI('/kms/keys'),
  rotateKey: (id) => postAPI('/kms/rotate/' + id),
  getAuditLogs: () => fetchAPI('/audit/logs'),
  getRiskScore: () => fetchAPI('/risk/score'),
  getRiskHistory: (l) => fetchAPI('/risk/history?limit=' + (l || 50)),
  getDashboardMetrics: () => fetchAPI('/dashboard/full'),
  // Telemetry (NEW — real DB data)
  getTelemetryMetrics: () => fetchAPI('/telemetry/metrics'),
  getRecentHandshakes: () => fetchAPI('/telemetry/handshakes/recent'),
  getTelemetryPipeline: () => fetchAPI('/telemetry/pipeline'),
};

// WebSocket URL helper
export function getWebSocketURL() {
  if (typeof window === 'undefined') return '';
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  // In dev, proxy goes through Next.js but WebSocket needs direct backend
  const backendWS = process.env.NEXT_PUBLIC_WS_URL || `${proto}//localhost:8000/api/ws/live`;
  return backendWS;
}

