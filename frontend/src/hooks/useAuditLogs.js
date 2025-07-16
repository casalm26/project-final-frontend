import { useState, useEffect, useMemo } from 'react';
import { AUDIT_LOG_PAGINATION_SIZE } from '@constants/auditLogConstants';

const mockAuditLogs = [
  {
    id: 1,
    timestamp: '2024-01-15T10:30:00Z',
    user: 'admin@nanwa.com',
    action: 'CREATE',
    resource: 'Tree',
    resourceId: 'tree_001',
    details: 'Created new tree record for Forest A',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: 2,
    timestamp: '2024-01-15T10:25:00Z',
    user: 'user@nanwa.com',
    action: 'UPDATE',
    resource: 'Tree',
    resourceId: 'tree_002',
    details: 'Updated height measurement from 2.3m to 2.4m',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 3,
    timestamp: '2024-01-15T10:20:00Z',
    user: 'admin@nanwa.com',
    action: 'DELETE',
    resource: 'Forest',
    resourceId: 'forest_003',
    details: 'Deleted forest record due to data cleanup',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: 4,
    timestamp: '2024-01-15T10:15:00Z',
    user: 'user@nanwa.com',
    action: 'LOGIN',
    resource: 'Authentication',
    resourceId: 'auth_session_001',
    details: 'User logged in successfully',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 5,
    timestamp: '2024-01-15T10:10:00Z',
    user: 'admin@nanwa.com',
    action: 'UPDATE',
    resource: 'User',
    resourceId: 'user_001',
    details: 'Updated user permissions to admin level',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: 6,
    timestamp: '2024-01-15T10:05:00Z',
    user: 'system',
    action: 'CREATE',
    resource: 'Measurement',
    resourceId: 'measurement_001',
    details: 'Automated measurement recorded for tree batch',
    ipAddress: '127.0.0.1',
    userAgent: 'System/1.0'
  },
  {
    id: 7,
    timestamp: '2024-01-15T10:00:00Z',
    user: 'user@nanwa.com',
    action: 'LOGOUT',
    resource: 'Authentication',
    resourceId: 'auth_session_002',
    details: 'User logged out',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
];

export const useAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAuditLogs(mockAuditLogs);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return { auditLogs, loading, refetchAuditLogs: fetchAuditLogs };
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