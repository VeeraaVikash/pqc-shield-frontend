'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useWebSocket — Real-time connection to backend WebSocket.
 * Auto-reconnects with exponential backoff.
 * Messages are dispatched by `type` field.
 *
 * Usage:
 *   const { lastMessage, status, connectionInfo } = useWebSocket('ws://localhost:8000/api/ws/live');
 */

const RECONNECT_BASE_DELAY = 1000;
const RECONNECT_MAX_DELAY = 15000;

export function useWebSocket(url) {
  const [status, setStatus] = useState('connecting'); // 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionInfo, setConnectionInfo] = useState({ connectedClients: 0, latency: 0 });

  const wsRef = useRef(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const mountedRef = useRef(true);
  const pingTimestampRef = useRef(null);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setStatus('connected');
        reconnectAttemptRef.current = 0;
        pingTimestampRef.current = Date.now();
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const msg = JSON.parse(event.data);
          setLastMessage(msg);

          // Track connected clients from heartbeat
          if (msg.type === 'heartbeat' || msg.type === 'initial_snapshot') {
            const clients = msg.data?.connected_clients || 0;
            const latency = Date.now() - (pingTimestampRef.current || Date.now());
            pingTimestampRef.current = Date.now();
            setConnectionInfo({ connectedClients: clients, latency: Math.min(latency, 999) });
          }
        } catch (e) {
          // Non-JSON message, ignore
        }
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        wsRef.current = null;

        // Exponential backoff reconnect
        const attempt = reconnectAttemptRef.current;
        const delay = Math.min(RECONNECT_BASE_DELAY * Math.pow(2, attempt), RECONNECT_MAX_DELAY);
        reconnectAttemptRef.current = attempt + 1;

        setStatus('reconnecting');
        reconnectTimerRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        // onclose will fire after this
        ws.close();
      };
    } catch (e) {
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
        wsRef.current.onclose = null; // prevent reconnect on intentional close
        wsRef.current.close();
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
    if (lastMessage && lastMessage.type === type) {
      setData(lastMessage.data);
    }
  }, [lastMessage, type]);

  return data;
}
