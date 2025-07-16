/**
 * Common test utilities and helpers
 * Provides reusable functions for common testing patterns
 */

import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { DarkModeProvider } from '../../contexts/DarkModeContext';

/**
 * Custom render function with common providers
 * Wraps components with necessary context providers for testing
 */
export const renderWithProviders = (component, options = {}) => {
  const { initialEntries = ['/'] } = options;
  
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <DarkModeProvider>
            {children}
          </DarkModeProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  return render(component, { wrapper: Wrapper, ...options });
};

/**
 * Mock user object for testing authentication
 */
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  role: 'user',
  createdAt: new Date().toISOString(),
};

/**
 * Mock admin user object for testing admin features
 */
export const mockAdminUser = {
  ...mockUser,
  role: 'admin',
  email: 'admin@example.com',
};

/**
 * Mock forest data for testing
 */
export const mockForest = {
  _id: 'test-forest-id',
  name: 'Test Forest',
  location: 'Test Location',
  coordinates: { lat: 59.3293, lng: 18.0686 },
  area: 1000,
  createdAt: new Date().toISOString(),
};

/**
 * Mock tree data for testing
 */
export const mockTree = {
  _id: 'test-tree-id',
  species: 'Oak',
  height: 150,
  diameter: 30,
  status: 'healthy',
  plantedDate: new Date().toISOString(),
  location: { lat: 59.3293, lng: 18.0686 },
  forestId: 'test-forest-id',
  createdAt: new Date().toISOString(),
};

/**
 * Creates a mock API response
 */
export const createMockApiResponse = (data, status = 200) => ({
  data,
  status,
  message: status === 200 ? 'Success' : 'Error',
});