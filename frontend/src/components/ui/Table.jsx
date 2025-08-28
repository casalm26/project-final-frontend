import styled from 'styled-components';

// Base theme colors - supports both light and dark modes
const getThemeColors = () => {
  const isDark = typeof document !== 'undefined' && document.documentElement?.classList.contains('dark');
  
  return {
    // Container colors
    containerBg: isDark ? '#1f2937' : '#ffffff',
    containerBorder: isDark ? '#374151' : '#e5e7eb',
    containerShadow: isDark 
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)' 
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    
    // Header colors
    headerBg: isDark ? '#374151' : '#f9fafb',
    headerBorder: isDark ? '#4b5563' : '#e5e7eb',
    headerText: isDark ? '#f9fafb' : '#111827',
    
    // Cell colors
    cellText: isDark ? '#e5e7eb' : '#111827',
    cellBorder: isDark ? '#4b5563' : '#f3f4f6',
    cellHover: isDark ? '#374151' : '#f9fafb',
    cellHeaderText: isDark ? '#d1d5db' : '#374151',
    cellHeaderHover: isDark ? '#4b5563' : '#f3f4f6',
    
    // Accent colors
    mutedText: isDark ? '#9ca3af' : '#6b7280',
    sortIcon: isDark ? '#6b7280' : '#9ca3af'
  };
};

// Container Components
export const TableContainer = styled.div`
  background: ${() => getThemeColors().containerBg};
  border-radius: 0.75rem;
  box-shadow: ${() => getThemeColors().containerShadow};
  border: 1px solid ${() => getThemeColors().containerBorder};
  overflow: hidden;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

export const TableHeader = styled.div`
  background: ${() => getThemeColors().headerBg};
  padding: 1.5rem;
  border-bottom: 1px solid ${() => getThemeColors().headerBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

export const TableTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${() => getThemeColors().headerText};
  margin: 0;
  transition: color 0.2s ease;
`;

// Table Structure Components
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: ${() => getThemeColors().headerBg};
  border-bottom: 1px solid ${() => getThemeColors().headerBorder};
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${() => getThemeColors().cellBorder};
  transition: background-color 0.2s ease, border-color 0.2s ease;
  
  &:hover {
    background: ${() => getThemeColors().cellHover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

// Cell Components
export const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${() => getThemeColors().cellHeaderText};
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background: ${() => getThemeColors().cellHeaderHover};
  }
`;

export const TableCell = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${() => getThemeColors().cellText};
  vertical-align: top;
  transition: color 0.2s ease;
`;

// Utility Components
export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${() => getThemeColors().mutedText};
  transition: color 0.2s ease;
`;

export const SortIcon = styled.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: ${() => getThemeColors().sortIcon};
  transition: color 0.2s ease;
`;

// Reusable Wrapper Components
export const SortableHeaderCell = ({ field, sortField, sortDirection, onSort, children, getSortIcon }) => (
  <TableHeaderCell onClick={() => onSort(field)}>
    {children} <SortIcon>{getSortIcon?.(field, sortField, sortDirection)}</SortIcon>
  </TableHeaderCell>
);

// TODO: Consider moving table state to Zustand store for better state management
// Common pattern: sortField, sortDirection, and onSort are passed to multiple components