import { IStorage } from '@/domain/interfaces/IStorage';

/**
 * Chrome Storage implementation using chrome.storage.local
 */
export class ChromeStorage implements IStorage {
  async get<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) {
          const errorMessage = chrome.runtime.lastError.message;
          if (errorMessage?.includes('Extension context invalidated')) {
            reject(
              new Error(
                'Extension context invalidated. Please reload the extension and try again.'
              )
            );
            return;
          }
          reject(new Error(errorMessage));
          return;
        }
        const value = result[key];
        resolve(value !== undefined ? (value as T) : null);
      });
    });
  }

  async set<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          const errorMessage = chrome.runtime.lastError.message;
          if (errorMessage?.includes('Extension context invalidated')) {
            reject(
              new Error(
                'Extension context invalidated. Please reload the extension and try again.'
              )
            );
            return;
          }
          reject(new Error(errorMessage));
          return;
        }
        resolve();
      });
    });
  }

  async remove(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove([key], () => {
        if (chrome.runtime.lastError) {
          const errorMessage = chrome.runtime.lastError.message;
          if (errorMessage?.includes('Extension context invalidated')) {
            reject(
              new Error(
                'Extension context invalidated. Please reload the extension and try again.'
              )
            );
            return;
          }
          reject(new Error(errorMessage));
          return;
        }
        resolve();
      });
    });
  }

  async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
          const errorMessage = chrome.runtime.lastError.message;
          if (errorMessage?.includes('Extension context invalidated')) {
            reject(
              new Error(
                'Extension context invalidated. Please reload the extension and try again.'
              )
            );
            return;
          }
          reject(new Error(errorMessage));
          return;
        }
        resolve();
      });
    });
  }
}



