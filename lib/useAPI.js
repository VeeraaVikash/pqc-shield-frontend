'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
export function useAPI(fetcher, interval) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ref = useRef(fetcher); ref.current = fetcher;
  const refetch = useCallback(async () => {
    try { setError(null); const r=await ref.current(); if(r!==null) setData(r); }
    catch(e){ setError(e.message||'Failed'); } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    refetch();
    if(interval){const t=setInterval(refetch,interval);return ()=>clearInterval(t);}
  }, [refetch, interval]);
  return { data, loading, error, refetch };
}
