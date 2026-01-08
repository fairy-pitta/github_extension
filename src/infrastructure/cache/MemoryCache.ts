import { ICache } from './ICache';
import { IStorage } from '../storage/IStorage';
import { StorageKeys } from '../storage/StorageKeys';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * Memory-based cache with TTL support
 * Persists cache metadata to storage
 */
export class MemoryCache implements ICache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  constructor(private readonly storage: IStorage) {}

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      await this.remove(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });

    // Persist cache metadata to storage
    const storageKey = `${StorageKeys.CACHE_PREFIX}${key}`;
    await this.storage.set(storageKey, {
      expiresAt,
      cached: true,
    });
  }

  async remove(key: string): Promise<void> {
    this.cache.delete(key);
    const storageKey = `${StorageKeys.CACHE_PREFIX}${key}`;
    await this.storage.remove(storageKey);
  }

  async clear(): Promise<void> {
    this.cache.clear();
    // Note: We don't clear all storage, only cache-related keys
    // This would require iterating through all keys, which is expensive
  }

  /**
   * Check if a key exists and is not expired
   */
  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      await this.remove(key);
      return false;
    }
    return true;
  }
}


