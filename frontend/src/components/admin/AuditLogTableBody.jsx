import { 
  Table, 
  TableHead, 
  TableRow, 
  TableHeaderCell, 
  TableCell, 
  EmptyState,
  SortIcon 
} from '@components/ui/Table';
import { ActionBadge } from '@components/ui/ActionBadge';
import { formatTimestamp } from '@utils/dateUtils';
import { getSortIcon } from '@utils/sortUtils';

// Reusable sortable header cell component
const SortableHeaderCell = ({ field, sortField, sortDirection, onSort, children }) => (
  <TableHeaderCell onClick={() => onSort(field)}>
    {children} <SortIcon>{getSortIcon(field, sortField, sortDirection)}</SortIcon>
  </TableHeaderCell>
);

// Table header component with all sortable columns
const AuditLogTableHeader = ({ sortField, sortDirection, onSort }) => (
  <TableHead>
    <TableRow>
      <SortableHeaderCell
        field="timestamp"
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      >
        Timestamp
      </SortableHeaderCell>
      <SortableHeaderCell
        field="user"
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      >
        User
      </SortableHeaderCell>
      <SortableHeaderCell
        field="action"
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      >
        Action
      </SortableHeaderCell>
      <SortableHeaderCell
        field="resource"
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      >
        Resource
      </SortableHeaderCell>
      <TableHeaderCell>Details</TableHeaderCell>
      <TableHeaderCell>IP Address</TableHeaderCell>
    </TableRow>
  </TableHead>
);

// Individual audit log row component
const AuditLogTableRow = ({ log }) => (
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
);

export const AuditLogTableBody = ({ 
  logs, 
  sortField, 
  sortDirection, 
  onSort 
}) => {
  if (logs.length === 0) {
    return (
      <EmptyState>
        <p>No audit logs found matching your criteria.</p>
      </EmptyState>
    );
  }

  return (
    <Table>
      <AuditLogTableHeader
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <tbody>
        {logs.map(log => (
          <AuditLogTableRow key={log.id} log={log} />
        ))}
      </tbody>
    </Table>
  );
};