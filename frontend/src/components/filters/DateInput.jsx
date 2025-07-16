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
  return (
    <DateInputWrapper>
      <DateLabel>{label}</DateLabel>
      <StyledDatePicker
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
      />
    </DateInputWrapper>
  );
};