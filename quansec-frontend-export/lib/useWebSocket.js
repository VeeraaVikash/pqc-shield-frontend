'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useWebSocket — Real-time connection to backend WebSocket.
 * Auto-reconnects with exponential backoff.
 * Messages are dispatched by `type` field.
 */

const RECONNECT_BASE_DELAY = 2000;   // give backend time to recover
const RECONNECT_MAX_DELAY = 20000;  // back off more on repeated failures
const MAX_RECONNECT_ATTEMPTS = 10;     // stop hammering after 10 failures

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
    if (!mountedRef.current) return;

    // give up after too many attempts instead of looping forever
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

        // don't reconnect on intentional close
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
        ws.close();
      };

    } catch {
      setStatus('disconnected');
    }
  }, [url]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

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

/**
 * useWebSocketMessages — Filters WebSocket messages by type.
 * Returns the latest data for a specific message type.
 */
export function useWebSocketMessages(lastMessage, type) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (lastMessage?.type === type) {
      setData(lastMessage.data);
    }
  }, [lastMessage, type]);

  return data;
}