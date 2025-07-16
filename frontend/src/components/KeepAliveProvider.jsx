// import { useKeepAlive } from '../hooks/useKeepAlive';

// This component just initializes the keep-alive service
export const KeepAliveProvider = ({ children }) => {
  // useKeepAlive(); // Initialize the keep-alive hook - TEMPORARILY DISABLED FOR DEBUGGING
  
  return children;
};

export default KeepAliveProvider;