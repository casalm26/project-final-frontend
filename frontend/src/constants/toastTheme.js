export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const TOAST_COLORS = {
  [TOAST_TYPES.SUCCESS]: '#28a745',
  [TOAST_TYPES.ERROR]: '#dc3545',
  [TOAST_TYPES.WARNING]: '#ffc107',
  [TOAST_TYPES.INFO]: '#17a2b8'
};

export const TOAST_TITLES = {
  [TOAST_TYPES.SUCCESS]: 'Success',
  [TOAST_TYPES.ERROR]: 'Error',
  [TOAST_TYPES.WARNING]: 'Warning',
  [TOAST_TYPES.INFO]: 'Info'
};

export const getToastColor = (type) => {
  return TOAST_COLORS[type] || TOAST_COLORS[TOAST_TYPES.INFO];
};

export const getToastTitle = (type) => {
  return TOAST_TITLES[type] || 'Notification';
};