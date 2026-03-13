'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const RECONNECT_BASE_DELAY = 2000;
const RECONNECT_MAX_DELAY = 20000;
const MAX_RECONNECT_ATTEMPTS = 10;

export function useWebSocket(url) {
  const [status, setStatus] = useState('connecting');
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionInfo, setConnectionInfo] = useState({ connectedClients: 0, latency: 0 });

  const wsRef = useRef(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const mountedRef = useRef(true);
  const pingTimestampRef = useRef(null);

  const connect = useCallback(() => {
    if (!mountedRef.current || !url) return;

    if (reconnectAttemptRef.current >= MAX_RECONNECT_ATTEMPTS) {
      setStatus('disconnected');
      return;
    }

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) { ws.close(); return; }
        setStatus('connected');
        reconnectAttemptRef.current = 0;
        pingTimestampRef.current = Date.now();
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const msg = JSON.parse(event.data);
          setLastMessage(msg);

          if (msg.type === 'heartbeat' || msg.type === 'initial_snapshot') {
            const clients = msg.data?.connected_clients ?? 0;
            const latency = pingTimestampRef.current
              ? Math.min(Date.now() - pingTimestampRef.current, 999)
              : 0;
            pingTimestampRef.current = Date.now();
            setConnectionInfo({ connectedClients: clients, latency });
          }
        } catch {
          // non-JSON, ignore
        }
      };

      ws.onclose = (event) => {
        if (!mountedRef.current) return;
        wsRef.current = null;

        if (event.code === 1000) {
          setStatus('disconnected');
          return;
        }

        const attempt = reconnectAttemptRef.current;
        const delay = Math.min(RECONNECT_BASE_DELAY * Math.pow(1.5, attempt), RECONNECT_MAX_DELAY);
        reconnectAttemptRef.current = attempt + 1;

        setStatus('reconnecting');
        reconnectTimerRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        // onclose will be called after onerror, so just close
        ws.close();
      };

    } catch {
      setStatus('disconnected');
    }
  }, [url]);

  useEffect(() => {
    mountedRef.current = true;
    if (url) connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close(1000, 'component unmounted');
      }
    };
  }, [connect]);

  return { lastMessage, status, connectionInfo };
}

export function useWebSocketMessages(lastMessage, type) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (lastMessage?.type === type) {
      setData(lastMessage.data || lastMessage);
    }
  }, [lastMessage, type]);

  return data;
}
