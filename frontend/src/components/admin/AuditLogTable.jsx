import { TableContainer, TableHeader, TableTitle } from '@components/ui/Table';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import { Pagination } from '@components/ui/Pagination';
import { AuditLogFilters } from './AuditLogFilters';
import { AuditLogTableBody } from './AuditLogTableBody';
import { useAuditLogs, useAuditLogFilters, usePagination } from '@hooks/useAuditLogs';
import { AUDIT_LOG_PAGINATION_SIZE } from '@constants/auditLogConstants';

export const AuditLogTable = () => {
  // TODO: Consider moving audit log state to Zustand store for better state management
  const { auditLogs, loading } = useAuditLogs();
  const {
    searchTerm,
    setSearchTerm,
    actionFilter,
    setActionFilter,
    sortField,
    sortDirection,
    filteredAndSortedLogs,
    handleSort
  } = useAuditLogFilters(auditLogs);
  
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    paginatedData: paginatedLogs,
    pageSize
  } = usePagination(filteredAndSortedLogs, AUDIT_LOG_PAGINATION_SIZE);

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>Audit Log</TableTitle>
        <AuditLogFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          actionFilter={actionFilter}
          setActionFilter={setActionFilter}
        />
      </TableHeader>

      {loading ? (
        <LoadingSpinner text="Loading audit logs..." />
      ) : (
        <AuditLogTableBody
          logs={paginatedLogs}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        pageSize={pageSize}
        totalItems={filteredAndSortedLogs.length}
        onPageChange={setCurrentPage}
      />
    </TableContainer>
  );
}; 