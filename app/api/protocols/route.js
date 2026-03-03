import { NextResponse } from 'next/server';

/**
 * GET /api/protocols
 * 
 * Returns status of all 4 protocol integrations.
 * Backend team: Each protocol team connects their service here.
 * 
 * Protocol endpoints to implement:
 * 
 * ┌─────────────────────────────────────────────────────────┐
 * │ TLS Team:                                               │
 * │   GET  /api/tls/connections      → Active connections   │
 * │   GET  /api/tls/connections/:id  → Connection details   │
 * │   POST /api/tls/proxy/config     → Update proxy config  │
 * │   GET  /api/tls/metrics          → Handshake metrics    │
 * │   POST /api/tls/test             → Test PQC handshake   │
 * ├─────────────────────────────────────────────────────────┤
 * │ SSH Team:                                               │
 * │   GET  /api/ssh/bastions         → Bastion node status  │
 * │   GET  /api/ssh/sessions         → Active sessions      │
 * │   POST /api/ssh/bastions/:id     → Update bastion       │
 * │   GET  /api/ssh/keys             → Authorized PQC keys  │
 * │   POST /api/ssh/keys             → Register new key     │
 * ├─────────────────────────────────────────────────────────┤
 * │ IPsec Team:                                             │
 * │   GET  /api/ipsec/tunnels        → List VPN tunnels     │
 * │   POST /api/ipsec/tunnels        → Create tunnel        │
 * │   GET  /api/ipsec/tunnels/:id    → Tunnel health        │
 * │   POST /api/ipsec/tunnels/:id/rekey → Force PQC rekey   │
 * │   GET  /api/ipsec/metrics        → Tunnel metrics       │
 * ├─────────────────────────────────────────────────────────┤
 * │ WPA3 Team:                                              │
 * │   GET  /api/wpa3/access-points   → Managed APs          │
 * │   GET  /api/wpa3/clients         → Connected clients    │
 * │   POST /api/wpa3/policy          → Set wireless policy  │
 * │   GET  /api/wpa3/metrics         → Wireless metrics     │
 * └─────────────────────────────────────────────────────────┘
 */
export async function GET() {
  return NextResponse.json({
    protocols: [
      {
        id: 'tls',
        name: 'TLS 1.3 + Kyber768',
        status: 'active',
        coverage: 94,
        algorithms: ['CRYSTALS-Kyber768', 'X25519', 'Dilithium3'],
        endpoints: {
          connections: '/api/tls/connections',
          metrics: '/api/tls/metrics',
          config: '/api/tls/proxy/config',
        },
      },
      {
        id: 'ssh',
        name: 'SSH + Dilithium3',
        status: 'active',
        coverage: 78,
        algorithms: ['Dilithium3', 'Kyber768', 'Ed25519'],
        endpoints: {
          bastions: '/api/ssh/bastions',
          sessions: '/api/ssh/sessions',
          keys: '/api/ssh/keys',
        },
      },
      {
        id: 'ipsec',
        name: 'IPsec + Hybrid IKEv2',
        status: 'planned',
        coverage: 0,
        algorithms: ['Kyber1024', 'Dilithium5', 'DH Group 20'],
        endpoints: {
          tunnels: '/api/ipsec/tunnels',
          metrics: '/api/ipsec/metrics',
        },
      },
      {
        id: 'wpa3',
        name: 'WPA3 + PQC EAP-TLS',
        status: 'planned',
        coverage: 0,
        algorithms: ['Kyber768', 'Dilithium3', 'SAE'],
        endpoints: {
          accessPoints: '/api/wpa3/access-points',
          clients: '/api/wpa3/clients',
        },
      },
    ],
  });
}
