import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // For now, simulate API call
      const response = await simulateLoginAPI(email, password);
      
      const { token, user: userData } = response;
      
      // Store token and user data securely
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      navigate('/dashboard');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, confirmPassword) => {
    try {
      setLoading(true);
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // TODO: Replace with actual API call when backend is ready
      const response = await simulateRegisterAPI(email, password);
      
      const { token, user: userData } = response;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      navigate('/dashboard');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    navigate('/');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Temporary mock API functions - replace with real API calls when backend is ready
const simulateLoginAPI = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Basic validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  if (email === 'admin@nanwa.com' && password === 'admin123') {
    return {
      token: 'mock-jwt-token-admin',
      user: {
        id: 1,
        email: 'admin@nanwa.com',
        role: 'admin',
        name: 'Admin User'
      }
    };
  }
  
  if (email === 'user@nanwa.com' && password === 'user123') {
    return {
      token: 'mock-jwt-token-user',
      user: {
        id: 2,
        email: 'user@nanwa.com',
        role: 'user',
        name: 'Regular User'
      }
    };
  }
  
  throw new Error('Invalid email or password');
};

const simulateRegisterAPI = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Basic validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  
  // Simulate successful registration
  return {
    token: 'mock-jwt-token-new-user',
    user: {
      id: Math.floor(Math.random() * 1000),
      email,
      role: 'user',
      name: email.split('@')[0]
    }
  };
}; 