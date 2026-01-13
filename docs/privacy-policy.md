# Privacy Policy for GitHub Dashboard

**Last Updated:** January 13, 2025

## Introduction

GitHub Dashboard ("we", "our", or "the extension") is a Chrome extension that displays your GitHub activity on GitHub.com. This privacy policy explains how we collect, use, and protect your information.

## Data Collection

### Information We Access

The extension accesses the following information from your GitHub account through the GitHub API:

- **User Information**: Your GitHub username, display name, avatar URL, bio, location, company, website, and social media links
- **Repository Information**: Repository names, descriptions, update timestamps, visibility status (public/private), and repository owners
- **Pull Request Data**: Pull request titles, numbers, states, URLs, creation/update dates, review statuses, comments, and associated repository information
- **Issue Data**: Issue titles, numbers, states, URLs, update dates, labels, comments, assignees, and associated repository information
- **Contribution Data**: Your contribution calendar data, commit counts, and contribution streaks
- **Activity Statistics**: Weekly and monthly statistics including commits, pull requests, reviews, issues, and comments

### Information We Store Locally

The extension stores the following information locally on your device using Chrome's local storage:

- **Authentication Token**: Your GitHub OAuth access token or Personal Access Token (encrypted and stored securely)
- **Cached Data**: Temporarily cached API responses to improve performance and reduce API calls
- **User Preferences**: Your theme preferences, language settings, favorite repositories, and dashboard display preferences

## How We Use Your Data

### Purpose

All data collected is used solely for the following purposes:

1. **Displaying Your Dashboard**: To show your GitHub activity in a unified dashboard interface
2. **Performance Optimization**: To cache data locally and reduce API calls to GitHub
3. **User Experience**: To remember your preferences and settings

### Data Processing

- **Read-Only Operations**: The extension only performs read-only operations. We never modify, create, update, or delete any data on your GitHub account
- **Local Processing**: All data processing occurs locally on your device. No data is sent to external servers except GitHub's official API
- **No Third-Party Sharing**: We do not share, sell, or transmit your data to any third parties

## Data Storage

### Local Storage

- All data is stored locally on your device using Chrome's `chrome.storage.local` API
- Data remains on your device and is never transmitted to external servers
- You can clear all stored data at any time by uninstalling the extension or clearing Chrome's extension storage

### Cache Management

- Cached data has a Time-To-Live (TTL) and is automatically refreshed
- You can manually refresh data at any time using the refresh button
- Cache is cleared when you log out or uninstall the extension

## Data Security

### Security Measures

- **Encrypted Storage**: Authentication tokens are stored securely using Chrome's built-in encryption
- **HTTPS Only**: All API communications use HTTPS encryption
- **No External Transmission**: Data is never sent to servers other than GitHub's official API
- **Read-Only Access**: The extension requests only read permissions and cannot modify your GitHub data

### Token Security

- Your GitHub access token is stored locally and encrypted by Chrome
- Tokens are never shared with third parties
- You can revoke access at any time through GitHub's settings

## Your Rights

You have the following rights regarding your data:

1. **Access**: You can view all data stored by the extension through Chrome's extension storage viewer
2. **Deletion**: You can delete all stored data by uninstalling the extension or clearing Chrome's extension storage
3. **Control**: You can revoke the extension's access to your GitHub account at any time through GitHub's OAuth settings
4. **Transparency**: All data access is visible in Chrome's extension permissions

## Third-Party Services

### GitHub API

- The extension communicates directly with GitHub's official API (api.github.com)
- All API requests are authenticated using your GitHub access token
- We do not use any intermediate services or proxies
- GitHub's privacy policy applies to data accessed through their API: https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement

## Children's Privacy

This extension is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13.

## Changes to This Privacy Policy

We may update this privacy policy from time to time. We will notify you of any changes by:

- Updating the "Last Updated" date at the top of this policy
- Posting a notice in the extension's update notes

## Contact Us

If you have any questions about this privacy policy or our data practices, please contact us through:

- **GitHub Issues**: https://github.com/fairy-pitta/github_extension/issues
- **Repository**: https://github.com/fairy-pitta/github_extension

## Compliance

This extension complies with:

- Chrome Web Store Developer Program Policies
- GitHub API Terms of Service
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) principles

---

**Note**: This extension is open source. You can review the source code at https://github.com/fairy-pitta/github_extension to verify our privacy practices.
