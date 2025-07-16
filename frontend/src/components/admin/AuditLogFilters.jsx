import { FilterSection, SearchInput, FilterSelect } from '@components/ui/FormElements';
import { AUDIT_ACTION_OPTIONS } from '@constants/auditLogConstants';

export const AuditLogFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  actionFilter, 
  setActionFilter 
}) => {
  return (
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
        {AUDIT_ACTION_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </FilterSelect>
    </FilterSection>
  );
};