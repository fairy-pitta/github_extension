import { useState, useEffect, useCallback } from 'react';
import { useServices } from '../../context/ServiceContext';
import { StorageKeys } from '@/application/config/StorageKeys';

/**
 * Hook for managing favorite repositories
 */
export function useFavoriteRepositories() {
  const services = useServices();
  const [favoriteRepositories, setFavoriteRepositories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from storage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storage = services.getStorage();
        const favorites = await storage.get<string[]>(StorageKeys.FAVORITE_REPOSITORIES);
        setFavoriteRepositories(favorites || []);
      } catch (error) {
        console.error('Failed to load favorite repositories:', error);
        setFavoriteRepositories([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();

    // Listen for storage changes
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (
        areaName === 'local' &&
        changes[StorageKeys.FAVORITE_REPOSITORIES]
      ) {
        const newValue = changes[StorageKeys.FAVORITE_REPOSITORIES].newValue;
        setFavoriteRepositories(newValue || []);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [services]);

  const addFavorite = useCallback(
    async (nameWithOwner: string) => {
      try {
        const storage = services.getStorage();
        const current = favoriteRepositories;
        if (!current.includes(nameWithOwner)) {
          const updated = [...current, nameWithOwner];
          await storage.set(StorageKeys.FAVORITE_REPOSITORIES, updated);
          setFavoriteRepositories(updated);
        }
      } catch (error) {
        console.error('Failed to add favorite repository:', error);
      }
    },
    [services, favoriteRepositories]
  );

  const removeFavorite = useCallback(
    async (nameWithOwner: string) => {
      try {
        const storage = services.getStorage();
        const updated = favoriteRepositories.filter((name) => name !== nameWithOwner);
        await storage.set(StorageKeys.FAVORITE_REPOSITORIES, updated);
        setFavoriteRepositories(updated);
      } catch (error) {
        console.error('Failed to remove favorite repository:', error);
      }
    },
    [services, favoriteRepositories]
  );

  const toggleFavorite = useCallback(
    async (nameWithOwner: string) => {
      if (favoriteRepositories.includes(nameWithOwner)) {
        await removeFavorite(nameWithOwner);
      } else {
        await addFavorite(nameWithOwner);
      }
    },
    [favoriteRepositories, addFavorite, removeFavorite]
  );

  const isFavorite = useCallback(
    (nameWithOwner: string) => {
      return favoriteRepositories.includes(nameWithOwner);
    },
    [favoriteRepositories]
  );

  return {
    favoriteRepositories,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}

