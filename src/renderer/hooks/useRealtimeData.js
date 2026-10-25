import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useRealtimeData() {
  const [isConnected, setIsConnected] = useState(false);
  const [latestTelemetry, setLatestTelemetry] = useState(null);
  const [latestAlert, setLatestAlert] = useState(null);

  useEffect(() => {
    // Connect through proxy or direct port 5001
    const socketUrl = window.location.port === '5173' ? 'http://localhost:5001' : '/';
    const socket = io(socketUrl, {
      reconnectionAttempts: 10,
      timeout: 3000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('telemetry:reading', (data) => {
      setLatestTelemetry(data);
    });

    socket.on('alert:new', (data) => {
      setLatestAlert(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { isConnected, latestTelemetry, latestAlert };
}
