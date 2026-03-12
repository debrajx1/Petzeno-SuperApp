import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const loadAuthStatus = async () => {
      try {
        const status = await AsyncStorage.getItem('petzeno_auth_status');
        setIsLoggedIn(status === 'true');
      } catch (error) {
        console.error('Failed to load auth status', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthStatus();
  }, []);

  const login = async () => {
    try {
      await AsyncStorage.setItem('petzeno_auth_status', 'true');
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to save auth status', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('petzeno_auth_status');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Failed to remove auth status', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
