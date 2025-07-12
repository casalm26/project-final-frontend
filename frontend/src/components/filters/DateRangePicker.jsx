import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';

const FilterContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FilterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const DateInputGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const DateInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 150px;
`;

const DateLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &:hover {
    border-color: #9ca3af;
  }
`;

const ResetButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

export const DateRangePicker = ({ onDateChange, initialStartDate, initialEndDate }) => {
  const [startDate, setStartDate] = useState(initialStartDate || new Date(new Date().getFullYear(), 0, 1)); // Start of current year
  const [endDate, setEndDate] = useState(initialEndDate || new Date()); // Today
  const [isUpdating, setIsUpdating] = useState(false);
  const onDateChangeRef = useRef(onDateChange);
  const hasMounted = useRef(false);

  // Keep the ref up to date
  useEffect(() => {
    onDateChangeRef.current = onDateChange;
  }, [onDateChange]);

  // Debounced update effect - FIXED: removed onDateChange from dependencies and prevent initial call
  useEffect(() => {
    // Don't call callback on initial mount
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const timer = setTimeout(() => {
      if (onDateChangeRef.current && startDate && endDate) {
        onDateChangeRef.current({ startDate, endDate });
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [startDate, endDate]); // Only depend on the date values, not the callback function

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (date && startDate && date < startDate) {
      setStartDate(date);
    }
  };

  const handleReset = () => {
    const defaultStartDate = new Date(new Date().getFullYear(), 0, 1);
    const defaultEndDate = new Date();
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    if (onDateChangeRef.current) {
      onDateChangeRef.current({ startDate: defaultStartDate, endDate: defaultEndDate });
    }
  };

  return (
    <FilterContainer>
      <FilterHeader>
        <FilterTitle>Date Range</FilterTitle>
        <ResetButton onClick={handleReset}>
          Reset
        </ResetButton>
      </FilterHeader>
      
      <DateInputGroup>
        <DateInputWrapper>
          <DateLabel>Start Date</DateLabel>
          <StyledDatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={endDate}
            dateFormat="MMM dd, yyyy"
            placeholderText="Select start date"
          />
        </DateInputWrapper>
        
        <div className="flex items-center text-gray-500">
          <span>to</span>
        </div>
        
        <DateInputWrapper>
          <DateLabel>End Date</DateLabel>
          <StyledDatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={new Date()}
            dateFormat="MMM dd, yyyy"
            placeholderText="Select end date"
          />
        </DateInputWrapper>
      </DateInputGroup>
    </FilterContainer>
  );
}; 