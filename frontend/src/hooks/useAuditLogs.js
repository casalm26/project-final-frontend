import { useState, useEffect, useMemo } from 'react';
import { AUDIT_LOG_PAGINATION_SIZE } from '@constants/auditLogConstants';
import { auditAPI } from '@/lib/api';

export const useAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await auditAPI.getLogs({
        page: 1,
        limit: 100,
        sortBy: 'timestamp',
        sortOrder: 'desc'
      });
      
      if (response.success) {
        // Transform the API response to match the expected format
        const transformedLogs = (response.data.logs || []).map(log => ({
          id: log._id,
          timestamp: log.timestamp,
          user: log.userEmail || 'Unknown',
          action: log.action,
          resource: log.resource,
          resourceId: log.resourceId || '',
          details: generateLogDetails(log),
          ipAddress: log.metadata?.ipAddress || '',
          userAgent: log.metadata?.userAgent || ''
        }));
        
        setAuditLogs(transformedLogs);
      } else {
        throw new Error(response.message || 'Failed to fetch audit logs');
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      setError(err.message);
      // Keep empty array on error
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const generateLogDetails = (log) => {
    // Generate human-readable details based on the log data
    const action = log.action.toLowerCase();
    const resource = log.resource.toLowerCase();
    
    switch (action) {
      case 'create':
        return `Created new ${resource} record`;
      case 'update':
        return `Updated ${resource} record`;
      case 'delete':
        return `Deleted ${resource} record`;
      case 'login':
        return 'User logged in successfully';
      case 'logout':
        return 'User logged out';
      default:
        return `Performed ${action} action on ${resource}`;
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return { auditLogs, loading, error, refetchAuditLogs: fetchAuditLogs };
};

export const useAuditLogFilters = (auditLogs) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

  const filteredAndSortedLogs = useMemo(() => {
    return auditLogs
      .filter(log => {
        const matchesSearch = searchTerm === '' || 
          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.resource.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesAction = actionFilter === '' || log.action === actionFilter;
        
        return matchesSearch && matchesAction;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [auditLogs, searchTerm, actionFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    actionFilter,
    setActionFilter,
    sortField,
    sortDirection,
    filteredAndSortedLogs,
    handleSort
  };
};

export const usePagination = (data, pageSize = AUDIT_LOG_PAGINATION_SIZE) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    paginatedData,
    pageSize
  };
};