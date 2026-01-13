# Permissions Justification for Chrome Web Store

This document explains why each permission is required for the GitHub Dashboard extension to function properly.

## Required Permissions

### 1. `storage`

Purpose: Store user authentication tokens, preferences, and cached data locally.

Usage:
- Store GitHub OAuth access tokens or Personal Access Tokens securely
- Save user preferences (theme, language, favorite repositories, dashboard layout)
- Cache API responses locally to reduce API calls and improve performance

Justification: The extension needs to persist authentication credentials and user preferences across browser sessions. All data is stored locally using `chrome.storage.local` and never transmitted to external servers except GitHub's official API.

Privacy: All data remains on the user's device and is never shared with third parties.

---

### 2. `tabs`

Purpose: Detect when users navigate to GitHub.com to automatically inject the dashboard.

Usage:
- Monitor tab updates to detect when users visit GitHub.com
- Inject the dashboard content script when GitHub.com pages load
- Open OAuth verification pages

Justification: The extension's primary feature is to display a unified dashboard directly on GitHub.com. This permission allows the extension to detect GitHub.com visits and automatically inject the dashboard interface.

Privacy: The extension only accesses tabs matching `https://github.com/*` and does not read or modify content from other websites.

---

### 3. `identity`

Purpose: Launch OAuth authentication flow to securely authenticate users with GitHub.

Usage:
- Launch secure OAuth web authentication flow using `chrome.identity.launchWebAuthFlow()`
- Open GitHub OAuth authorization pages in a secure browser context
- Handle OAuth redirects securely

Justification: The extension requires secure OAuth authentication to access GitHub's API. The `identity` permission enables Chrome's secure OAuth flow, which provides a secure, isolated authentication context and prevents credential exposure.

Privacy: The extension only uses this permission to launch GitHub's official OAuth authentication flow. Authentication tokens are stored locally using `chrome.storage.local`. Users can revoke access at any time through GitHub settings.

---

## Host Permissions

### `https://api.github.com/*`

Purpose: Access GitHub's official REST and GraphQL APIs to fetch user data.

Usage:
- Fetch user profile information
- Retrieve pull requests, issues, and repositories
- Get contribution calendar data and activity statistics

Justification: This is the core functionality of the extension. The extension needs to communicate with GitHub's official API to display the user's GitHub activity in a unified dashboard. All API requests are authenticated using the user's own GitHub access token, read-only, and direct communication with GitHub's official API.

Privacy: Only the user's own GitHub data is accessed, using their own authentication credentials. No data is shared with third parties.

---

### `https://github.com/*`

Purpose: Inject the dashboard interface into GitHub.com pages.

Usage:
- Inject content scripts to display the dashboard on GitHub.com
- Load dashboard assets (CSS, JavaScript) on GitHub.com pages

Justification: The extension's primary feature is to display a unified dashboard directly on GitHub.com. This host permission allows content scripts to run on GitHub.com pages and load dashboard assets.

Privacy: The extension only modifies the display of GitHub.com pages to show the dashboard. It does not collect or transmit page content, modify GitHub's functionality, or access data from other websites.

---

## Remote Code

Are you using remote code?

No, I am not using Remote code.

Justification: All JavaScript and WebAssembly code is included in the extension's package. The extension does not load external scripts via `<script>` tags, does not reference external modules, and does not use `eval()` or similar dynamic code evaluation. All code is bundled and included in the extension package at build time.

---

## Single Purpose Policy

This extension has a single, well-defined purpose: To provide a unified dashboard view of GitHub activity directly on GitHub.com, aggregating pull requests, issues, and repositories from across all of the user's GitHub accounts and organizations.

All permissions requested are directly related to this single purpose:
- `storage`: Required to maintain authentication and preferences
- `tabs`: Required to detect GitHub.com visits and inject the dashboard
- `identity`: Required for secure OAuth authentication with GitHub
- Host permissions: Required to access GitHub API and inject dashboard on GitHub.com

The extension does not collect user data for advertising or analytics, share data with third parties, or modify content on websites other than GitHub.com.

---

## Privacy Commitment

- Local Storage Only: All data is stored locally on the user's device
- Read-Only Operations: The extension only reads data from GitHub, never modifies it
- No Third-Party Sharing: Data is never shared with third parties
- Direct API Access: Communication is only with GitHub's official API
- User Control: Users can revoke access at any time through GitHub settings

---

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- Single Purpose Policy requirements
- User Data Privacy requirements
- Permissions justification requirements
