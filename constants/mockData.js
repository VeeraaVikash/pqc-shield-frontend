/**
 * ══════════════════════════════════════════
 * Mock Data Store
 * ──────────────────────────────────────────
 * Replace with API service calls in production.
 * Structure mirrors expected API response shapes.
 * ══════════════════════════════════════════
 */

// ── Dashboard Stats ──
export const DASHBOARD_STATS = [
  {
    label: 'Protected Endpoints',
    value: '2,847',
    change: '+12%',
    trending: 'up',
    color: '#22c55e',
    sparkData: [20, 25, 22, 30, 35, 32, 40, 38, 42, 47, 52, 58],
  },
  {
    label: 'PQC Handshakes/hr',
    value: '14,209',
    change: '+8%',
    trending: 'up',
    color: '#38bdf8',
    sparkData: [100, 120, 115, 140, 135, 160, 155, 170, 180, 175, 190, 200],
  },
  {
    label: 'Active Policies',
    value: '86',
    change: '+3',
    trending: 'up',
    color: '#a78bfa',
    sparkData: [70, 72, 74, 76, 78, 78, 80, 82, 82, 84, 86, 86],
  },
  {
    label: 'Avg Latency',
    value: '2.4ms',
    change: '-0.3ms',
    trending: 'down',
    color: '#fbbf24',
    sparkData: [3.2, 3.0, 2.9, 2.8, 2.7, 2.6, 2.5, 2.5, 2.4, 2.4, 2.4, 2.4],
  },
];

// ── Dashboard Alerts ──
export const DASHBOARD_ALERTS = [
  { id: 1, severity: 'critical', message: 'Certificate expiry in 48h — gateway-prod-03', time: '2m ago' },
  { id: 2, severity: 'warning', message: 'Kyber768 handshake latency spike on cluster-east', time: '18m ago' },
  { id: 3, severity: 'info', message: "Policy rollout 'pqc-tls-mandate' reached 94% coverage", time: '1h ago' },
  { id: 4, severity: 'warning', message: 'SSH bastion fallback triggered for legacy client v2.1', time: '3h ago' },
];

// ── Protocol Rollout ──
export const PROTOCOL_ROLLOUT = [
  { protocol: 'TLS 1.3 + Kyber768', coverage: 94, endpoints: 2680, status: 'active' },
  { protocol: 'SSH + Dilithium3', coverage: 78, endpoints: 1420, status: 'active' },
  { protocol: 'IPsec (Planned)', coverage: 0, endpoints: 0, status: 'pending' },
  { protocol: 'WPA3 (Planned)', coverage: 0, endpoints: 0, status: 'pending' },
];

// ── Algorithm Distribution ──
export const ALGORITHM_DISTRIBUTION = [
  { label: 'CRYSTALS-Kyber768', percentage: 45, color: '#a78bfa' },
  { label: 'CRYSTALS-Dilithium3', percentage: 30, color: '#38bdf8' },
  { label: 'SPHINCS+-SHA256', percentage: 15, color: '#22c55e' },
  { label: 'Classic (RSA/ECDSA)', percentage: 10, color: '#fbbf24' },
];

// ── Handshake Metrics ──
export const HANDSHAKE_METRICS = {
  successRate: '99.7%',
  p50Latency: '1.8ms',
  p99Latency: '4.2ms',
  barData: [120, 145, 132, 158, 167, 142, 180, 190, 175, 200, 210, 195, 220, 215, 230, 225, 240, 235, 250, 260, 245, 270, 255, 280],
};

// ── Inventory Assets ──
export const INVENTORY_ASSETS = [
  { id: 'GW-001', name: 'gateway-prod-01', type: 'TLS Gateway', algo: 'Kyber768 + X25519', status: 'active', expiry: '2026-08-14', readiness: 100 },
  { id: 'GW-002', name: 'gateway-prod-02', type: 'TLS Gateway', algo: 'Kyber768 + X25519', status: 'active', expiry: '2026-08-14', readiness: 100 },
  { id: 'GW-003', name: 'gateway-prod-03', type: 'TLS Gateway', algo: 'Kyber768 + X25519', status: 'warning', expiry: '2026-02-22', readiness: 100 },
  { id: 'SSH-001', name: 'bastion-east-01', type: 'SSH Bastion', algo: 'Dilithium3', status: 'active', expiry: '2027-01-10', readiness: 100 },
  { id: 'SSH-002', name: 'bastion-west-01', type: 'SSH Bastion', algo: 'Dilithium3', status: 'active', expiry: '2027-01-10', readiness: 85 },
  { id: 'APP-001', name: 'api-server-01', type: 'App Server', algo: 'RSA-2048 (Legacy)', status: 'inactive', expiry: '2026-06-30', readiness: 30 },
  { id: 'APP-002', name: 'api-server-02', type: 'App Server', algo: 'Kyber768 + X25519', status: 'active', expiry: '2026-12-01', readiness: 95 },
  { id: 'LB-001', name: 'lb-primary', type: 'Load Balancer', algo: 'ECDSA P-384 (Hybrid)', status: 'active', expiry: '2026-10-15', readiness: 70 },
];

