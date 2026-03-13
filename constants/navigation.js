import { Activity, Server, ShieldCheck, Globe, Terminal, KeyRound, BarChart3, FileText, Zap, Settings, Wifi, Lock } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', path: '/dashboard', label: 'Command Center', icon: Activity },
  { id: 'inventory', path: '/inventory', label: 'Inventory', icon: Server },
  { id: 'policy', path: '/policy', label: 'Policy Engine', icon: ShieldCheck },
  { id: 'tls', path: '/tls', label: 'TLS Integration', icon: Lock },
  { id: 'ssh', path: '/ssh', label: 'SSH Integration', icon: Terminal },
  { id: 'ipsec', path: '/ipsec', label: 'IPsec Tunnels', icon: Globe },
  { id: 'vpn', path: '/vpn', label: 'VPN Connections', icon: Wifi },
  { id: 'keys', path: '/keys', label: 'Key Management', icon: KeyRound },
  { id: 'key-exchange', path: '/key-exchange', label: 'Key Exchange', icon: KeyRound },
  { id: 'telemetry', path: '/telemetry', label: 'Telemetry', icon: BarChart3 },
  { id: 'audit', path: '/audit', label: 'Audit Logs', icon: FileText },
  { id: 'qos', path: '/qos', label: 'QoS & Resilience', icon: Zap },
  { id: 'settings', path: '/settings', label: 'Settings', icon: Settings },
];

export const HOMEPAGE_NAV = [
  { label: 'Platform', href: '#platform' },
  { label: 'Protocols', href: '#protocols' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Docs', href: '/docs' },
];
