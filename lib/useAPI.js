'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

export function useAPI(fetcher, interval) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ref = useRef(fetcher);
  const mountedRef = useRef(true);

  // Keep fetcher ref up to date without causing re-renders
  ref.current = fetcher;

  const refetch = useCallback(async () => {
    try {
      setError(null);
      const result = await ref.current();
      if (!mountedRef.current) return;
      if (result !== null && result !== undefined) {
        setData(result);
      }
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e.message || 'Failed to fetch');
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refetch();

    if (interval) {
      const t = setInterval(refetch, interval);
      return () => {
        mountedRef.current = false;
        clearInterval(t);
      };
    }

    return () => {
      mountedRef.current = false;
    };
  }, [refetch, interval]);

  return { data, loading, error, refetch };
}