export const INVENTORY_SUMMARY = [
  { label: 'Total Assets', value: '2,847', sub: 'Managed endpoints', color: '#e2e8f0' },
  { label: 'PQC Ready', value: '2,412', sub: '84.7% coverage', color: '#22c55e' },
  { label: 'In Transition', value: '298', sub: 'Hybrid mode', color: '#fbbf24' },
  { label: 'Legacy Only', value: '137', sub: 'Needs migration', color: '#ef4444' },
];

// ── Policies ──
export const POLICIES = [
  { id: 'POL-001', name: 'pqc-tls-mandate', desc: 'Enforce Kyber768 for all TLS 1.3 connections', scope: 'Global', status: 'active', coverage: 94, created: '2026-01-15' },
  { id: 'POL-002', name: 'ssh-dilithium-auth', desc: 'Require Dilithium3 signatures for SSH auth', scope: 'Production', status: 'active', coverage: 78, created: '2026-01-20' },
  { id: 'POL-003', name: 'legacy-fallback-allow', desc: 'Allow RSA fallback for non-PQC clients', scope: 'Staging', status: 'warning', coverage: 100, created: '2026-01-10' },
  { id: 'POL-004', name: 'cert-rotation-30d', desc: 'Auto-rotate PQC certificates every 30 days', scope: 'Global', status: 'active', coverage: 88, created: '2026-02-01' },
  { id: 'POL-005', name: 'hybrid-kem-only', desc: 'Only allow hybrid KEM key exchanges', scope: 'Global', status: 'active', coverage: 91, created: '2026-02-05' },
];

export const POLICY_SCHEMA_EXAMPLE = `{
  "policy_id": "POL-001",
  "name": "pqc-tls-mandate",
  "rules": [
    {
      "protocol": "TLS_1_3",
      "kem": "CRYSTALS-Kyber768",
      "signature": "CRYSTALS-Dilithium3",
      "fallback": {
        "allowed": true,
        "algorithms": ["X25519", "ECDH-P384"],
        "sunset_date": "2026-06-01"
      }
    }
  ],
  "enforcement": "STRICT",
  "rollout_strategy": "CANARY",
  "canary_percentage": 10,
  "alert_on_fallback": true
}`;

// ── TLS Connections ──
export const TLS_CONNECTIONS = [
  { id: 'tls-01', src: 'client-web-app', dst: 'api.pqc-vault.io', kem: 'Kyber768', sig: 'Dilithium3', mode: 'Hybrid', latency: '1.9ms', status: 'active' },
  { id: 'tls-02', src: 'mobile-app', dst: 'api.pqc-vault.io', kem: 'Kyber768', sig: 'Dilithium3', mode: 'Hybrid', latency: '2.1ms', status: 'active' },
  { id: 'tls-03', src: 'partner-gateway', dst: 'b2b.pqc-vault.io', kem: 'X25519', sig: 'ECDSA P-256', mode: 'Classic', latency: '0.8ms', status: 'warning' },
  { id: 'tls-04', src: 'monitoring-svc', dst: 'telemetry.internal', kem: 'Kyber768', sig: 'Dilithium3', mode: 'Hybrid', latency: '1.4ms', status: 'active' },
  { id: 'tls-05', src: 'cdn-edge-01', dst: 'origin.pqc-vault.io', kem: 'Kyber1024', sig: 'Dilithium5', mode: 'PQC-Only', latency: '2.8ms', status: 'active' },
];

// ── SSH Data ──
export const SSH_BASTIONS = [
  { id: 'BST-E01', host: 'bastion-east-01.pqc-vault.io', region: 'us-east-1', sessions: 24, algo: 'Dilithium3', uptime: '99.99%', status: 'active' },
  { id: 'BST-W01', host: 'bastion-west-01.pqc-vault.io', region: 'us-west-2', sessions: 18, algo: 'Dilithium3', uptime: '99.97%', status: 'active' },
  { id: 'BST-EU1', host: 'bastion-eu-01.pqc-vault.io', region: 'eu-west-1', sessions: 12, algo: 'Dilithium3', uptime: '99.95%', status: 'active' },
  { id: 'BST-AP1', host: 'bastion-apac-01.pqc-vault.io', region: 'ap-south-1', sessions: 8, algo: 'RSA-4096 (Legacy)', uptime: '99.90%', status: 'warning' },
];

