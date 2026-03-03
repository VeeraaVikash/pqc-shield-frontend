'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * useAPI — React hook for fetching from the PQC Shield backend.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useAPI(api.getCommandCenter);
 *   const { data, loading } = useAPI(() => api.getPolicyCoverage('pqc-tls-mandate'));
 *
 * @param {function} fetcher — An async function that returns data
 * @param {number}   interval — Optional: auto-refresh interval in ms (e.g., 5000 for 5s)
 */
export function useAPI(fetcher, interval = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    refetch();

    if (interval) {
      const timer = setInterval(refetch, interval);
      return () => clearInterval(timer);
    }
  }, [refetch, interval]);

  return { data, loading, error, refetch };
}
