# Quansec's PQC — Complete Documentation

> A line-by-line, concept-by-concept guide to everything Quansec's PQC does.
> Written so anyone — technical or not — can understand the entire system.

---

## Table of Contents

1. [What Is Quansec's PQC?](#1-what-is-pqc-shield)
2. [Why Does It Exist?](#2-why-does-it-exist)
3. [Key Terms Explained](#3-key-terms-explained)
4. [System Architecture](#4-system-architecture)
5. [The Data Pipeline — How Data Flows](#5-the-data-pipeline)
6. [Page-by-Page Feature Breakdown](#6-page-by-page-feature-breakdown)
7. [Backend Services Explained](#7-backend-services-explained)
8. [Database Tables](#8-database-tables)
9. [API Endpoints](#9-api-endpoints)
10. [Scheduled Jobs](#10-scheduled-jobs)
11. [Authentication Flow](#11-authentication-flow)
12. [Technology Stack](#12-technology-stack)
13. [Algorithms & Standards](#13-algorithms-and-standards)
14. [Data Sources: Live vs Simulated](#14-data-sources)
15. [Risk Scoring Formula](#15-risk-scoring-formula)
16. [Deployment Guide](#16-deployment-guide)

---

## 1. What Is Quansec's PQC?

**Quansec's PQC** is a real-time monitoring and management platform for **Post-Quantum Cryptography (PQC)** across enterprise network protocols.

Think of it like a **security operations center (SOC) dashboard** — but specifically built to track the migration from old encryption (RSA, ECDSA) to new quantum-resistant encryption (Kyber, Dilithium).

### What It Does In Simple Terms:

1. **Monitors** every encrypted connection in your network (TLS, SSH, IPsec, VPN)
2. **Tracks** which connections use quantum-safe algorithms and which don't
3. **Alerts** you when something goes wrong (high failure rate, slow connections, too many classical fallbacks)
4. **Manages** encryption keys and their rotation lifecycle
5. **Enforces** policies (e.g., "All TLS gateways must use Kyber768 by June 2026")
6. **Reports** on compliance, risk, and service quality

---

## 2. Why Does It Exist?

### The Quantum Threat

Today's encryption (RSA, ECDSA) relies on math problems that regular computers can't solve quickly. But **quantum computers** — which are being built right now by Google, IBM, and others — will be able to break these in minutes.

**Timeline:**
- **2024–2025**: NIST finalized new quantum-resistant algorithms
- **2025–2030**: Organizations must migrate to these new algorithms
- **2030+**: Quantum computers may be powerful enough to break RSA-2048

### The Problem Quansec's PQC Solves:

Imagine an enterprise with 10,000 servers. Each one uses encryption. To migrate them all to quantum-safe algorithms, you need to:

1. **Know** which servers still use old algorithms (Inventory)
2. **Monitor** the new algorithms are working properly (Telemetry)
3. **Track** connection success rates and latency (TLS Dashboard)
4. **Manage** encryption keys for the new algorithms (Key Vault)
5. **Enforce** migration policies across the organization (Policy Engine)
6. **Alert** when things break or fall back to old algorithms (Alert Engine)
7. **Report** on overall security posture (Risk Score, QoS)

Quansec's PQC does all of this in one dashboard.

---

## 3. Key Terms Explained

### Cryptography Terms

| Term | What It Means | Example |
|------|--------------|---------|
| **PQC** | Post-Quantum Cryptography — new encryption algorithms designed to resist quantum computer attacks | Kyber, Dilithium |
| **KEM** | Key Encapsulation Mechanism — the algorithm used to securely share a secret key between two parties | Kyber768 creates a shared key |
| **Digital Signature** | A mathematical proof that a message came from who it claims to come from (like a tamper-proof seal) | Dilithium3 signs a certificate |
| **TLS** | Transport Layer Security — the "lock" icon in your browser. Encrypts data between your device and a server | When you visit https://google.com |
| **SSH** | Secure Shell — used by engineers to securely connect to remote servers (like a secure remote desktop for command lines) | `ssh admin@server` |
| **IPsec** | Internet Protocol Security — encrypts data between two networks (office A to office B) | Corporate site-to-site VPN |
| **VPN** | Virtual Private Network — creates a secure "tunnel" for your internet traffic | WireGuard, OpenVPN |
| **Handshake** | The initial conversation between two computers where they agree on encryption parameters | Client → Server: "Let's use Kyber768" → Server: "OK, here's my key" |
| **Latency** | How long something takes (measured in milliseconds) | A handshake taking 2.3ms is fast |
| **P50/P99** | The 50th/99th percentile. P50 = half are faster than this. P99 = 99% are faster (catches worst cases) | P50: 2.1ms, P99: 4.5ms |

### Algorithm Names

| Algorithm | Type | What It Does | NIST Standard |
|-----------|------|-------------|---------------|
| **Kyber768** | KEM | Creates shared encryption keys between two parties. "768" refers to the security level | FIPS 203 (ML-KEM) |
| **Kyber1024** | KEM | Same as Kyber768 but stronger (used for highest security needs like IPsec) | FIPS 203 (ML-KEM) |
| **Dilithium3** | Signature | Creates digital signatures to prove identity. Used in certificates | FIPS 204 (ML-DSA) |
| **Dilithium5** | Signature | Stronger version of Dilithium3. Used for root certificates | FIPS 204 (ML-DSA) |
| **SPHINCS+** | Signature | An alternative to Dilithium with different security assumptions. Slower but uses different math | FIPS 205 (SLH-DSA) |
| **Falcon-512** | Signature | Compact signature algorithm. Smaller signatures than Dilithium | Under evaluation |
| **RSA-2048** | KEM/Sig | The OLD algorithm. Vulnerable to quantum computers | Will be deprecated |
| **ECDSA/ECDH** | KEM/Sig | Another OLD algorithm, faster than RSA but still vulnerable | Will be deprecated |

### Connection Modes

| Mode | What It Means | Security Level |
|------|--------------|---------------|
| **PQC-Only** | Uses ONLY quantum-resistant algorithms. No old algorithms involved | ✅ Highest (quantum-safe) |
| **Hybrid** | Uses BOTH a quantum-resistant AND a classical algorithm together (belt AND suspenders) | ✅ High (safe even if PQC has bugs) |
| **Classical** | Uses ONLY old algorithms (RSA, ECDSA). Vulnerable to quantum attack | ❌ Unsafe in the quantum era |

### Infrastructure Terms

| Term | What It Means |
|------|--------------|
| **Bastion** | A heavily secured server that acts as a gateway — you must go through it to access other servers |
| **Tunnel** | An encrypted pathway between two networks (like a secure pipe for data) |
| **SA (Security Association)** | An agreement between two devices about how to encrypt their communication |
| **Rekeying** | When an encrypted tunnel creates new encryption keys (happens periodically for security) |
| **Canary Rollout** | Deploying a change to a small percentage first to test before full deployment |
| **CNSA 2.0** | Commercial National Security Algorithm Suite 2.0 — the US government's required list of quantum-safe algorithms |
| **MTTR** | Mean Time To Resolution — average time to fix an alert after it's raised |
| **SLA** | Service Level Agreement — a promise of how reliable the service will be (e.g., 99.9% uptime) |

---

## 4. System Architecture

### How the System Is Built

```
┌─────────────────────────────────────────────────┐
│                   USER'S BROWSER                 │
│                                                  │
│   Next.js React Frontend (localhost:3000)         │
│   ├── Landing Page (marketing)                    │
│   ├── Login / Register                            │
│   └── Dashboard Pages (12 pages)                  │
│       ├── Command Center (/dashboard)             │
│       ├── TLS Monitor (/tls)                      │
│       ├── SSH Bastions (/ssh)                     │
│       ├── IPsec Tunnels (/ipsec)                  │
│       ├── VPN Peers (/vpn)                        │
│       ├── Telemetry (/telemetry)                  │
│       ├── Asset Inventory (/inventory)            │
│       ├── Policy Engine (/policy)                 │
│       ├── Key Vault (/keys)                       │
│       ├── Audit Trail (/audit)                    │
│       ├── QoS Monitor (/qos)                      │
│       └── Settings (/settings)                    │
└──────────────┬────────────────┬──────────────────┘
               │ REST API        │ WebSocket
               │ (fetch data)    │ (live push)
               ▼                 ▼
┌──────────────────────────────────────────────────┐
│         FastAPI Backend (localhost:8000)           │
│                                                   │
│   ├── Routes (API endpoints)                      │
│   │   ├── /api/auth (login, register)             │
│   │   ├── /api/protocols/overview                 │
│   │   ├── /api/telemetry/* (metrics, charts)      │
│   │   ├── /api/tls/active-connections             │
│   │   ├── /api/ssh/* (bastions, sessions)         │
│   │   ├── /api/inventory/* (assets)               │
│   │   ├── /api/kms/* (keys, rotation)             │
│   │   ├── /api/policy/* (coverage, rollout)       │
│   │   ├── /api/alerts/* (alert list)              │
│   │   ├── /api/audit/* (event log)                │
│   │   ├── /api/qos/* (SLA metrics)                │
│   │   ├── /api/risk/* (risk score)                │
│   │   └── /ws (WebSocket live feed)               │
│   │                                               │
│   ├── Services (business logic)                   │
│   │   ├── telemetry_service (handshake generator) │
│   │   ├── alert_service (alert engine)            │
│   │   ├── risk_service (risk calculator)          │
│   │   ├── kms_service (key management)            │
│   │   ├── inventory_service (asset tracking)      │
│   │   ├── policy_service (compliance engine)      │
│   │   ├── qos_service (SLA calculator)            │
│   │   ├── protocol_simulator (SSH/IPsec/VPN data) │
│   │   └── ssh_simulator (SSH bastion data)        │
│   │                                               │
│   └── Scheduler (background jobs)                 │
│       ├── Every 1s: generate TLS handshake        │
│       ├── Every 5s: cleanup stale connections     │
│       ├── Every 10s: evaluate alerts              │
│       ├── Every 15s: escalate alerts + rotate keys│
│       ├── Every 30s: recalculate QoS + drift inv  │
│       ├── Every 60s: save risk snapshot           │
│       └── Every 5m: save metrics snapshot         │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│              SQLite Database                      │
│              (pqc_shield.db)                      │
│                                                   │
│   Tables:                                         │
│   ├── tls_handshakes (every handshake recorded)   │
│   ├── active_tls_connections (current active)     │
│   ├── inventory_assets (50 network devices)       │
│   ├── policies (migration rules)                  │
│   ├── keys (encryption keys)                      │
│   ├── key_rotation_history (rotation events)      │
│   ├── alerts (triggered and resolved alerts)      │
│   ├── audit_log (every system event)              │
│   ├── risk_history (risk score snapshots)         │
│   ├── qos_metrics (SLA measurements)              │
│   ├── metrics_snapshots (periodic stats)          │
│   └── users (registered accounts)                 │
└──────────────────────────────────────────────────┘
```

### How Data Flows (The Heartbeat)

```
Every 1 Second:

  Scheduler triggers generate_tls_handshake()
      │
      ├── Randomly picks: Kyber768 (75%), Kyber+X25519 (23%), Classic (2%)
      ├── Generates latency: 1.2ms to 4.5ms
      ├── Determines success/failure (99.7% success rate)
      │
      ├── INSERT INTO tls_handshakes (record forever)
      └── INSERT INTO active_tls_connections (live table)

Every 5 Seconds:

  cleanup_stale_sessions()
      │
      ├── Mark connections inactive after 15s
      └── DELETE connections older than 60s

Every 10 Seconds:

  evaluate_alerts()
      │
      ├── Query last hour of handshakes
      ├── Calculate: failure rate, P99 latency, fallback rate
      │
      ├── If failure_rate > 1% → CREATE alert "FAILURE_RATE"
      ├── If p99_latency > 5ms → CREATE alert "LATENCY_SPIKE"
      └── If fallback_rate > 15% → CREATE alert "EXCESSIVE_FALLBACK"
      
      If condition clears → RESOLVE the alert automatically

Every 15 Seconds:

  escalate_alerts()
      │
      ├── Open alerts older than 60s: WARNING → HIGH
      └── Open alerts older than 180s: HIGH → CRITICAL

  auto_rotate_keys()
      │
      ├── Check each key's expiry date
      ├── If expired + auto_rotate=true:
      │   ├── Reset expiry (45s for demo key, 180d for others)
      │   ├── Increment rotation_count
      │   ├── Record in key_rotation_history
      │   ├── Create INFO alert
      │   └── Write audit log entry
      └── If expiring in 15 days → set status to "warning"

Every 30 Seconds:

  calculate_qos_metrics()
      │
      ├── Availability = (total - failures) / total × 100
      ├── MTTR = average alert resolution time
      └── Status = HEALTHY (>99.9%) / DEGRADED (>99%) / CRITICAL (<99%)

  drift_inventory()
      │
      ├── Slowly increase PQC readiness (+0-2% per asset)
      ├── Occasionally expire certificates (2% chance)
      └── Occasionally migrate RSA assets to Kyber768 (1% chance)

Every 60 Seconds:

  persist_risk_snapshot()
      │
      ├── Calculate risk from: policy coverage, failure rate,
      │   fallback rate, latency
      └── Save snapshot to risk_history table

Every 5 Minutes:

  persist_metrics_snapshot()
      │
      └── Save aggregated metrics to metrics_snapshots table
```

---

## 5. The Data Pipeline

### Understanding "Live from DB" vs "Simulated"

Quansec's PQC has two kinds of data:

### 🟢 Live from Database (Real Pipeline)

**These pages show data from actual SQLite records:**

The TLS handshake simulator runs every second and inserts REAL rows into the database. Every chart, number, and metric on these pages comes from SQL queries against those real rows.

| Page | What's Queried | How It Works |
|------|---------------|-------------|
| **TLS** | `tls_handshakes` + `active_tls_connections` | Shows handshakes per hour, active connections, latency charts, mode distribution — all from real DB records |
| **Telemetry** | `tls_handshakes` | Computes P50/P99 latency, success rate, algorithm distribution by counting and aggregating handshake records |
| **Inventory** | `inventory_assets` | Displays 50 network assets with PQC readiness %. Drift function slowly changes values |
| **Policy** | `policies` + `inventory_assets` | Counts how many TLS Gateway assets use the required algorithm. Shows compliance % |
| **Key Vault** | `keys` + `key_rotation_history` | Shows all encryption keys, expiry dates, rotation history. Demo key rotates every 45s |
| **Audit Trail** | `audit_log` | Every key rotation, alert, login, and policy change is logged here automatically |
| **QoS** | `qos_metrics` | Computed from handshake failure data and alert resolution times |
| **Alerts** | `alerts` | Created by the alert engine when failure rate, latency, or fallback rate exceeds thresholds |
| **Risk** | `risk_history` | Computed from policy coverage, failure rate, fallback rate, and latency |

### 🟡 Simulated (In-Memory Random)

**These pages show data generated from controlled random calculations:**

There is no database behind these. The numbers are generated in Python memory when you call the API. However, they now use **smooth drift** (sine waves) instead of pure random, so they change gradually like real metrics.

| Page | Why Simulated |
|------|--------------|
| **SSH** | The bastions and sessions are generated from `ssh_simulator.py`. Numbers drift slowly. Sessions persist for 30s between refreshes |
| **IPsec** | Tunnel data comes from `protocol_simulator.py`. Fixed set of 9 tunnels with slowly changing SA lifetimes and traffic counters |
| **VPN** | Peer data from `protocol_simulator.py`. Fixed set of 15 peers with incrementing RX/TX byte counters |

---

## 6. Page-by-Page Feature Breakdown

### 📊 Command Center (`/dashboard`)

**What it shows:** A bird's-eye view of all 4 protocols (TLS, SSH, IPsec, VPN).

**Components:**
- **Protocol Cards** (4 cards): Each shows active connections, latency, success rate, PQC %, and a progress bar
- **WebSocket Status**: Green pulsing dot when connected to live data feed
- **Data Source Badge**: TLS card = "✓ Live DB", others = "⚠ Simulated"
- **Navigation**: Click any card to go to that protocol's detail page

**How it works:**
- Calls `GET /api/protocols/overview` which returns data for all 4 protocols
- TLS data comes from the real SQLite database
- SSH/IPsec/VPN data comes from the protocol simulator (smooth drift)

---

### 🔒 TLS Monitor (`/tls`)

**What it shows:** The most detailed page — a full real-time monitoring dashboard for TLS connections.

**Components:**
1. **6 Stat Cards** with sparklines:
   - Handshakes/hr — how many TLS handshakes happened in the last hour
   - Active Connections — how many TLS connections are active right now
   - P50 Latency — median handshake time (half are faster)
   - P99 Latency — worst-case handshake time (99% are faster)
   - Success Rate — percentage of handshakes that succeeded
   - Fallback Rate — percentage that fell back to classical algorithms

2. **Handshake Timeline** (bar chart): Groups handshakes into 5-minute buckets showing volume over the last hour

3. **Mode Breakdown** (donut chart): Shows what percentage of connections are PQC-Only, Hybrid, or Classical

4. **P50 Latency Trend** (line chart): Shows how latency changes over time with an animated pulse

5. **Live Handshake Feed**: Shows each handshake as it happens — algorithm used, latency, success/failure — with entry animations

6. **KEM Algorithm Usage** (donut chart): Shows distribution of Kyber768, Kyber768+X25519, and Classic

7. **Performance Bars**: Visual progress bars for success rate, failure rate, and uptime

8. **Failure Analysis**: Cards showing failure count, fallback count, and 24-hour volume

9. **Data Pipeline Health**: 5-stage indicator showing Scheduler → Generator → Database → API → Frontend

10. **Active Connections Table**: Lists every currently active TLS connection with source, destination, algorithm, mode, and latency

**Data Source:** 🟢 ALL from real SQLite records. Every number is a real SQL query.

---

### 🖥️ SSH Bastions (`/ssh`)

**What it shows:** SSH bastion host status and active sessions.

**Components:**
- **Bastion Cards** (4 hosts): Each shows active sessions, CPU usage, memory, auth success rate, and PQC %
- **Session Table**: Lists active SSH sessions with user, target, algorithm, duration
- **Metrics**: Total bastions, active sessions, key exchanges today

**Data Source:** 🟡 Simulated (but stable — numbers drift slowly, sessions persist for 30s)

**How it works:**
- 4 fixed bastion hosts with slowly drifting CPU, memory, and session counts
- Sessions are generated once and persist for 30 seconds before refreshing
- Durations and command counts increment between refreshes (looks realistic)

---

### 🔗 IPsec Tunnels (`/ipsec`)

**What it shows:** Site-to-site encrypted tunnels between offices/datacenters.

**Components:**
- **Tunnel Table**: 9 fixed tunnels (HQ-DC1 ↔ Branch-NYC, etc.) with IKE version, KEM, auth algorithm, cipher, mode, and SA lifetime
- **Stats**: Active tunnels, success rate, throughput, PQC %

**Data Source:** 🟡 Simulated (but stable — same 9 tunnels every time, SA lifetimes count down, traffic counters increment)

---

### 🌐 VPN Peers (`/vpn`)

**What it shows:** WireGuard VPN peer connections.

**Components:**
- **Peer Table**: 15 fixed peers with endpoint, tunnel IP, KEM, signature, mode, RX/TX bytes, uptime
- **Stats**: Active peers, connections/hr, throughput, PQC %

**Data Source:** 🟡 Simulated (but stable — same 15 peers, RX/TX bytes slowly grow)

---

### 📈 Telemetry (`/telemetry`)

**What it shows:** Real-time analytics computed from TLS handshake data.

**Components:**
- **Stat Cards**: Handshakes/hr, success rate, P50 latency, P99 latency
- **Protocol Summary**: Per-protocol metrics (TLS, SSH, IPsec, VPN)
- **Timeline Charts**: Handshake volume and latency over time
- **Pipeline Status**: Shows if all 5 stages of the data pipeline are healthy

**Data Source:** 🟢 Live from DB — all numbers come from SQL queries on the `tls_handshakes` table

**How stats are calculated:**
```
Handshakes/hr = COUNT(*) WHERE timestamp > 1 hour ago
Success Rate  = (total - failures) / total × 100
P50 Latency   = Sort all latencies, pick the middle one
P99 Latency   = Sort all latencies, pick the one at 99th percentile
```

---

### 📦 Asset Inventory (`/inventory`)

**What it shows:** All network assets (servers, gateways, load balancers) with their PQC readiness.

**Components:**
- **Stat Cards**: Total assets, PQC Ready (readiness ≥85%), Hybrid (50-84%), Legacy (<50%)
- **Asset Table**: Hostname, type, algorithm, status, PQC readiness %, certificate expiry

**Data Source:** 🟢 Live from DB — 50 assets seeded on first startup

**How assets are categorized:**
- `pqc_readiness >= 85%` → **PQC Ready** (using Kyber/Dilithium)
- `50% <= pqc_readiness < 85%` → **Hybrid** (using hybrid algorithms like ECDSA+Kyber)
- `pqc_readiness < 50%` → **Legacy** (still using RSA-2048)

**Dynamic behavior:** The `drift_inventory()` function runs every 30 seconds:
- PQC readiness slowly increases (simulating ongoing migration)
- Certificates occasionally expire (simulating real infrastructure)
- RSA assets occasionally migrate to Kyber768 (simulating policy enforcement)

---

### 📜 Policy Engine (`/policy`)

**What it shows:** Migration policies and compliance status.

**Components:**
- **Policy Card**: Shows the active policy ("All TLS Gateways must use Kyber768")
- **Coverage Bar**: Progress bar showing how many target assets are compliant
- **Rollout Button**: "Rollout 90%" — triggers migration of non-compliant assets

**Data Source:** 🟢 Live from DB

**How compliance is calculated:**
```
1. Find the policy: "pqc-tls-mandate" requires Kyber768 for all TLS Gateways
2. Query all inventory assets where type = "TLS Gateway"
3. Count how many use "Kyber768" in their algorithm field
4. Coverage = compliant / total × 100
```

**What happens when you click "Rollout 90%":**
```
1. Find all TLS Gateway assets NOT using Kyber768
2. Change their algorithm to "Kyber768 + X25519"
3. Set pqc_readiness to 95%
4. Stop when 90% of assets are compliant
5. Write audit log: "Rollout initiated for pqc-tls-mandate"
```

---

### 🔑 Key Vault (`/keys`)

**What it shows:** All encryption keys, their expiry dates, and rotation history.

**Components:**
- **Stat Cards**: Total keys, PQC keys, classical keys, expiring soon
- **Key Table**: Key ID, type (KEM/SIG), algorithm, usage, status, rotations, auto-rotate flag, expiry
- **Rotate Button**: Manually trigger key rotation for any key

**Data Source:** 🟢 Live from DB

**Keys created on startup:**
| Key ID | Algorithm | Usage | Expiry | Auto-Rotate |
|--------|-----------|-------|--------|-------------|
| ROOT-CA-001 | Dilithium5 | Root CA Signing | 2 years | ❌ No |
| KEY-xxxx | Kyber768 | TLS | 180 days | ✅ Yes |
| KEY-xxxx | Kyber1024 | TLS | 180 days | ✅ Yes |
| KEY-xxxx | Dilithium3 | Authentication | 180 days | ✅ Yes |
| KEY-xxxx | SPHINCS+-SHA256 | Authentication | 180 days | ✅ Yes |
| KEY-xxxx | RSA-2048 (Legacy) | TLS | 180 days | ✅ Yes |
| **DEMO-KEY-LIVE** | **Kyber768** | **Live Demo** | **45 seconds** | ✅ Yes |

**What happens during auto-rotation:**
```
1. auto_rotate_keys() runs every 15 seconds
2. For each key where auto_rotate=true:
   a. Check: has the key expired?
   b. If yes:
      - Increment rotation_count
      - Reset expiry (45s for demo key, 180 days for others)
      - Set status back to "active"
      - Record in key_rotation_history table
      - Create INFO alert: "KEY-xxx auto-rotated"
      - Write audit log: "KEY-xxx auto-rotated"
   c. If expiring within 15 days:
      - Set status to "warning" (yellow indicator)
```

**The Demo Key:** `DEMO-KEY-LIVE` expires every 45 seconds. Since the rotation checker runs every 15 seconds, you'll see it rotate roughly every minute. Each rotation creates an audit log entry, making the Audit Trail "grow" during the demo.

---

### 🔍 Audit Trail (`/audit`)

**What it shows:** Every significant system event, chronologically.

**Components:**
- **Event List**: Each event shows type, description, severity, timestamp, source

**Data Source:** 🟢 Live from DB — grows automatically as the system runs

**Events that create audit log entries:**
| Trigger | Event Type | Example |
|---------|-----------|---------|
| Key rotation (auto) | KEY_ROTATED | "DEMO-KEY-LIVE auto-rotated" |
| Key rotation (manual) | KEY_ROTATED_MANUAL | "KEY-xxxx manually rotated" |
| Policy violation | POLICY_VIOLATION | "pqc-tls-mandate violated for Classic" |
| Sunset violation | SUNSET_VIOLATION | "Classical fallback used after sunset" |
| Excessive fallback | EXCESSIVE_FALLBACK | "Fallback exceeded 15%" |
| Policy rollout | POLICY_ROLLOUT | "Rollout initiated for pqc-tls-mandate" |
| User login | USER_LOGIN | "User login: admin@example.com" |
| User register | USER_REGISTER | "User registered: admin@example.com" |

---

### 📈 Quality of Service (`/qos`)

**What it shows:** Service reliability metrics and SLA compliance.

**Components:**
- **Stat Cards**: Availability %, MTTR (Mean Time To Resolution), Failed handshakes (24h)
- **Status Badge**: HEALTHY / DEGRADED / CRITICAL
- **Charts**: SLA compliance over time

**Data Source:** 🟢 Live from DB

**How metrics are calculated:**
```
Availability = (total_handshakes - failed_handshakes) / total_handshakes × 100

MTTR (Mean Time To Resolution):
  = Average(resolved_at - created_at) for all resolved alerts
  = Measures how fast the system auto-resolves problems

Status Levels:
  HEALTHY  → Availability > 99.9%
  DEGRADED → Availability > 99.0%
  CRITICAL → Availability < 99.0%
```

---

### ⚙️ Settings (`/settings`)

**What it shows:** System configuration options.

**Components:**
- PQC Mode toggle (PQC-Only / Hybrid / Classical)
- Minimum KEM algorithm selector
- Alert threshold settings
- Auto-rotation toggle

---

## 7. Backend Services Explained

### `telemetry_service.py` — The Heartbeat

**What it does:** Generates a fake TLS handshake every second and saves it to the database.

**Why "fake" isn't bad:** In a production environment, this would capture REAL handshakes from your TLS termination proxies (like Envoy, Nginx, HAProxy). For this demo, we simulate the handshakes with realistic parameters. The entire pipeline from "data arrives" → "stored in DB" → "displayed on frontend" is REAL.

**Algorithm distribution:**
- 75% chance: **Kyber768** (PQC-Only mode) — the primary algorithm
- 23% chance: **Kyber768+X25519** (Hybrid mode) — PQC + classical together
- 2% chance: **Classic** (ECDSA-P256 fallback) — legacy

**Success rate:** 99.7% (0.3% failure rate). This means roughly 1 in 333 handshakes fails.

---

### `alert_service.py` — The Watchdog

**What it does:** Monitors handshake data and creates alerts when thresholds are exceeded.

**Three alert types:**

| Alert | Trigger | Severity | What It Means |
|-------|---------|----------|---------------|
| FAILURE_RATE | >1% failures in last hour | HIGH | Too many handshakes are failing |
| LATENCY_SPIKE | P99 latency >5ms | MEDIUM | Handshakes are taking too long |
| EXCESSIVE_FALLBACK | >15% classical fallback | WARNING | Too many connections using old algorithms |

**Escalation engine:** If an alert stays open:
- After 60 seconds: WARNING → HIGH
- After 180 seconds: HIGH → CRITICAL

**Auto-resolution:** If the condition clears (e.g., failure rate drops below 1%), the alert is automatically resolved.

---

### `risk_service.py` — The Risk Calculator

**What it does:** Computes a single "risk score" (0–100) from multiple factors.

**Formula:**
```
Risk Score = (Policy Coverage Risk × 40%) +
             (Fallback Rate × 25%) +
             (Failure Rate × 20%) +
             (Latency Risk × 15%)

Where:
  Policy Coverage Risk = 100 - policy_compliance_percentage
  Latency Risk = min(P99_latency × 5, 100)
```

**Risk levels:**
- **LOW** (0–30): Everything is well-protected
- **MEDIUM** (30–70): Some areas need attention
- **HIGH** (70–100): Significant vulnerability exposure

---

### `kms_service.py` — The Key Manager

**What it does:** Manages encryption key lifecycle — creation, rotation, and expiry monitoring.

**Key hierarchy:**
```
ROOT-CA-001 (Dilithium5, 2-year expiry, never rotates)
├── KEY-xxxx (Kyber768, 180-day expiry, auto-rotates)
├── KEY-xxxx (Kyber1024, 180-day expiry, auto-rotates)
├── KEY-xxxx (Dilithium3, 180-day expiry, auto-rotates)
├── KEY-xxxx (SPHINCS+, 180-day expiry, auto-rotates)
├── KEY-xxxx (RSA-2048 Legacy, 180-day expiry, auto-rotates)
└── DEMO-KEY-LIVE (Kyber768, 45-second expiry, auto-rotates)
```

---

### `policy_service.py` — The Enforcement Engine

**What it does:** Defines and enforces migration policies.

**Default policy:**
```
Name: pqc-tls-mandate
Target: All "TLS Gateway" assets
Required KEM: Kyber768
Required Signature: Dilithium3
Enforcement: STRICT (violations create alerts)
Rollout: CANARY (50% at a time)
Sunset Date: June 1, 2026 (after this, classical is blocked)
```

---

### `protocol_simulator.py` — The Dashboard Data Source

**What it does:** Generates realistic-looking data for SSH, IPsec, and VPN protocols on the dashboard.

**Key design:** Uses smooth mathematical drift (sine waves) instead of random numbers, so metrics change gradually and look realistic during demos.

---

### `inventory_service.py` — The Asset Tracker

**What it does:** Manages the network asset inventory with 50 devices.

**Asset types:** TLS Gateway, SSH Bastion, App Server, Load Balancer

**Algorithm distribution:**
- ~35%: Kyber768 + X25519 (PQC-ready)
- ~25%: Dilithium3 (PQC-ready)
- ~20%: RSA-2048 Legacy (needs migration)
- ~20%: ECDSA P-384 Hybrid (partial migration)

---

## 8. Database Tables

| Table | Purpose | Rows Over Time |
|-------|---------|---------------|
| `tls_handshakes` | Every TLS handshake recorded | Grows by ~3,600/hour (1/sec) |
| `active_tls_connections` | Currently active connections | Stays ~10-15 (cleanup every 5s) |
| `inventory_assets` | Network devices and servers | 50 on startup, slowly evolves |
| `policies` | Migration enforcement rules | 1 on startup |
| `keys` | Encryption keys | 7 on startup |
| `key_rotation_history` | Record of every key rotation | Grows with each rotation |
| `alerts` | Active and resolved alerts | Grows and resolves over time |
| `audit_log` | Every system event | Grows continuously |
| `risk_history` | Risk score snapshots | 1 per minute |
| `qos_metrics` | SLA measurements | 1 per 30 seconds |
| `metrics_snapshots` | Aggregated stats | 1 per 5 minutes |
| `users` | Registered accounts | Manual registration |

---

## 9. API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Login and get JWT token |

### Protocol Overview
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/protocols/overview` | All 4 protocol stats |

### TLS
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tls/active-connections` | Currently active TLS connections |

### Telemetry
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/telemetry/performance` | P50, P99 latency, success rate |
| GET | `/api/telemetry/handshake-timeline` | Handshakes bucketed by 5-min intervals |
| GET | `/api/telemetry/mode-breakdown` | PQC-Only / Hybrid / Classic percentages |
| GET | `/api/telemetry/algorithm-usage` | KEM algorithm distribution |
| GET | `/api/telemetry/failure-analysis` | Failure count, fallback count |
| GET | `/api/telemetry/pipeline-status` | Health of each data pipeline stage |

### SSH
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ssh/bastions` | SSH bastion host list |
| GET | `/api/ssh/sessions` | Active SSH sessions |
| GET | `/api/ssh/metrics` | Aggregated SSH metrics |

### Inventory
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory/assets` | All network assets |
| GET | `/api/inventory/metrics` | Asset count by category |

### Key Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/kms/keys` | All keys with rotation history |
| POST | `/api/kms/rotate/{key_id}` | Manually rotate a specific key |
| GET | `/api/kms/metrics` | Key count by type |

### Policy
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/policy/coverage/{name}` | Policy compliance percentage |
| POST | `/api/policy/rollout/{name}` | Trigger policy rollout |

### Alerts, Audit, Risk, QoS
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts/` | All alerts (open and resolved) |
| GET | `/api/audit/` | All audit log events |
| GET | `/api/risk/score` | Current risk score + factors |
| GET | `/api/qos/metrics` | Availability, MTTR, status |

### Monitoring
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/metrics` | Prometheus-compatible metrics export |

### WebSocket
| Protocol | Endpoint | Description |
|----------|----------|-------------|
| WS | `/ws` | Real-time data push (protocols, alerts, telemetry) |

---

## 10. Scheduled Jobs

| Job | Interval | What It Does |
|-----|----------|-------------|
| `generate_tls_handshake` | 1 second | Creates a simulated TLS handshake and saves to SQLite |
| `cleanup_stale_sessions` | 5 seconds | Marks inactive connections, deletes old ones |
| `evaluate_alerts` | 10 seconds | Checks failure rate, latency, fallback — creates/resolves alerts |
| `escalate_alerts` | 15 seconds | Promotes alert severity based on age (WARNING→HIGH→CRITICAL) |
| `auto_rotate_keys` | 15 seconds | Checks key expiry, rotates expired keys, logs events |
| `calculate_qos_metrics` | 30 seconds | Recalculates availability, MTTR, health status |
| `drift_inventory` | 30 seconds | Slowly changes PQC readiness, expires certificates |
| `persist_risk_snapshot` | 60 seconds | Calculates and saves risk score to history |
| `persist_metrics_snapshot` | 5 minutes | Saves aggregated metrics snapshot |

---

## 11. Authentication Flow

```
1. User visits localhost:3000
2. Redirected to /login if no JWT token in sessionStorage
3. User registers: POST /api/auth/register → creates user in 'users' table
4. User logs in: POST /api/auth/login → returns JWT token
5. JWT stored in sessionStorage
6. Every API call includes: Authorization: Bearer <token>
7. Backend validates JWT on protected routes
8. Token expires after 24 hours → must login again
```

---

## 12. Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework with file-based routing |
| **React 18** | UI component library |
| **Tailwind CSS** | Utility-first CSS styling |
| **Framer Motion** | Smooth animations and transitions |
| **Lucide React** | Icon library |
| **shadcn/ui** | Pre-built UI components (Card, Badge, etc.) |

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | Python web framework for REST APIs |
| **SQLAlchemy** | Database ORM (maps Python objects to SQL tables) |
| **SQLite** | Lightweight file-based database |
| **APScheduler** | Background task scheduling |
| **Uvicorn** | ASGI server (runs the FastAPI app) |
| **Python-JOSE** | JWT token creation and validation |
| **Bcrypt** | Password hashing |

### Communication
| Technology | Purpose |
|-----------|---------|
| **REST API** | Frontend fetches data from backend via HTTP requests |
| **WebSocket** | Backend pushes real-time updates to frontend (live feed) |

---

## 13. Algorithms and Standards

### NIST Post-Quantum Standards

| Standard | Algorithm | Type | Use Case |
|----------|-----------|------|----------|
| **FIPS 203** | ML-KEM (Kyber) | Key Encapsulation | Securely exchanging encryption keys |
| **FIPS 204** | ML-DSA (Dilithium) | Digital Signature | Proving identity, signing certificates |
| **FIPS 205** | SLH-DSA (SPHINCS+) | Digital Signature | Alternative to Dilithium with different math |

### CNSA 2.0 Timeline

| Year | Requirement |
|------|------------|
| **2025** | Begin transitioning to PQC algorithms |
| **2030** | All new systems must use PQC |
| **2033** | All existing systems must be migrated |
| **2035** | Classical algorithms fully prohibited |

---

## 14. Data Sources

| Page | Badge | Data Source | Refreshes |
|------|-------|------------|-----------|
| Dashboard (TLS card) | ✓ Live DB | SQLite `tls_handshakes` | Every 2s |
| Dashboard (SSH/IPsec/VPN) | ⚠ Simulated | `protocol_simulator.py` | Every 2s |
| TLS | ● Live | SQLite `tls_handshakes` + `active_tls_connections` | Every 2s |
| Telemetry | Live from DB | SQLite `tls_handshakes` | Every 2s |
| SSH | ⚠ Simulated | `ssh_simulator.py` | Every 2s |
| IPsec | ⚠ Simulated | `protocol_simulator.py` | Every 2s |
| VPN | ⚠ Simulated | `protocol_simulator.py` | Every 2s |
| Inventory | ✓ Live DB | SQLite `inventory_assets` | Every 2s |
| Policy | ✓ Live DB | SQLite `policies` + `inventory_assets` | Every 2s |
| Key Vault | ✓ Live DB | SQLite `keys` | Every 2s |
| Audit Trail | ✓ Live DB | SQLite `audit_log` | Every 2s |
| QoS | ✓ Live DB | SQLite `qos_metrics` | Every 2s |

---

## 15. Risk Scoring Formula

```
Risk Score (0-100) = Weighted sum of 4 factors:

┌─────────────────────────┬────────┬────────────────────────────────────┐
│ Factor                  │ Weight │ Calculation                         │
├─────────────────────────┼────────┼────────────────────────────────────┤
│ Policy Coverage Risk    │ 40%    │ 100 - compliance_percentage         │
│ Fallback Rate           │ 25%    │ classical_handshakes / total × 100  │
│ Failure Rate            │ 20%    │ failed_handshakes / total × 100     │
│ Latency Risk            │ 15%    │ min(P99_latency × 5, 100)           │
└─────────────────────────┴────────┴────────────────────────────────────┘

Example:
  Policy Compliance = 47% → Coverage Risk = 53
  Fallback Rate = 2% → 2
  Failure Rate = 0.3% → 0.3
  P99 Latency = 4.2ms → Latency Risk = min(21, 100) = 21

  Risk = (53 × 0.4) + (2 × 0.25) + (0.3 × 0.2) + (21 × 0.15)
       = 21.2 + 0.5 + 0.06 + 3.15
       = 24.91 → LOW risk

Risk Levels:
  0-30  → LOW     (green)
  30-70 → MEDIUM  (amber)
  70-100 → HIGH   (red)
```

---

## 16. Deployment Guide

### Prerequisites
- **Node.js** 18+ (for frontend)
- **Python** 3.9+ (for backend)
- **npm** (comes with Node.js)
- **pip** (comes with Python)

### Starting the Backend
```bash
cd pqc-shield-backend/pqc-shield-backend
pip install -r requirements.txt
py -m uvicorn app.main:app --reload --port 8000
```

What happens on startup:
1. SQLite database created (if not exists)
2. All tables created (via SQLAlchemy)
3. 50 inventory assets seeded
4. 1 migration policy seeded
5. 6 encryption keys seeded + 1 demo key
6. Scheduler starts all background jobs

### Starting the Frontend
```bash
cd pqc-shield-final/pqc-shield-next
npm install
npm run dev
```

Opens at http://localhost:3000

### Environment Variables

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### For Fresh Demo
Delete the database to start clean:
```bash
# Stop the backend first
del pqc_shield.db
# Restart the backend
py -m uvicorn app.main:app --reload --port 8000
```

---

*Document generated for Quansec's PQC v1.0 — March 2026*
