# Chrome Extension Setup Guide

Step-by-step instructions to get the Chrome extension running.

## 1. Install Dependencies

Navigate to the project directory in your terminal and run:

```bash
cd /Users/shuna/github-expansion
npm install
```

## 2. Build

Build the extension:

```bash
npm run build
```

After a successful build, the extension files will be generated in the `dist` directory.

## 3. Load the Extension in Chrome

1. **Open Chrome**
2. **Open the Extensions page**
   - Type `chrome://extensions/` in the address bar and press Enter
   - Or, go to Menu → More tools → Extensions
3. **Enable Developer mode**
   - Toggle "Developer mode" ON in the top-right corner of the page
4. **Load the extension**
   - Click "Load unpacked"
   - Select the `dist` directory
   - Select `/Users/shuna/github-expansion/dist`

## 4. Configure the Extension

1. **Open a new tab**
   - When you open a new tab, the GitHub Dashboard will be displayed
   - Authentication is required initially, so the settings screen will appear
2. **Set up Authentication**

### Option 1: OAuth Authentication (Recommended)

**Before you can use OAuth, you need to create a GitHub OAuth App and configure the Client ID.**

The extension supports OAuth authentication, which is more secure and convenient than manually entering tokens.

1. Click the "Sign in with GitHub" button in the settings page
2. You will be redirected to GitHub's authentication page
3. Click "Authorize" to grant the extension access
4. The extension will automatically obtain and save your access token
5. The page will reload and display your GitHub dashboard

**Important:** OAuth authentication requires a GitHub OAuth App. Follow these steps to set it up:

#### Step 1: Get Your Chrome Extension ID

1. After loading the extension in Chrome (Step 3), go to `chrome://extensions/`
2. Make sure "Developer mode" is enabled (top-right toggle)
3. Find your extension in the list
4. You'll see an **Extension ID** displayed (a long string like `abcdefghijklmnopqrstuvwxyz123456`)
5. Your callback URL will be: `https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/`
   - **Note:** Chrome Identity API automatically uses this format: `https://YOUR_EXTENSION_ID.chromiumapp.org/`
   - This is the URL you'll need when creating the GitHub OAuth App

#### Step 2: Create GitHub OAuth App

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click **"New OAuth App"** button
3. Fill in the application details:
   - **Application name**: `GitHub Extension` (or any name you prefer)
   - **Homepage URL**: `https://github.com` (or your repository URL)
   - **Authorization callback URL**: Use the URL from Step 1 (e.g., `https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/`)
4. Click **"Register application"**
5. Copy the **Client ID** (you'll see it on the next page)

#### Step 3: Configure Client ID in Extension

You have two options:

**Option A: Using Environment Variable (Recommended for development)**

1. Create a `.env` file in the project root (same directory as `package.json`):
```bash
# .env file
VITE_GITHUB_OAUTH_CLIENT_ID=your_client_id_here
```
   Replace `your_client_id_here` with the Client ID you copied from GitHub.

2. Rebuild the extension:
```bash
npm run build
```

3. Reload the extension in Chrome:
   - Go to `chrome://extensions/`
   - Click the reload icon (🔄) next to your extension

**Option B: Direct Configuration in Code**

1. Open `src/application/config/AppConfig.ts`
2. Replace the empty string with your Client ID:
```typescript
oauth: {
  clientId: 'your_client_id_here',  // Replace with your actual Client ID
  scopes: ['read:user', 'read:org', 'repo'],
  redirectUri: '',
}
```

3. Rebuild and reload the extension

**Note:** Never commit the Client ID to version control if it's sensitive. Use environment variables or `.env.local` file (which should be in `.gitignore`).

### Option 2: Manual Personal Access Token (Alternative)

If you prefer to use a Personal Access Token instead:

1. In the settings page, click "Manual Token Input" to expand the section
2. Create a Personal Access Token at [GitHub Settings](https://github.com/settings/tokens/new)
3. Select the required permissions:
   - `repo` (for private repositories)
   - `read:org` (for organization repositories)
   - `read:user` (for reading user information)
4. Generate and copy the token
5. Paste it into the extension's settings page and save

## 5. Verify Operation

- When you open a new tab, the GitHub Dashboard will be displayed
- The following information will be shown:
  - **Pull Requests (Created by Me)**: PRs you created
  - **Pull Requests (Review Requested)**: PRs that need your review
  - **Issues (Involved)**: Issues you're involved with
  - **Recently Updated Repositories**: Recently updated repositories

## Development Mode (Hot Reload)

To develop while making code changes:

```bash
npm run dev
```

This command watches for file changes and automatically rebuilds.
Click the "Reload" button on the Chrome extensions page to see your changes.

## Troubleshooting

### If Build Errors Occur

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

### If the Extension Won't Load

- Verify that the `dist` directory was generated correctly
- Check that `dist/manifest.json` exists
- Check for errors in Chrome's console (F12)

### If Data Doesn't Display

- If using OAuth: Verify that the OAuth App is configured correctly and the Client ID is set
- If using PAT: Verify that the Personal Access Token is set correctly
- Check that the token has the required permissions (`repo`, `read:org`, `read:user`)
- Check for error messages in the browser console (F12)

## Useful Features

- **Refresh**: Click the refresh button in the header, or press the `r` key
- **Filter**: Toggle between "All" and "Open Only"
- **Settings**: Access the settings page from the ⚙️ button in the header
