import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboard.service';
import { useRealtimeData } from '../hooks/useRealtimeData';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const { isConnected, latestTelemetry, latestAlert } = useRealtimeData();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const summary = await dashboardService.getSummary();
      setData(summary);
      setError(null);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update telemetry in state when real-time event received
  useEffect(() => {
    if (latestTelemetry && data) {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lastTelemetry: latestTelemetry,
        };
      });
    }
  }, [latestTelemetry]);

  // Prepend new alert when received
  useEffect(() => {
    if (latestAlert && data) {
      setData((prev) => {
        if (!prev) return prev;
        const exists = prev.recentAlerts?.some((a) => a.id === latestAlert.id);
        if (exists) return prev;
        return {
          ...prev,
          recentAlerts: [latestAlert, ...(prev.recentAlerts || [])].slice(0, 10),
          stats: {
            ...prev.stats,
            criticalAlertsCount:
              latestAlert.severity === 'Critical'
                ? (prev.stats?.criticalAlertsCount || 0) + 1
                : prev.stats?.criticalAlertsCount,
          },
        };
      });
    }
  }, [latestAlert]);

  return (
    <DashboardContext.Provider
      value={{
        data,
        loading,
        error,
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        notificationPanelOpen,
        setNotificationPanelOpen,
        isSocketConnected: isConnected,
        refresh: fetchDashboardData,
        latestTelemetry,
        latestAlert,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
}
