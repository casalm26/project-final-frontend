export const TREE_HEALTH_COLORS = {
  healthy: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444'
};

export const TREE_HEALTH_STYLES = {
  healthy: 'background: #d1fae5; color: #065f46;',
  warning: 'background: #fef3c7; color: #92400e;',
  critical: 'background: #fee2e2; color: #991b1b;'
};

export const CLUSTER_SIZES = {
  small: {
    dimension: '30px',
    fontSize: '12px',
    threshold: 0
  },
  medium: {
    dimension: '40px', 
    fontSize: '14px',
    threshold: 10
  },
  large: {
    dimension: '50px',
    fontSize: '16px', 
    threshold: 50
  }
};

export const TREE_ICON_CONFIG = {
  size: 20,
  emoji: '🌳',
  className: 'custom-tree-marker'
};

export const CLUSTER_ICON_CONFIG = {
  backgroundColor: '#10b981',
  className: 'custom-cluster-icon',
  iconSize: [30, 30]
};