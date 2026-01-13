# GitHub Dashboard

A Chrome extension that displays your GitHub activity on GitHub.com as a unified dashboard, including pull requests, issues, and recently updated repositories.

![GitHub Dashboard - Light Theme](public/screenshots-store/screenshot_1_1280x800.jpg)

## Repository

GitHub Repository: https://github.com/fairy-pitta/github_extension.git

## Features

### 📊 Unified Activity Overview

Stop jumping between repositories and organizations. GitHub Dashboard consolidates your entire GitHub activity into a single, beautiful dashboard that appears directly on GitHub.com.

![GitHub Dashboard - Dark Theme](public/screenshots-store/screenshot_2_1280x800.jpg)

### 🔀 Pull Request Management

- **Created PRs**: Track all pull requests you've created across any repository
- **Review Requests**: Never miss a PR that needs your review, regardless of which repository it's in
- **Reviewed PRs**: Keep track of PRs you've already reviewed with clear visual indicators
- **Smart Filtering**: Filter by review status (approved, changes requested, commented, etc.)
- **Review Statistics**: See at-a-glance review counts and statuses

### 🐛 Issue Tracking

View all issues you're involved with across all your repositories and organizations. No more switching between multiple repository pages to check on issues—everything is in one place.

![GitHub Dashboard - Light Blue Theme](public/screenshots-store/screenshot_3_1280x800.jpg)

### 📁 Repository Management

- **All Repositories**: Browse recently updated repositories from all sources
- **Organization Repos**: Dedicated view for organization repositories
- **Personal Repos**: Quick access to your personal repositories
- **Favorite Repositories**: Star frequently used repositories for instant access
- **Auto-refresh**: Automatically loads repositories when switching tabs

### 📈 Activity Statistics

Get insights into your GitHub activity with comprehensive statistics:
- **Weekly & Monthly Comparisons**: See how your activity compares week-over-week and month-over-month
- **Commit Tracking**: Monitor your commit activity across all repositories
- **PR & Review Metrics**: Track pull requests created and reviews completed
- **Issue Activity**: Monitor issues you're involved with
- **Comment Activity**: See your comment contributions

![GitHub Dashboard - Statistics](public/screenshots-store/screenshot_4_1280x800.jpg)

### 🎨 Beautiful, Customizable Interface

- **Multiple Themes**: Choose from light, dark, and colorful themes
- **Responsive Design**: Works perfectly on all screen sizes
- **Clean UI**: Modern, intuitive interface that doesn't clutter your GitHub experience
- **Fast Performance**: Smart caching reduces API calls and improves load times

### 🔒 Secure Authentication

- **OAuth Support**: Secure OAuth authentication using GitHub's Device Flow (recommended)
- **Manual Token Option**: Support for Personal Access Tokens if you prefer fine-grained control
- **Read-Only Access**: The extension only performs read operations—your data is never modified

## Installation

1. Install the extension from the [Chrome Web Store](https://chrome.google.com/webstore) (coming soon)
2. Or load it manually:
   - Clone this repository
   - Run `npm install && npm run build`
   - Load the `dist` directory as an unpacked extension in Chrome

## Configuration

### OAuth Authentication (Recommended)

The extension supports OAuth authentication using GitHub OAuth Device Flow. This is the recommended and most secure method.

**Using OAuth:**
1. Open the extension settings page (click the settings icon in the dashboard)
2. Click "Sign in with GitHub" button
3. Complete the authorization on GitHub using the provided code
4. The extension will automatically obtain and save your access token

**Benefits of OAuth:**
- More secure than manually entering tokens
- No need to manually create and manage Personal Access Tokens
- Standard authentication flow
- Automatic token management

### Manual Token Input (Alternative)

If you prefer to use a Personal Access Token (PAT) instead:

1. Open the extension settings page
2. Click "Manual Token Input" to expand the section
3. Create a Personal Access Token at [GitHub Settings](https://github.com/settings/tokens/new)
4. Enter your token and save

**Required PAT Permissions (Read-only):**
- `repo` (for private repositories - read access only, this extension performs no write operations)
- `read:org` (for organization repositories)
- `read:user` (for user information)

**Note:** While `repo` scope technically grants read/write access, this extension only uses it for read-only operations. GitHub OAuth App does not provide a read-only scope for private repositories.

## Development

### Prerequisites

- Node.js 18+ and npm/yarn
- Chrome browser (for testing)

### Setup

```bash
# Clone the repository
git clone https://github.com/fairy-pitta/github_extension.git
cd github_extension

# Install dependencies
npm install

# Build the extension
npm run build

# Development mode with watch
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` directory

## Project Structure

```
src/
├── domain/              # Domain layer
│   ├── entities/       # Entities
│   ├── repositories/   # Repository interfaces
│   └── usecases/       # Use cases
├── application/        # Application layer
│   ├── services/       # Services
│   └── di/             # Dependency injection
├── infrastructure/     # Infrastructure layer
│   ├── api/            # GitHub API clients
│   ├── storage/        # Chrome Storage
│   └── cache/          # Cache implementation
└── presentation/       # Presentation layer
    ├── dashboard/      # Dashboard page
    ├── options/        # Options page
    └── components/     # Shared components
```

## Architecture

This project follows Clean Architecture principles with clear separation of concerns:

- **Domain Layer**: Business logic, entities, and use cases (no dependencies)
- **Application Layer**: Services and application-specific logic (depends only on Domain)
- **Infrastructure Layer**: External dependencies (GitHub API, Chrome Storage, Cache)
- **Presentation Layer**: UI components (React components)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License
