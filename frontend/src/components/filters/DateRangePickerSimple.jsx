import { useState } from 'react';

export const DateRangePicker = ({ startDate, endDate, onChange, error }) => {
  const [localStartDate, setLocalStartDate] = useState(
    startDate ? startDate.toISOString().split('T')[0] : ''
  );
  const [localEndDate, setLocalEndDate] = useState(
    endDate ? endDate.toISOString().split('T')[0] : ''
  );

  const handleStartChange = (e) => {
    const value = e.target.value;
    setLocalStartDate(value);
    const newStartDate = value ? new Date(value) : null;
    onChange({ start: newStartDate, end: endDate });
  };

  const handleEndChange = (e) => {
    const value = e.target.value;
    setLocalEndDate(value);
    const newEndDate = value ? new Date(value) : null;
    onChange({ start: startDate, end: newEndDate });
  };

  const handleReset = () => {
    setLocalStartDate('');
    setLocalEndDate('');
    onChange({ start: null, end: null });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={localStartDate}
            onChange={handleStartChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={localEndDate}
            onChange={handleEndChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>
      </div>
      
      {(localStartDate || localEndDate) && (
        <button
          onClick={handleReset}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          Reset Dates
        </button>
      )}
      
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};