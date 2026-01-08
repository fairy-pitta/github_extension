import './github-content.css';

let dashboardEnabled = false;
let dashboardContainer: HTMLElement | null = null;

async function checkDashboardEnabled(): Promise<boolean> {
  try {
    const result = await chrome.storage.local.get(['show_on_github']);
    return result.show_on_github !== false; // Default to true
  } catch {
    return true;
  }
}

function waitForBody(): Promise<HTMLElement> {
  return new Promise((resolve) => {
    if (document.body) {
      resolve(document.body);
    } else {
      const observer = new MutationObserver(() => {
        if (document.body) {
          observer.disconnect();
          resolve(document.body);
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  });
}

function isGitHubTopPage(): boolean {
  const url = window.location.href;
  // Only apply to https://github.com or https://github.com/
  return url === 'https://github.com' || url === 'https://github.com/';
}

let originalBodyHTML: string | null = null;

function createEnableButton() {
  // Remove existing button if any
  const existingButton = document.getElementById('github-dashboard-enable-button');
  if (existingButton) {
    existingButton.remove();
  }

  const button = document.createElement('button');
  button.id = 'github-dashboard-enable-button';
  button.innerHTML = '📊';
  button.title = 'Enable GitHub Dashboard';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4A90E2 0%, #50C878 100%);
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    font-size: 20px;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = '0 6px 16px rgba(74, 144, 226, 0.6)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.4)';
  });

  button.addEventListener('click', async () => {
    try {
      await chrome.storage.local.set({ show_on_github: true });
      // The storage change listener will handle enabling the dashboard
    } catch (error) {
      console.error('Failed to enable dashboard:', error);
    }
  });

  document.body.appendChild(button);
}

async function initDashboard() {
  // Only apply to GitHub top page
  if (!isGitHubTopPage()) {
    return;
  }

  dashboardEnabled = await checkDashboardEnabled();
  
  if (!dashboardEnabled) {
    // Show enable button when dashboard is disabled
    await waitForBody();
    createEnableButton();
    return;
  }

  // Remove enable button if it exists
  const enableButton = document.getElementById('github-dashboard-enable-button');
  if (enableButton) {
    enableButton.remove();
  }

  // Wait for body to be available
  const body = await waitForBody();

  // Save original body content before replacing
  if (!originalBodyHTML) {
    originalBodyHTML = body.innerHTML;
  }

  // Create iframe for dashboard (isolated world with Chrome API access)
  const iframe = document.createElement('iframe');
  iframe.id = 'github-dashboard-iframe';
  iframe.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    z-index: 9999;
    background: #fff;
  `;
  iframe.src = chrome.runtime.getURL('newtab.html');

  // Replace body content
  body.innerHTML = '';
  body.appendChild(iframe);
  dashboardContainer = body;
}

function revertToOriginal() {
  // Remove iframe and restore original GitHub content
  const iframe = document.getElementById('github-dashboard-iframe');
  if (iframe) {
    iframe.remove();
  }
  
  const body = document.body;
  if (body && originalBodyHTML) {
    body.innerHTML = originalBodyHTML;
    dashboardContainer = null;
    // Show enable button after reverting
    createEnableButton();
  } else {
    // Fallback: reload the page
    window.location.reload();
  }
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.show_on_github) {
    const newValue = changes.show_on_github.newValue;
    if (newValue === false && dashboardContainer) {
      revertToOriginal();
    } else if (newValue === true && !dashboardContainer) {
      initDashboard();
    }
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }
