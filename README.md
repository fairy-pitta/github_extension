# GitHub Extension - Personal Dashboard

A Chrome extension that displays your GitHub activity on the new tab page, including pull requests, issues, and recently updated repositories.

## Repository

GitHub Repository: https://github.com/fairy-pitta/github_extension.git

## Features

- **Pull Requests**: View PRs you created and PRs that need your review
- **Issues**: See issues you're involved with
- **Repositories**: Browse recently updated repositories (including organization repos)
- **Clean Architecture**: Built with Clean Architecture principles for maintainability
- **Caching**: Smart caching to reduce API calls and improve performance

## Architecture

This project follows Clean Architecture principles with the following layers:

- **Domain Layer**: Business logic, entities, and use cases
- **Application Layer**: Services and application-specific logic
- **Infrastructure Layer**: External dependencies (GitHub API, Chrome Storage, Cache)
- **Presentation Layer**: UI components (New Tab page, Options page)

## Development Phases

The project is divided into 5 phases:

- **Phase 0**: Project initialization and architecture setup
- **Phase 1**: Domain layer and entity definitions
- **Phase 2**: Infrastructure layer implementation
- **Phase 3**: Application layer and Options page
- **Phase 4**: New Tab page UI implementation
- **Phase 5**: Optimization, testing, and final adjustments

See individual `phase*-plan.md` files for detailed implementation plans.

## Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Chrome browser (for testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/fairy-pitta/github_extension.git
cd github_extension
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory

### Development

```bash
# Development mode with watch
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

## Configuration

### OAuth Authentication (Recommended)

The extension supports OAuth authentication using GitHub OAuth App with PKCE (Proof Key for Code Exchange). This is the recommended and most secure method.

**Prerequisites:** Before using OAuth, you need to set up a GitHub OAuth App. See [SETUP.md](SETUP.md) for detailed instructions.

**Quick Setup Steps:**
1. Get your Chrome extension ID from `chrome://extensions/`
2. Create a GitHub OAuth App at https://github.com/settings/developers
3. Set the callback URL to: `https://YOUR_EXTENSION_ID.chromiumapp.org/`
4. Copy the Client ID and set it in `AppConfig.ts` or as `VITE_GITHUB_OAUTH_CLIENT_ID` environment variable
5. Rebuild the extension

**Using OAuth:**
1. Open the extension settings page (click the settings icon in the dashboard)
2. Click "Sign in with GitHub" button
3. Authorize the extension in the GitHub authentication page
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

**Required PAT Permissions:**
- `repo` (for private repositories)
- `read:org` (for organization repositories)
- `read:user` (for user information)

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
│   ├── api/            # GitHub API client
│   ├── storage/        # Chrome Storage
│   └── cache/          # Cache implementation
└── presentation/       # Presentation layer
    ├── newtab/         # New Tab page
    ├── options/         # Options page
    └── components/     # Shared components
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

## Building

```bash
# Production build
npm run build

# Build output will be in the `dist` directory
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License

## Acknowledgments

Built with:
- TypeScript
- React
- Vite
- Vitest
- Clean Architecture principles


