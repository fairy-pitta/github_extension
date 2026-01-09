import { useState, useEffect } from 'react';
import { User } from '@/domain/entities/User';
import { useServices } from '../../context/ServiceContext';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

/**
 * Hook for authentication state management
 */
export function useAuth(): AuthState {
  const services = useServices();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storage = services.getStorage();

        // Try to get token (GITHUB_TOKEN takes priority, falls back to PAT_TOKEN)
        // First check if we can use AuthService (if container is initialized)
        let token: string | null = null;
        try {
          const authService = services.getAuthService();
          token = await authService.getToken();
        } catch {
          // Container not initialized yet, check storage directly
          // Check GITHUB_TOKEN first, then fall back to PAT_TOKEN
          token = await storage.get<string>('github_token');
          if (!token) {
            token = await storage.get<string>('pat_token');
          }
        }

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
          await services.initialize(token);
          const authService = services.getAuthService();
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

    // Listen for storage changes (both GITHUB_TOKEN and PAT_TOKEN)
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (
        areaName === 'local' &&
        (changes['github_token'] || changes['pat_token'])
      ) {
        checkAuth();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [services]);

  return state;
}

