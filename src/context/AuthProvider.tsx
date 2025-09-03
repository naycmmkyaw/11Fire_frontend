import React, { useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types';
import Axios from '../services/axiosInstance';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuthStatus = async () => {
      try {
        const response = await Axios.get('/auth/me');
        if (response.data?.user) {
          const backendUser = response.data.user;
          
          // Map backend Auth model to frontend User type
          const mappedUser: User = {
            id: String(backendUser._id),                    // MongoDB ObjectId as string
            email: backendUser.email,                       // Direct mapping
            name: backendUser.username,                     // Backend uses 'username'
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(backendUser.username || backendUser.email)}&background=1976d2&color=fff`,
          };

          setUser(mappedUser);
          // localStorage.setItem('11fire_user', JSON.stringify(mappedUser));
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
        // localStorage.removeItem('11fire_user');
        // localStorage.removeItem('11fire_groups');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // localStorage.setItem('11fire_user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear session
      await Axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // localStorage.removeItem('11fire_user');
      // localStorage.removeItem('11fire_groups');
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};