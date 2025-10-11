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
          const activeSwarmId: string | null = backendUser.activeSwarm || null;
          const memberships: Array<{ swarm: string; role?: string }> = backendUser.memberships ?? [];
          const activeMembership = activeSwarmId
            ? memberships.find((m) => m.swarm === activeSwarmId)
            : undefined;
          
          // Map backend Auth model to frontend User type
          const mappedUser: User = {
            id: String(backendUser._id),
            email: backendUser.email,
            name: backendUser.username,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(backendUser.username || backendUser.email)}&background=ef4444&color=fff`,
            activeGroup: activeSwarmId,
            role: activeMembership?.role ?? 'user',
            isFirstLogin: memberships.length === 0,
          };

          setUser(mappedUser);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await Axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.clear();
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