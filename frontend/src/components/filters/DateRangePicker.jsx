import 'react-datepicker/dist/react-datepicker.css';
import { useDateRange } from '../../hooks/useDateRange';
import { DateInput } from './DateInput';
import { 
  FilterContainer, 
  FilterHeader, 
  FilterTitle, 
  DateInputGroup, 
  DateSeparator,
  ResetButton 
} from './DateRangePicker.styles';

export const DateRangePicker = ({ onDateChange, initialStartDate, initialEndDate }) => {
  // TODO: Consider moving date range state to Zustand store for global access
  const {
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    handleReset
  } = useDateRange(onDateChange, initialStartDate, initialEndDate);

  return (
    <FilterContainer>
      <FilterHeader>
        <FilterTitle>Date Range</FilterTitle>
        <ResetButton onClick={handleReset}>
          Reset
        </ResetButton>
      </FilterHeader>
      
      <DateInputGroup>
        <DateInput
          label="Start Date"
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          maxDate={endDate}
          placeholderText="Select start date"
        />
        
        <DateSeparator>
          <span>to</span>
        </DateSeparator>
        
        <DateInput
          label="End Date"
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          maxDate={new Date()}
          placeholderText="Select end date"
        />
      </DateInputGroup>
    </FilterContainer>
  );
}; 