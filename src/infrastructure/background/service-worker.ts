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

  // Initialize container if token exists
  try {
    const container = Container.getInstance();
    const storage = container.getStorage();
    const token = await storage.get<string>(StorageKeys.PAT_TOKEN);
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

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes[StorageKeys.PAT_TOKEN]) {
    const newToken = changes[StorageKeys.PAT_TOKEN].newValue as string | undefined;
    if (newToken) {
      Container.getInstance()
        .initialize(newToken)
        .catch((error) => {
          console.error('Failed to reinitialize container:', error);
        });
    }
  }
});
