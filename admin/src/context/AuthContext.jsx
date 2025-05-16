import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../config';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('adminToken');
    return savedToken || null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
      verifyAdminToken();
    } else {
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [token]);

  const verifyAdminToken = async () => {
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/admin/verify-token`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setIsAuthenticated(true);
      } else {
        setToken(null);
        setIsAuthenticated(false);
        toast.error('Session expired. Please login again.');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setToken(null);
      setIsAuthenticated(false);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
  };

  const value = {
    token,
    setToken,
    isAuthenticated,
    loading,
    verifyAdminToken,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 