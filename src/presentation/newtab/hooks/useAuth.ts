import { useState, useEffect } from 'react';
import { User } from '@/domain/entities/User';
import { Container } from '@/application/di/Container';
import { StorageKeys } from '@/infrastructure/storage/StorageKeys';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

/**
 * Hook for authentication state management
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const container = Container.getInstance();
        const storage = container.getStorage();
        const token = await storage.get<string>(StorageKeys.PAT_TOKEN);

        if (!token) {
          setState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
          return;
        }

        // Try to initialize container and validate token
        try {
          await container.initialize(token);
          const authService = container.getAuthService();
          const user = await authService.validateCurrentToken();

          setState({
            isAuthenticated: !!user,
            user: user ?? null,
            loading: false,
          });
        } catch (error) {
          console.error('Auth validation error:', error);
          setState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    checkAuth();

    // Listen for storage changes
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === 'local' && changes[StorageKeys.PAT_TOKEN]) {
        console.log('Token changed, rechecking auth...');
        checkAuth();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return state;
}

