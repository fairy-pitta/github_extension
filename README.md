# GitHub Extension - Personal Dashboard

A Chrome extension that displays your GitHub activity on GitHub.com as a dashboard, including pull requests, issues, and recently updated repositories.

## Repository

GitHub Repository: https://github.com/fairy-pitta/github_extension.git

## Features

- **Pull Requests**: View PRs you created and PRs that need your review
- **Issues**: See issues you're involved with
- **Repositories**: Browse recently updated repositories (including organization repos)

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

## License

MIT License
