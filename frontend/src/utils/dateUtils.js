const isValidDate = (date) => {
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
};

const safeCreateDate = (date) => {
  if (!date) return null;
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const formatTimestamp = (timestamp) => {
  const date = safeCreateDate(timestamp);
  return date ? date.toLocaleString() : 'Invalid date';
};

export const formatDate = (date) => {
  const parsed = safeCreateDate(date);
  return parsed ? parsed.toLocaleDateString() : 'Invalid date';
};

export const formatTime = (date) => {
  const parsed = safeCreateDate(date);
  return parsed ? parsed.toLocaleTimeString() : 'Invalid time';
};

export const formatDateRange = (startDate, endDate) => {
  const start = safeCreateDate(startDate);
  const end = safeCreateDate(endDate);
  
  if (!start || !end) return 'Invalid date range';
  
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
};

export const formatDateForInput = (date) => {
  const parsed = safeCreateDate(date);
  return parsed ? parsed.toISOString().split('T')[0] : '';
};

export const formatDateTimeForAPI = (date) => {
  const parsed = safeCreateDate(date);
  return parsed ? parsed.toISOString() : null;
};

export const getDefaultDateRange = () => {
  const startDate = new Date(new Date().getFullYear(), 0, 1);
  const endDate = new Date();
  return { startDate, endDate };
};

export const isValidDateRange = (startDate, endDate) => {
  const start = safeCreateDate(startDate);
  const end = safeCreateDate(endDate);
  return start && end && start <= end;
};