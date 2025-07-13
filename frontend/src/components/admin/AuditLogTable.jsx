import { useState, useEffect } from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: #f9fafb;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #f3f4f6;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #111827;
  vertical-align: top;
`;

const ActionBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    switch (props.action) {
      case 'CREATE':
        return 'background: #d1fae5; color: #065f46;';
      case 'UPDATE':
        return 'background: #dbeafe; color: #1e40af;';
      case 'DELETE':
        return 'background: #fee2e2; color: #991b1b;';
      case 'LOGIN':
        return 'background: #fef3c7; color: #92400e;';
      case 'LOGOUT':
        return 'background: #f3f4f6; color: #374151;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

const PaginationContainer = styled.div`
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: between;
  align-items: center;
`;

const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-left: auto;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.active {
    background: #10b981;
    color: white;
    border-color: #10b981;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #10b981;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const SortIcon = styled.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: #9ca3af;
`;

// Mock audit log data
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

export const AuditLogTable = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedLogs = auditLogs
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

  const totalPages = Math.ceil(filteredAndSortedLogs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLogs = filteredAndSortedLogs.slice(startIndex, startIndex + pageSize);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>Audit Log</TableTitle>
        <FilterSection>
          <SearchInput
            type="text"
            placeholder="Search by user, action, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
          </FilterSelect>
        </FilterSection>
      </TableHeader>

      {loading ? (
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      ) : paginatedLogs.length === 0 ? (
        <EmptyState>
          <p>No audit logs found matching your criteria.</p>
        </EmptyState>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell onClick={() => handleSort('timestamp')}>
                Timestamp <SortIcon>{getSortIcon('timestamp')}</SortIcon>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('user')}>
                User <SortIcon>{getSortIcon('user')}</SortIcon>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('action')}>
                Action <SortIcon>{getSortIcon('action')}</SortIcon>
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('resource')}>
                Resource <SortIcon>{getSortIcon('resource')}</SortIcon>
              </TableHeaderCell>
              <TableHeaderCell>Details</TableHeaderCell>
              <TableHeaderCell>IP Address</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {paginatedLogs.map(log => (
              <TableRow key={log.id}>
                <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>
                  <ActionBadge action={log.action}>{log.action}</ActionBadge>
                </TableCell>
                <TableCell>{log.resource}</TableCell>
                <TableCell>{log.details}</TableCell>
                <TableCell>{log.ipAddress}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}

      <PaginationContainer>
        <PaginationInfo>
          Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredAndSortedLogs.length)} of {filteredAndSortedLogs.length} entries
        </PaginationInfo>
        <PaginationControls>
          <PaginationButton
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </PaginationButton>
          <PaginationButton
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PaginationButton>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = currentPage - 2 + i;
            if (pageNumber > 0 && pageNumber <= totalPages) {
              return (
                <PaginationButton
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={currentPage === pageNumber ? 'active' : ''}
                >
                  {pageNumber}
                </PaginationButton>
              );
            }
            return null;
          })}
          <PaginationButton
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationButton>
          <PaginationButton
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </PaginationButton>
        </PaginationControls>
      </PaginationContainer>
    </TableContainer>
  );
}; 