// Service Worker for Chrome Extension
import { StorageKeys } from '../storage/StorageKeys';
import { Container } from '@/application/di/Container';

// Initialize on installation
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Open new tab page on first install to show onboarding
    chrome.tabs.create({
      url: chrome.runtime.getURL('newtab.html'),
    });
  }

  // Initialize container if token exists (GITHUB_TOKEN takes priority, falls back to PAT_TOKEN)
  try {
    const container = Container.getInstance();
    const storage = container.getStorage();
    
    // Check GITHUB_TOKEN first, then fall back to PAT_TOKEN
    let token = await storage.get<string>(StorageKeys.GITHUB_TOKEN);
    if (!token) {
      token = await storage.get<string>(StorageKeys.PAT_TOKEN);
    }
    
    if (token) {
      await container.initialize(token);
    }
  } catch (error) {
    console.error('Failed to initialize container:', error);
  }
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle token update
  if (message.type === 'TOKEN_UPDATED') {
    Container.getInstance()
      .initialize(message.token)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep channel open for async response
  }

  // Handle cache clear request
  if (message.type === 'CLEAR_CACHE') {
    Container.getInstance()
      .getCache()
      .clear()
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  return false;
});

// Listen for storage changes (both GITHUB_TOKEN and PAT_TOKEN)
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    const githubTokenChange = changes[StorageKeys.GITHUB_TOKEN];
    const patTokenChange = changes[StorageKeys.PAT_TOKEN];

    // Get the new token (GITHUB_TOKEN takes priority)
    const newToken =
      (githubTokenChange?.newValue as string | undefined) ||
      (patTokenChange?.newValue as string | undefined);

    if (newToken) {
      Container.getInstance()
        .initialize(newToken)
        .catch((error) => {
          console.error('Failed to reinitialize container:', error);
        });
    } else if (githubTokenChange?.newValue === undefined || patTokenChange?.newValue === undefined) {
      // Token was removed, try to get remaining token or clear container
      const container = Container.getInstance();
      const storage = container.getStorage();
      storage
        .get<string>(StorageKeys.GITHUB_TOKEN)
        .then((token) => {
          if (token) {
            return container.initialize(token);
          }
          return storage.get<string>(StorageKeys.PAT_TOKEN).then((patToken) => {
            if (patToken) {
              return container.initialize(patToken);
            }
            // Both tokens removed, container will need to be reinitialized when a new token is set
          });
        })
        .catch((error) => {
          console.error('Failed to reinitialize container after token removal:', error);
        });
    }
  }
});
