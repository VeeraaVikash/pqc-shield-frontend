/**
 * Documentation pages content.
 * Each entry corresponds to a docs/[slug] page.
 * Backend team: reference these for API endpoint mapping.
 */

export const DOCS_PAGES = [
  // ── Protocol Docs ──
  {
    slug: 'tls-integration',
    title: 'TLS 1.3 + PQC Integration',
    category: 'Protocols',
    icon: '🔒',
    description: 'Hybrid post-quantum key exchange for TLS 1.3 connections using Kyber768 KEM with X25519 fallback.',
    sections: [
      {
        heading: 'Overview',
        content: 'The TLS integration uses a proxy/sidecar architecture to intercept and upgrade TLS 1.3 handshakes with post-quantum key encapsulation. The PQC proxy sits between clients and backends, performing hybrid KEM negotiation using CRYSTALS-Kyber768 combined with classical X25519.',
      },
      {
        heading: 'Architecture',
        content: 'Client → PQC Proxy (Kyber768 KEM + Dilithium3 Auth) → Backend. The proxy supports transparent mode (inline) and sidecar mode (Kubernetes). It handles certificate management, algorithm negotiation, and fallback to classical TLS for non-PQC clients.',
      },
      {
        heading: 'API Endpoints',
        content: 'GET /api/tls/connections — List active connections\nGET /api/tls/connections/:id — Connection details\nPOST /api/tls/proxy/config — Update proxy configuration\nGET /api/tls/metrics — Handshake performance metrics\nPOST /api/tls/test — Test PQC handshake with target host',
      },
      {
        heading: 'Configuration',
        content: 'The TLS proxy is configured via the policy engine. Key settings include: default KEM algorithm (Kyber768/Kyber1024), signature scheme (Dilithium3/Dilithium5), fallback behavior (allow/deny classical), connection timeout, and certificate rotation interval.',
      },
      {
        heading: 'Backend Integration',
        content: 'The TLS service exposes a gRPC interface for the backend team. Proto definitions are in /protos/tls_service.proto. The service handles: handshake orchestration, certificate validation, KEM key generation, and telemetry emission.',
      },
    ],
  },
  {
    slug: 'ssh-integration',
    title: 'SSH + PQC Authentication',
    category: 'Protocols',
    icon: '💻',
    description: 'Quantum-resistant SSH authentication using Dilithium3 signatures via bastion/agent model.',
    sections: [
      {
        heading: 'Overview',
        content: 'SSH integration provides post-quantum authentication through a bastion/agent model. All SSH connections route through PQC-enabled bastion hosts that enforce Dilithium3 signature verification. The system supports both interactive sessions and automated deployment pipelines.',
      },
      {
        heading: 'Bastion Architecture',
        content: 'Users connect to regional bastion hosts (us-east, us-west, eu-west, ap-south). Each bastion performs PQC key exchange using Kyber768 for transport encryption and Dilithium3 for identity verification. Sessions are logged and auditable.',
      },
      {
        heading: 'API Endpoints',
        content: 'GET /api/ssh/bastions — List bastion nodes with status\nGET /api/ssh/sessions — Active session monitoring\nPOST /api/ssh/bastions/:id/config — Update bastion config\nGET /api/ssh/keys — List authorized PQC public keys\nPOST /api/ssh/keys — Register new PQC key pair',
      },
      {
        heading: 'Backend Integration',
        content: 'The SSH service integrates with the key management module for Dilithium3 key lifecycle. Backend team should implement: key generation endpoint, signature verification middleware, session recording service, and bastion health reporting.',
      },
    ],
  },
  {
    slug: 'ipsec-integration',
    title: 'IPsec + PQC (Phase 2)',
    category: 'Protocols',
    icon: '🛡️',
    description: 'Post-quantum IKEv2 key exchange for IPsec VPN tunnels. Planned for Phase 2 expansion.',
    sections: [
      {
        heading: 'Overview',
        content: 'IPsec integration will extend PQC protection to site-to-site and remote-access VPN tunnels. The implementation uses hybrid IKEv2 key exchange with Kyber768/Kyber1024 KEM alongside classical Diffie-Hellman groups.',
      },
      {
        heading: 'Planned Architecture',
        content: 'IKEv2 Initiator → PQC Gateway (Hybrid KEM in IKE_SA_INIT) → IKEv2 Responder. The system will support both tunnel and transport modes. ESP encryption will use AES-256-GCM with PQC-derived keying material.',
      },
      {
        heading: 'API Endpoints (Planned)',
        content: 'GET /api/ipsec/tunnels — List VPN tunnels\nPOST /api/ipsec/tunnels — Create new tunnel\nGET /api/ipsec/tunnels/:id/status — Tunnel health\nPOST /api/ipsec/tunnels/:id/rekey — Force PQC rekey\nGET /api/ipsec/metrics — Tunnel performance metrics',
      },
      {
        heading: 'Backend Requirements',
        content: 'Backend team needs to implement: IKEv2 state machine with PQC KEM support, ESP packet encapsulation/decapsulation, tunnel health monitoring, automatic rekey scheduling, and integration with the centralized policy engine.',
      },
    ],
  },
  {
    slug: 'wpa3-integration',
    title: 'WPA3 + PQC (Phase 2)',
    category: 'Protocols',
    icon: '📡',
    description: 'Quantum-resistant wireless security for enterprise Wi-Fi networks. Planned for Phase 2.',
    sections: [
      {
        heading: 'Overview',
        content: 'WPA3-Enterprise integration will add post-quantum protection to 802.1X authentication and key establishment. The implementation targets SAE (Simultaneous Authentication of Equals) with PQC-enhanced key derivation.',
      },
      {
        heading: 'Planned Architecture',
        content: 'Wireless Client → Access Point → RADIUS Server (PQC-enhanced EAP-TLS). The PQC enhancement occurs at the EAP-TLS layer, using Kyber768 for key exchange during 802.1X authentication.',
      },
      {
        heading: 'API Endpoints (Planned)',
        content: 'GET /api/wpa3/access-points — List managed APs\nGET /api/wpa3/clients — Connected client inventory\nPOST /api/wpa3/policy — Set wireless PQC policy\nGET /api/wpa3/metrics — Wireless security metrics',
      },
      {
        heading: 'Backend Requirements',
        content: 'Backend team needs to implement: RADIUS server PQC extension module, EAP-TLS with Kyber768 support, access point firmware compatibility layer, client supplicant PQC negotiation, and wireless-specific telemetry collection.',
      },
    ],
  },

  // ── Feature Docs ──
  {
    slug: 'policy-engine',
    title: 'Policy Engine',
    category: 'Features',
    icon: '⚙️',
    description: 'Centralized PQC algorithm enforcement, rollout controls, and compliance management.',
    sections: [
      {
        heading: 'Overview',
        content: 'The policy engine provides centralized control over which PQC algorithms are enforced across all protocols. Policies support canary rollouts, percentage-based deployment, algorithm fallback chains, and automatic sunset of classical cryptography.',
      },
      {
        heading: 'Policy Schema',
        content: 'Each policy defines: target protocol, required KEM algorithm, required signature algorithm, fallback rules, enforcement level (strict/permissive), rollout strategy (canary/percentage/global), and alert configurations.',
      },
      {
        heading: 'API Endpoints',
        content: 'GET /api/policies — List all policies\nPOST /api/policies — Create new policy\nPUT /api/policies/:id — Update policy\nDELETE /api/policies/:id — Delete policy\nPOST /api/policies/:id/rollout — Trigger rollout\nGET /api/policies/:id/coverage — Get coverage metrics',
      },
      {
        heading: 'Backend Integration',
        content: 'The policy engine is the central coordination point. All protocol services (TLS, SSH, IPsec, WPA3) query the policy engine before establishing connections. Backend team should implement: policy evaluation service, rollout state machine, coverage calculator, and policy change event emitter.',
      },
    ],
  },
  {
    slug: 'key-management',
    title: 'Key Management',
    category: 'Features',
    icon: '🔑',
    description: 'Full cryptographic key lifecycle — generation, storage, rotation, and revocation.',
    sections: [
      {
        heading: 'Overview',
        content: 'The key management module handles the complete lifecycle of PQC cryptographic keys. It supports CRYSTALS-Kyber (KEM), CRYSTALS-Dilithium (signatures), and SPHINCS+ (stateless hash-based signatures). Keys are stored in HSM-backed secure storage with automatic rotation.',
      },
      {
        heading: 'Key Types',
        content: 'KEM keys: Used for key encapsulation in TLS and IPsec handshakes (Kyber768, Kyber1024). Signature keys: Used for authentication in SSH and certificate signing (Dilithium3, Dilithium5, SPHINCS+-SHA256). Each key has metadata tracking creation date, expiry, rotation count, and usage scope.',
      },
      {
        heading: 'API Endpoints',
        content: 'GET /api/keys — List all managed keys\nPOST /api/keys/generate — Generate new key pair\nPOST /api/keys/:id/rotate — Rotate key\nDELETE /api/keys/:id/revoke — Revoke key\nGET /api/keys/:id/history — Key rotation history\nGET /api/keys/expiring — Keys expiring within threshold',
      },
      {
        heading: 'Backend Integration',
        content: 'Key management integrates with HSM via PKCS#11 interface. Backend team should implement: key generation using liboqs, secure key storage abstraction, automatic rotation scheduler, certificate signing with PQC keys, and key distribution to protocol services.',
      },
    ],
  },
  {
    slug: 'telemetry',
    title: 'Telemetry & Analytics',
    category: 'Features',
    icon: '📊',
    description: 'Real-time handshake telemetry, algorithm usage analytics, and performance monitoring.',
    sections: [
      {
        heading: 'Overview',
        content: 'The telemetry system collects metrics from all PQC protocol integrations. It tracks handshake times, algorithm usage distribution, failure rates, certificate rotations, and performance benchmarks. Data flows through a 5-stage pipeline: Ingestion → Processing → Aggregation → Storage → Alerting.',
      },
      {
        heading: 'Metrics Collected',
        content: 'Per-handshake: KEM duration, signature verification time, total handshake time, algorithm used, fallback triggered, client capabilities. Aggregate: hourly/daily handshake counts, P50/P99 latency, failure rate, algorithm distribution, PQC vs classical ratio.',
      },
      {
        heading: 'API Endpoints',
        content: 'GET /api/telemetry/metrics?range=24h — Time-range metrics\nGET /api/telemetry/algorithms — Algorithm usage breakdown\nGET /api/telemetry/pipeline — Pipeline health status\nGET /api/telemetry/export — Export metrics as CSV/JSON\nPOST /api/telemetry/alerts — Configure alert thresholds',
      },
      {
        heading: 'Backend Integration',
        content: 'Telemetry uses an event-driven architecture. Each protocol service emits structured events to a message queue (Kafka/NATS). Backend team should implement: event schema definitions, ingestion consumer, time-series storage adapter (InfluxDB/TimescaleDB), aggregation workers, and alert evaluation engine.',
      },
    ],
  },
  {
    slug: 'audit-logging',
    title: 'Audit Logging',
    category: 'Features',
    icon: '📋',
    description: 'Comprehensive security event trail for compliance and forensic analysis.',
    sections: [
      {
        heading: 'Overview',
        content: 'The audit system logs every security-relevant event across the platform. Events include policy enforcement actions, key rotations, fallback triggers, anomaly detections, configuration changes, and authentication attempts. Logs are immutable and tamper-evident.',
      },
      {
        heading: 'Event Types',
        content: 'POLICY_ENFORCED, KEY_ROTATED, FALLBACK_TRIGGERED, CERT_EXPIRY_WARN, CONFIG_UPDATED, REPLAY_DETECTED, POLICY_CREATED, SLA_BREACH_WARN, AUTH_SUCCESS, AUTH_FAILURE, KEY_REVOKED, ANOMALY_DETECTED.',
      },
      {
        heading: 'API Endpoints',
        content: 'GET /api/audit — Query audit logs with filters\nGET /api/audit/:id — Single event detail\nGET /api/audit/export — Export for compliance\nGET /api/audit/stats — Event statistics\nPOST /api/audit/search — Advanced search with DSL',
      },
    ],
  },
  {
    slug: 'qos-resilience',
    title: 'QoS & Resilience',
    category: 'Features',
    icon: '⚡',
    description: 'Quality of service monitoring, automatic failover, and anomaly detection.',
    sections: [
      {
        heading: 'Overview',
        content: 'The QoS module ensures that PQC operations meet SLA targets. It monitors availability (target: 99.95%), mean recovery time (target: <30s), and handshake failure rates. Automatic failover mechanisms handle graceful degradation from PQC to classical when needed.',
      },
      {
        heading: 'Failover Mechanisms',
        content: 'Four failover paths are maintained: PQC → Classical TLS fallback, Primary → Secondary bastion, KEM timeout auto-retry, and Certificate failover via hot spare. Each mechanism is independently armed and triggers are tracked.',
      },
      {
        heading: 'Anomaly Detection',
        content: 'The system detects: replay attack attempts (blocked automatically), unusual KEM negotiation patterns, excessive fallback rates, and certificate mismatches. Detection uses statistical baselines and pattern matching.',
      },
      {
        heading: 'API Endpoints',
        content: 'GET /api/qos/slas — Current SLA status\nGET /api/qos/failovers — Failover mechanism status\nGET /api/qos/anomalies — Detected anomalies\nGET /api/qos/cluster — Cluster health matrix\nPOST /api/qos/thresholds — Update SLA thresholds',
      },
    ],
  },
  {
    slug: 'inventory-readiness',
    title: 'Inventory & Readiness',
    category: 'Features',
    icon: '🖥️',
    description: 'Complete endpoint inventory with PQC migration readiness tracking.',
    sections: [
      {
        heading: 'Overview',
        content: 'The inventory module maintains a real-time catalog of all managed endpoints — gateways, bastion hosts, app servers, load balancers. Each asset tracks its PQC readiness percentage, active algorithms, certificate expiry, and migration status.',
      },
      {
        heading: 'Readiness Calculation',
        content: 'PQC readiness is calculated based on: firmware/software PQC support (30%), active PQC algorithm configuration (30%), certificate migration status (20%), and policy compliance (20%). Assets scoring ≥90% are classified as PQC Ready.',
      },
      {
        heading: 'API Endpoints',
        content: 'GET /api/inventory — List all assets with filters\nGET /api/inventory/:id — Asset details\nPOST /api/inventory/sync — Trigger discovery sync\nGET /api/inventory/summary — Readiness summary stats\nGET /api/inventory/export — Export as CSV',
      },
    ],
  },
];

export const DOCS_CATEGORIES = ['Protocols', 'Features'];
