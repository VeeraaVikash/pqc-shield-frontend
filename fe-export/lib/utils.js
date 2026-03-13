import clsx from 'clsx';

export const cn = (...inputs) => clsx(inputs);

export const isPQCAlgorithm = (algo) =>
  ['Kyber', 'Dilithium', 'SPHINCS', 'ML-KEM', 'ML-DSA', 'SLH-DSA'].some((kw) => algo.includes(kw));

export const getAlgoBadgeVariant = (algo) => {
  if (isPQCAlgorithm(algo)) return 'pqc';
  if (algo.toLowerCase().includes('hybrid')) return 'info';
  return 'warning';
};

export const getStatusColor = (status) =>
  ({ active: '#22c55e', warning: '#f59e0b', critical: '#ef4444', inactive: '#475569', pending: '#3b82f6' }[status] || '#475569');

export const getSeverityVariant = (severity) =>
  ({ critical: 'danger', warning: 'warning', info: 'default' }[severity] || 'default');

export const getNodeHealth = (name) => {
  if (name.includes('prod-03')) return 'warning';
  if (name.includes('api-server-01')) return 'critical';
  return 'active';
};
