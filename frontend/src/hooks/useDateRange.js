import { useState, useEffect, useRef } from 'react';

export const useDateRange = (onDateChange, initialStartDate, initialEndDate) => {
  const [startDate, setStartDate] = useState(
    initialStartDate || new Date(new Date().getFullYear(), 0, 1)
  );
  const [endDate, setEndDate] = useState(initialEndDate || new Date());
  const onDateChangeRef = useRef(onDateChange);
  const hasMounted = useRef(false);

  // Keep the ref up to date
  useEffect(() => {
    onDateChangeRef.current = onDateChange;
  }, [onDateChange]);

  // Debounced update effect - prevent initial call
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
  }, [startDate, endDate]);

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

  return {
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    handleReset,
  };
};