# Quansec's PQC — Enterprise VPN Platform

> Post-Quantum Cryptography management platform for 4 protocol integrations: TLS, SSH, IPsec, WPA3.

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`

## Deploy (2 minutes)

```bash
# Vercel (recommended)
npx vercel

# Or build static
npm run build && npm start
```

---

## Project Structure

```
pqc-shield-next/
├── app/
│   ├── (marketing)/              ← PUBLIC PAGES
│   │   └── page.jsx              ← Landing page / Homepage
│   │
│   ├── (auth)/                   ← AUTHENTICATION
│   │   ├── login/page.jsx        ← Sign-in page (operator/admin/viewer)
│   │   └── admin/page.jsx        ← Admin panel (users, roles, system)
│   │
│   ├── (dashboard)/              ← PROTECTED DASHBOARD (10 screens)
│   │   ├── layout.jsx            ← Sidebar + mobile nav shell
│   │   ├── dashboard/page.jsx    ← Command Center overview
│   │   ├── inventory/page.jsx    ← Endpoint inventory & readiness
│   │   ├── policy/page.jsx       ← Policy engine management
│   │   ├── tls/page.jsx          ← TLS proxy/sidecar integration
│   │   ├── ssh/page.jsx          ← SSH bastion management
│   │   ├── keys/page.jsx         ← Crypto key lifecycle
│   │   ├── telemetry/page.jsx    ← Analytics & pipeline status
│   │   ├── audit/page.jsx        ← Security event audit trail
│   │   ├── qos/page.jsx          ← QoS, failover, anomaly detection
│   │   └── settings/page.jsx     ← Configuration & NIST compliance
│   │
│   ├── (docs)/                   ← DOCUMENTATION (10 pages)
│   │   ├── layout.jsx            ← Docs shell with nav
│   │   ├── docs/page.jsx         ← Docs hub (all protocols + features)
│   │   └── docs/[slug]/page.jsx  ← Individual doc page
│   │
│   ├── api/                      ← API ROUTES (backend stubs)
│   │   ├── auth/route.js         ← Auth endpoint
│   │   └── protocols/route.js    ← Protocol status + endpoint map
│   │
│   ├── layout.jsx                ← Root layout (fonts, meta)
│   └── globals.css               ← Tailwind + animations + design tokens
│
├── components/
│   ├── ui/                       ← 8 reusable UI primitives
│   ├── charts/                   ← 3 SVG chart components
│   └── layout/                   ← Sidebar + MobileNav
│
├── constants/
│   ├── navigation.js             ← Sidebar + homepage nav config
│   ├── mockData.js               ← All mock datasets (swap with API)
│   └── docs.js                   ← Documentation content for all pages
│
├── lib/
│   └── utils.js                  ← Helpers, PQC classifiers, formatters
│
└── Config files                  ← next.config, tailwind, postcss, jsconfig
```

---

## Pages Overview

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Homepage | Enterprise landing page with protocol overview |
| `/login` | Sign In | Email/password with role selection |
| `/admin` | Admin Panel | User management, roles, system config |
| `/dashboard` | Command Center | Real-time PQC metrics and alerts |
| `/inventory` | Inventory | Endpoint catalog with readiness scores |
| `/policy` | Policy Engine | Algorithm enforcement and rollout |
| `/tls` | TLS Integration | Proxy architecture and connections |
| `/ssh` | SSH Integration | Bastion nodes and sessions |
| `/keys` | Key Management | Key lifecycle and rotation |
| `/telemetry` | Telemetry | Analytics and pipeline health |
| `/audit` | Audit Logs | Security event trail |
| `/qos` | QoS & Resilience | SLAs, failover, anomaly detection |
| `/settings` | Settings | Config and NIST compliance |
| `/docs` | Docs Hub | All documentation index |
| `/docs/[slug]` | Doc Page | Individual protocol/feature docs |

---

## For Backend Team (4 Protocol Teams)

Each protocol has its own documentation page at `/docs/[protocol]` with:
- Architecture overview
- API endpoint definitions
- Backend integration requirements
- Configuration options

### API Endpoint Map

```
/api/v1/
├── auth/                    ← Authentication
├── dashboard/stats          ← Overview metrics
├── inventory/               ← Asset management
├── policies/                ← Policy CRUD
├── tls/
│   ├── connections          ← TLS Team
│   ├── proxy/config
│   └── metrics
├── ssh/
│   ├── bastions             ← SSH Team
│   ├── sessions
│   └── keys
├── ipsec/
│   ├── tunnels              ← IPsec Team
│   └── metrics
├── wpa3/
│   ├── access-points        ← WPA3 Team
│   ├── clients
│   └── policy
├── keys/                    ← Key Management
├── telemetry/               ← Metrics Pipeline
├── audit/                   ← Audit Logs
└── qos/                     ← QoS Monitoring
```

### Connecting Your Backend

1. Create API route files in `app/api/[service]/route.js`
2. Replace mock data imports in page files with `fetch('/api/...')`
3. Each protocol team works independently on their routes
4. The dashboard auto-updates when real data flows in

---

## Mobile Responsive

- Desktop: Full sidebar navigation
- Mobile: Bottom tab bar with quick access + expandable menu
- All pages are mobile-optimized with responsive grids

---

## Tech Stack

- **Next.js 14** (App Router, SSR/SSG, API Routes)
- **Tailwind CSS** (Custom design tokens)
- **Lucide Icons** (Consistent icon system)
- **No external UI libraries** (lightweight, fully custom)
