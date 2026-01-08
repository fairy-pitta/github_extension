/**
 * Cache interface
 */
export interface ICache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl: number): Promise<void>;
  clear(): Promise<void>;
  remove(key: string): Promise<void>;
}

