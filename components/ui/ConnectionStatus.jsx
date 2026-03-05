'use client';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

/**
 * ConnectionStatus — Visual indicator for WebSocket connection state.
 * Shows pulsing green (connected), yellow spinner (reconnecting), or red (disconnected).
 */
export default function ConnectionStatus({ status, info }) {
    const isConnected = status === 'connected';
    const isReconnecting = status === 'reconnecting' || status === 'connecting';

    return (
        <div className="flex items-center gap-2 text-xs">
            {isConnected ? (
                <>
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                    </span>
                    <span className="text-emerald-400 font-medium">Live</span>
                    {info?.connectedClients > 0 && (
                        <span className="text-slate-600 font-mono">{info.connectedClients} clients</span>
                    )}
                </>
            ) : isReconnecting ? (
                <>
                    <Loader2 size={12} className="text-yellow-400 animate-spin" />
                    <span className="text-yellow-400 font-medium">Reconnecting...</span>
                </>
            ) : (
                <>
                    <WifiOff size={12} className="text-red-400" />
                    <span className="text-red-400 font-medium">Disconnected</span>
                </>
            )}
        </div>
    );
}
