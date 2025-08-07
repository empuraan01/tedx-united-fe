'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  token?: string;
  nickname?: string;
  isAdmin?: boolean;
  emojis?: string[];
  year?: number;
  interests?: string[];
  bio?: string;
  hasProfilePicture?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.getAuthStatus();
      if (response.data.isAuthenticated) {
        const userResponse = await authAPI.getCurrentUser();
        setUser(userResponse.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    // Redirect to Google OAuth
    window.location.href = authAPI.getGoogleAuthUrl();
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 