export const SSH_SESSIONS = [
  { user: 'admin@devops', bastion: 'BST-E01', target: 'prod-db-01', algo: 'Dilithium3+Kyber768', duration: '2h 14m', status: 'active' },
  { user: 'deploy-bot', bastion: 'BST-W01', target: 'k8s-master', algo: 'Dilithium3+Kyber768', duration: '45m', status: 'active' },
  { user: 'sre-oncall', bastion: 'BST-E01', target: 'monitoring-01', algo: 'Dilithium3+Kyber768', duration: '12m', status: 'active' },
  { user: 'legacy-client', bastion: 'BST-AP1', target: 'app-server-03', algo: 'RSA-4096 (fallback)', duration: '1h 02m', status: 'warning' },
];

// ── Key Management ──
export const CRYPTO_KEYS = [
  { id: 'KEY-001', type: 'KEM', algo: 'CRYSTALS-Kyber768', usage: 'TLS Key Exchange', created: '2026-01-15', expires: '2026-07-15', rotations: 4, status: 'active' },
  { id: 'KEY-002', type: 'SIG', algo: 'CRYSTALS-Dilithium3', usage: 'SSH Authentication', created: '2026-01-20', expires: '2026-07-20', rotations: 3, status: 'active' },
  { id: 'KEY-003', type: 'SIG', algo: 'SPHINCS+-SHA256', usage: 'Code Signing', created: '2026-02-01', expires: '2027-02-01', rotations: 1, status: 'active' },
  { id: 'KEY-004', type: 'KEM', algo: 'RSA-2048 (Legacy)', usage: 'Partner TLS', created: '2025-06-01', expires: '2026-06-01', rotations: 8, status: 'warning' },
  { id: 'KEY-005', type: 'KEM', algo: 'Kyber1024', usage: 'High-Security TLS', created: '2026-02-10', expires: '2026-08-10', rotations: 1, status: 'active' },
  { id: 'KEY-006', type: 'SIG', algo: 'Dilithium5', usage: 'Root CA Signing', created: '2026-01-01', expires: '2028-01-01', rotations: 0, status: 'active' },
];

export const KEY_SUMMARY = [
  { label: 'Total Keys', value: '342', color: '#e2e8f0' },
  { label: 'PQC Keys', value: '298', color: '#a78bfa' },
  { label: 'Expiring Soon', value: '12', color: '#fbbf24' },
  { label: 'Auto-Rotate Enabled', value: '286', color: '#22c55e' },
];

// ── Telemetry ──
export const TELEMETRY_METRICS = [
  { label: 'Handshakes Processed', value: '1.2M', change: '+14%', trending: 'up', data: [800, 850, 900, 920, 980, 1020, 1050, 1100, 1120, 1150, 1180, 1200] },
  { label: 'Failure Rate', value: '0.03%', change: '-0.01%', trending: 'down', data: [0.06, 0.05, 0.05, 0.04, 0.04, 0.04, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03] },
  { label: 'Avg KEM Duration', value: '0.42ms', change: '-0.08ms', trending: 'down', data: [0.6, 0.55, 0.52, 0.5, 0.48, 0.46, 0.45, 0.44, 0.43, 0.42, 0.42, 0.42] },
  { label: 'Certificate Rotations', value: '847', change: '+52', trending: 'up', data: [50, 55, 60, 65, 70, 72, 75, 78, 80, 82, 84, 86] },
];

export const ALGO_USAGE = [
  { algo: 'Kyber768+X25519', count: 542000, pct: 45.2 },
  { algo: 'Kyber768 (PQC-Only)', count: 361000, pct: 30.1 },
  { algo: 'Dilithium3', count: 180000, pct: 15.0 },
  { algo: 'Kyber1024+P-384', count: 72000, pct: 6.0 },
  { algo: 'Classic (RSA/ECDSA)', count: 45000, pct: 3.7 },
];

export const TELEMETRY_PIPELINE = [
  { stage: 'Ingestion', throughput: '14.2K events/s', lag: '2ms', status: 'active' },
  { stage: 'Processing', throughput: '13.8K events/s', lag: '8ms', status: 'active' },
  { stage: 'Aggregation', throughput: '1.2K metrics/s', lag: '45ms', status: 'active' },
  { stage: 'Storage', throughput: '980 writes/s', lag: '12ms', status: 'active' },
  { stage: 'Alerting', throughput: '24 evals/s', lag: '120ms', status: 'active' },
];

