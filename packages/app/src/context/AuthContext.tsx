import { LoadingState } from '../components/ui/states/LoadingState';
import { useAuthQuery } from '../hooks/useAuthQuery';
import type { AuthState } from '../lib/states/AuthState';
import type { UserPublic } from '@dev-dashboard/shared';
import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useAuthQuery();

  useEffect(() => {
    if (data) {
      setUser(data);
      setIsAuthenticated(true);
    } else if (error) {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [data, error]);

  const refreshAuth = () => {
    queryClient.invalidateQueries({ queryKey: ['auth'] });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
