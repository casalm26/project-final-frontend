export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
};

export const AUDIT_ACTION_OPTIONS = [
  { value: '', label: 'All Actions' },
  { value: AUDIT_ACTIONS.CREATE, label: 'Create' },
  { value: AUDIT_ACTIONS.UPDATE, label: 'Update' },
  { value: AUDIT_ACTIONS.DELETE, label: 'Delete' },
  { value: AUDIT_ACTIONS.LOGIN, label: 'Login' },
  { value: AUDIT_ACTIONS.LOGOUT, label: 'Logout' }
];

export const AUDIT_LOG_PAGINATION_SIZE = 10;