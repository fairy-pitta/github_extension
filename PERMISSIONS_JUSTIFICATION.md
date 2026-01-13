# Permissions Justification for Chrome Web Store

This document explains why each permission is required for the GitHub Dashboard extension to function properly.

## Required Permissions

### 1. `storage`

**Purpose:** Store user authentication tokens, preferences, and cached data locally on the user's device.

**Usage:**
- Store GitHub OAuth access tokens or Personal Access Tokens securely
- Save user preferences (theme, language, favorite repositories, dashboard layout)
- Cache API responses locally to reduce API calls and improve performance
- Store dashboard display settings

**Justification:** 
The extension needs to persist authentication credentials and user preferences across browser sessions. All data is stored locally using `chrome.storage.local` and never transmitted to external servers except GitHub's official API. This permission is essential for the extension's core functionality of maintaining user authentication and preferences.

**Data Stored:**
- Authentication tokens (encrypted)
- Theme preferences
- Language settings
- Favorite repositories list
- Cached API responses (with TTL)
- Dashboard layout preferences

**Privacy:** All data remains on the user's device and is never shared with third parties.

---

### 2. `tabs`

**Purpose:** Detect when users navigate to GitHub.com to automatically inject the dashboard.

**Usage:**
- Monitor tab updates to detect when users visit GitHub.com
- Inject the dashboard content script when GitHub.com pages load
- Ensure the dashboard appears automatically on GitHub.com without manual activation

**Justification:**
The extension's primary feature is to display a unified dashboard directly on GitHub.com. To provide a seamless user experience, the extension needs to detect when users visit GitHub.com and automatically inject the dashboard interface. This permission allows the extension to:
- Listen for tab updates on GitHub.com
- Inject the dashboard when appropriate
- Provide a seamless, integrated experience

**Privacy:** The extension only accesses tabs matching `https://github.com/*` and does not read or modify content from other websites. No tab data is collected or transmitted.

**Scope:** Limited to GitHub.com domains only.

---

### 3. `identity`

**Purpose:** Enable OAuth authentication flow with GitHub using Chrome's identity API.

**Usage:**
- Launch OAuth authentication flow for GitHub
- Handle OAuth redirects securely
- Obtain OAuth access tokens from GitHub

**Justification:**
The extension provides OAuth authentication as the recommended and most secure method for users to authenticate with GitHub. The `identity` permission enables the extension to:
- Launch the OAuth flow securely
- Handle authentication redirects
- Obtain access tokens without requiring users to manually create Personal Access Tokens

**Privacy:** The identity API is used only for GitHub OAuth authentication. No user identity information is collected or shared with third parties. All authentication is handled directly between the user and GitHub.

**Alternative:** Users can choose to use Personal Access Tokens instead of OAuth, but OAuth is the recommended secure method.

---

## Host Permissions

### `https://api.github.com/*`

**Purpose:** Access GitHub's official REST and GraphQL APIs to fetch user data.

**Usage:**
- Fetch user profile information
- Retrieve pull requests, issues, and repositories
- Get contribution calendar data
- Access activity statistics

**Justification:**
This is the core functionality of the extension. The extension needs to communicate with GitHub's official API to display the user's GitHub activity in a unified dashboard. All API requests are:
- Authenticated using the user's own GitHub access token
- Read-only (no write operations)
- Direct communication with GitHub's official API (no intermediaries)

**Privacy:** Only the user's own GitHub data is accessed, using their own authentication credentials. No data is shared with third parties.

---

### `https://github.com/*`

**Purpose:** Inject the dashboard interface into GitHub.com pages.

**Usage:**
- Inject content scripts to display the dashboard on GitHub.com
- Load dashboard assets (CSS, JavaScript) on GitHub.com pages
- Provide seamless integration with GitHub.com

**Justification:**
The extension's primary feature is to display a unified dashboard directly on GitHub.com. This host permission allows:
- Content scripts to run on GitHub.com pages
- Dashboard assets to be loaded and displayed
- Seamless user experience without leaving GitHub.com

**Privacy:** The extension only modifies the display of GitHub.com pages to show the dashboard. It does not:
- Collect or transmit page content
- Modify GitHub's functionality
- Interfere with GitHub's normal operation
- Access data from other websites

**Scope:** Limited to GitHub.com domains only.

---

## Single Purpose Policy

This extension has a single, well-defined purpose:

**To provide a unified dashboard view of GitHub activity directly on GitHub.com, aggregating pull requests, issues, and repositories from across all of the user's GitHub accounts and organizations.**

All permissions requested are directly related to this single purpose:
- `storage`: Required to maintain authentication and preferences
- `tabs`: Required to detect GitHub.com visits and inject the dashboard
- `identity`: Required for secure OAuth authentication (optional, users can use PAT instead)
- Host permissions: Required to access GitHub API and inject dashboard on GitHub.com

The extension does not:
- Collect user data for advertising or analytics
- Share data with third parties
- Modify content on websites other than GitHub.com
- Perform any operations unrelated to displaying GitHub activity

---

## Privacy Commitment

- **Local Storage Only:** All data is stored locally on the user's device
- **Read-Only Operations:** The extension only reads data from GitHub, never modifies it
- **No Third-Party Sharing:** Data is never shared with third parties
- **Direct API Access:** Communication is only with GitHub's official API
- **User Control:** Users can revoke access at any time through GitHub settings

---

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- Single Purpose Policy requirements
- User Data Privacy requirements
- Permissions justification requirements
