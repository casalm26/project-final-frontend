import { useKeepAlive } from '../hooks/useKeepAlive';

// This component initializes the keep-alive service
export const KeepAliveProvider = ({ children }) => {
  useKeepAlive(); // Initialize the keep-alive hook
  
  return children;
};

export default KeepAliveProvider;