// ── Audit Logs ──
export const AUDIT_LOGS = [
  { ts: '2026-02-20 14:32:18', actor: 'system/policy-engine', action: 'POLICY_ENFORCED', resource: 'POL-001 → gateway-prod-01', severity: 'info', detail: 'Kyber768 KEM enforced' },
  { ts: '2026-02-20 14:31:45', actor: 'admin@pqc-vault.io', action: 'KEY_ROTATED', resource: 'KEY-001 (Kyber768)', severity: 'info', detail: 'Auto-rotation cycle #4' },
  { ts: '2026-02-20 14:28:02', actor: 'system/tls-proxy', action: 'FALLBACK_TRIGGERED', resource: 'partner-gateway → b2b', severity: 'warning', detail: 'Client lacks PQC support' },
  { ts: '2026-02-20 14:25:11', actor: 'system/cert-mgr', action: 'CERT_EXPIRY_WARN', resource: 'gateway-prod-03', severity: 'critical', detail: 'Expires in 48h' },
  { ts: '2026-02-20 14:20:33', actor: 'deploy-bot', action: 'CONFIG_UPDATED', resource: 'bastion-west-01', severity: 'info', detail: 'SSH algo updated to Dilithium3' },
  { ts: '2026-02-20 14:18:07', actor: 'system/anomaly', action: 'REPLAY_DETECTED', resource: 'tls-conn-8842', severity: 'critical', detail: 'Potential replay attack blocked' },
  { ts: '2026-02-20 14:15:44', actor: 'admin@pqc-vault.io', action: 'POLICY_CREATED', resource: 'POL-006 (draft)', severity: 'info', detail: 'IPsec migration policy' },
  { ts: '2026-02-20 14:10:22', actor: 'system/qos', action: 'SLA_BREACH_WARN', resource: 'cluster-east', severity: 'warning', detail: 'P99 latency > 5ms threshold' },
];

// ── QoS Data ──
export const QOS_SLAS = [
  { label: 'Availability (30d)', value: '99.97%', target: '99.95%', met: true, color: '#22c55e' },
  { label: 'Mean Recovery Time', value: '12s', target: '< 30s', met: true, color: '#38bdf8' },
  { label: 'Failed Handshakes (24h)', value: '42', target: '< 100', met: true, color: '#a78bfa' },
];

export const FAILOVER_MECHANISMS = [
  { name: 'PQC → Classical TLS Fallback', status: 'armed', lastTriggered: '18m ago', triggers24h: 3 },
  { name: 'Primary → Secondary Bastion', status: 'armed', lastTriggered: '2d ago', triggers24h: 0 },
  { name: 'KEM Timeout Auto-Retry', status: 'armed', lastTriggered: '4h ago', triggers24h: 12 },
  { name: 'Certificate Failover (Hot Spare)', status: 'armed', lastTriggered: 'Never', triggers24h: 0 },
];

export const ANOMALIES = [
  { type: 'Replay Attack Attempt', count: 2, lastSeen: '14:18 UTC', severity: 'critical', action: 'Blocked' },
  { type: 'Unusual KEM Negotiation Pattern', count: 8, lastSeen: '13:45 UTC', severity: 'warning', action: 'Flagged' },
  { type: 'Excessive Fallback Rate', count: 1, lastSeen: '12:00 UTC', severity: 'warning', action: 'Alert Sent' },
  { type: 'Certificate Mismatch', count: 0, lastSeen: 'N/A', severity: 'inactive', action: '—' },
];

export const CLUSTER_NODES = [
  'gateway-prod-01', 'gateway-prod-02', 'gateway-prod-03',
  'bastion-east-01', 'bastion-west-01', 'bastion-eu-01',
  'api-server-01', 'api-server-02', 'lb-primary',
  'lb-secondary', 'telemetry-01', 'cert-manager',
];

// ── Settings ──
export const GENERAL_CONFIG = [
  { label: 'Default KEM Algorithm', value: 'CRYSTALS-Kyber768' },
  { label: 'Default Signature', value: 'CRYSTALS-Dilithium3' },
  { label: 'Hybrid Mode', value: 'Enabled' },
  { label: 'Fallback to Classical', value: 'Allowed (Sunset: 2026-06-01)' },
  { label: 'Certificate Auto-Rotation', value: 'Every 30 days' },
  { label: 'Telemetry Retention', value: '90 days' },
];

export const COMPLIANCE_STATUS = [
  { standard: 'FIPS 203 (ML-KEM)', status: 'Compliant', variant: 'success' },
  { standard: 'FIPS 204 (ML-DSA)', status: 'Compliant', variant: 'success' },
  { standard: 'FIPS 205 (SLH-DSA)', status: 'Partial', variant: 'warning' },
  { standard: 'CNSA 2.0 Timeline', status: 'On Track', variant: 'success' },
  { standard: 'ITU-T X.1702', status: 'Aligned', variant: 'info' },
];
