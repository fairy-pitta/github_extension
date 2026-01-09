import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryCache } from '../MemoryCache';
import { IStorage } from '@/domain/interfaces/IStorage';

describe('MemoryCache', () => {
  let mockStorage: IStorage;
  let cache: MemoryCache;

  beforeEach(() => {
    mockStorage = {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
    };
    cache = new MemoryCache(mockStorage);
  });

  it('should get a cached value', async () => {
    await cache.set('test-key', { foo: 'bar' }, 1000);

    const result = await cache.get<{ foo: string }>('test-key');

    expect(result).toEqual({ foo: 'bar' });
  });

  it('should return null for expired cache', async () => {
    await cache.set('test-key', { foo: 'bar' }, -1000); // Already expired

    const result = await cache.get('test-key');

    expect(result).toBeNull();
  });

  it('should return null for non-existent key', async () => {
    const result = await cache.get('non-existent');

    expect(result).toBeNull();
  });

  it('should remove a cached value', async () => {
    await cache.set('test-key', { foo: 'bar' }, 1000);

    await cache.remove('test-key');

    const result = await cache.get('test-key');
    expect(result).toBeNull();
    expect(mockStorage.remove).toHaveBeenCalled();
  });

  it('should check if key exists', async () => {
    await cache.set('test-key', { foo: 'bar' }, 1000);

    const exists = await cache.has('test-key');

    expect(exists).toBe(true);
  });

  it('should return false for expired key', async () => {
    await cache.set('test-key', { foo: 'bar' }, -1000);

    const exists = await cache.has('test-key');

    expect(exists).toBe(false);
  });
});


