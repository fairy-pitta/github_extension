import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChromeStorage } from '../ChromeStorage';

// Mock chrome.storage
const mockStorage: Record<string, unknown> = {};

const mockChromeStorage = {
  local: {
    get: vi.fn((keys: string[], callback: (result: Record<string, unknown>) => void) => {
      const result: Record<string, unknown> = {};
      keys.forEach((key) => {
        result[key] = mockStorage[key] ?? undefined;
      });
      callback(result);
    }),
    set: vi.fn((items: Record<string, unknown>, callback: () => void) => {
      Object.assign(mockStorage, items);
      callback();
    }),
    remove: vi.fn((keys: string[], callback: () => void) => {
      keys.forEach((key) => {
        delete mockStorage[key];
      });
      callback();
    }),
    clear: vi.fn((callback: () => void) => {
      Object.keys(mockStorage).forEach((key) => {
        delete mockStorage[key];
      });
      callback();
    }),
  },
};

// @ts-expect-error - Mock chrome global
global.chrome = {
  storage: mockChromeStorage,
  runtime: {
    lastError: null,
  },
};

describe('ChromeStorage', () => {
  let storage: ChromeStorage;

  beforeEach(() => {
    storage = new ChromeStorage();
    Object.keys(mockStorage).forEach((key) => {
      delete mockStorage[key];
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should get a value from storage', async () => {
    mockStorage['test-key'] = { foo: 'bar' };

    const result = await storage.get<{ foo: string }>('test-key');

    expect(result).toEqual({ foo: 'bar' });
    expect(mockChromeStorage.local.get).toHaveBeenCalledWith(
      ['test-key'],
      expect.any(Function)
    );
  });

  it('should return null for non-existent key', async () => {
    const result = await storage.get('non-existent');

    expect(result).toBeNull();
  });

  it('should set a value in storage', async () => {
    await storage.set('test-key', { foo: 'bar' });

    expect(mockChromeStorage.local.set).toHaveBeenCalledWith(
      { 'test-key': { foo: 'bar' } },
      expect.any(Function)
    );
    expect(mockStorage['test-key']).toEqual({ foo: 'bar' });
  });

  it('should remove a key from storage', async () => {
    mockStorage['test-key'] = { foo: 'bar' };

    await storage.remove('test-key');

    expect(mockChromeStorage.local.remove).toHaveBeenCalledWith(
      ['test-key'],
      expect.any(Function)
    );
    expect(mockStorage['test-key']).toBeUndefined();
  });

  it('should clear all storage', async () => {
    mockStorage['key1'] = 'value1';
    mockStorage['key2'] = 'value2';

    await storage.clear();

    expect(mockChromeStorage.local.clear).toHaveBeenCalled();
  });
});



