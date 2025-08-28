import { DateInputWrapper, DateLabel, StyledDatePicker } from './DateRangePicker.styles';

export const DateInput = ({ 
  label, 
  selected, 
  onChange, 
  selectsStart, 
  selectsEnd, 
  startDate, 
  endDate, 
  minDate, 
  maxDate, 
  placeholderText 
}) => {
  const inputId = `date-input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <DateInputWrapper>
      <DateLabel htmlFor={inputId}>{label}</DateLabel>
      <StyledDatePicker
        id={inputId}
        selected={selected}
        onChange={onChange}
        selectsStart={selectsStart}
        selectsEnd={selectsEnd}
        startDate={startDate}
        endDate={endDate}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat="MMM dd, yyyy"
        placeholderText={placeholderText}
        aria-label={label}
      />
    </DateInputWrapper>
  );
};