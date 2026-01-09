/**
 * Storage interface for abstraction
 * Moved from Infrastructure Layer to Domain Layer to follow Clean Architecture principles
 */
export interface IStorage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

