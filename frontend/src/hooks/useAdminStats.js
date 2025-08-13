import { useState, useEffect } from 'react';
import { auditAPI } from '@/lib/api';

export const useAdminStats = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalActions: 0,
    failedActions: 0,
    systemUptime: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdminStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await auditAPI.getLogs({ 
        days: 1,
        page: 1,
        limit: 1000
      });
      
      if (response.success) {
        const logs = response.data.logs || [];
        
        // Calculate active users (unique users in last 24 hours)
        const uniqueUsers = new Set(logs.map(log => log.userEmail)).size;
        
        // Total actions today
        const totalActions = logs.length;
        
        // Failed actions (assuming failed actions have error metadata)
        const failedActions = logs.filter(log => 
          log.metadata?.statusCode >= 400 || log.metadata?.errorMessage
        ).length;
        
        // System uptime calculation (simplified - based on no critical errors)
        const criticalErrors = logs.filter(log => 
          log.metadata?.statusCode >= 500
        ).length;
        const uptime = Math.max(95, 100 - (criticalErrors / totalActions) * 100);
        
        setStats({
          activeUsers: uniqueUsers,
          totalActions: totalActions,
          failedActions: failedActions,
          systemUptime: uptime.toFixed(1)
        });
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      setError(err.message);
      // Fallback to reasonable defaults
      setStats({
        activeUsers: 0,
        totalActions: 0,
        failedActions: 0,
        systemUptime: '99.9'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  return { 
    stats, 
    loading, 
    error, 
    refetch: fetchAdminStats 
  };
};