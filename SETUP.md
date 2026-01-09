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

The extension supports OAuth authentication, which is more secure and convenient than manually entering tokens.

**Important:** OAuth Client ID setup depends on how you're using the extension:

- **If you installed from Chrome Web Store:** OAuth is already configured! Just click "Sign in with GitHub" - no setup needed.
- **If you're building from source code:** You (the developer) need to create a GitHub OAuth App and configure the Client ID (see steps below).

**Who needs to set up OAuth Client ID?**

- **End Users (Chrome Web Storeからインストールした場合):** 設定不要。OAuthはすぐに使えます。
- **開発者 (ソースコードからビルドする場合):** 開発者が1回だけOAuth Appを作成し、Client IDを設定します。設定後は、そのビルドを使う全ユーザーがOAuthを使えます。

**For End Users (Chrome Web Store version):**
- OAuth is ready to use! No setup required.
- Simply click "Sign in with GitHub" button in the settings page
- Authorize the extension in the GitHub authentication page
- The extension will automatically obtain and save your access token

**For Developers (Building from source):**

If you're building the extension from source code, **you (the developer) need to create a GitHub OAuth App and configure the Client ID**. This is a **one-time setup** that you do as the developer. Once configured and built, anyone using your built extension can use OAuth without any additional setup.

**Important Notes for Testing and Publishing:**

1. **Development Testing (Before Publishing):**
   - You can test OAuth using the developer mode extension ID
   - The developer mode ID and Chrome Web Store ID are **different**
   - You'll need to create **separate OAuth Apps** for development and production

2. **Publishing to Chrome Web Store:**
   - After uploading to Chrome Web Store (even as a draft), you'll get the production extension ID
   - Create a **new OAuth App** with the Chrome Web Store extension ID
   - Update the Client ID in the code and rebuild for production

3. **Why Two OAuth Apps?**
   - GitHub OAuth App only allows one callback URL per app
   - Developer mode: `https://DEV_EXTENSION_ID.chromiumapp.org/`
   - Chrome Web Store: `https://PROD_EXTENSION_ID.chromiumapp.org/`
   - These are different URLs, so you need separate OAuth Apps

Follow these steps to set up OAuth for development:

#### Step 1: Get Your Chrome Extension ID

**Note:** This step is only needed if you're building the extension from source. If you installed from Chrome Web Store, skip to "Using OAuth" section below.

1. After loading the extension in Chrome (Step 3), go to `chrome://extensions/`
2. Make sure "Developer mode" is enabled (top-right toggle)
3. Find your extension in the list
4. You'll see an **Extension ID** displayed (a long string like `abcdefghijklmnopqrstuvwxyz123456`)
5. Your callback URL will be: `https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/`
   - This is the URL you'll need when creating the GitHub OAuth App
   - **Note:** The extension uses GitHub OAuth **Device Flow**, so the callback URL is not used during authentication. We still recommend setting it to the extension URL for consistency/future compatibility.

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

**Important:** The extension ID in developer mode is different from the Chrome Web Store extension ID. This means:
- You can test OAuth before publishing using the developer mode ID
- When you publish to Chrome Web Store, you'll need to create a **new OAuth App** with the Chrome Web Store extension ID
- This is normal - you'll have two OAuth Apps (one for development, one for production)

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

#### Using OAuth (After Setup)

Once the Client ID is configured (or if using Chrome Web Store version):

1. Click the "Sign in with GitHub" button in the settings page
2. You will be redirected to GitHub's authentication page
3. Click "Authorize" to grant the extension access
4. The extension will automatically obtain and save your access token
5. The page will reload and display your GitHub dashboard

#### Publishing to Chrome Web Store (Production Setup)

**Can I test OAuth before publishing?**

Yes! You can test OAuth using the developer mode extension ID. However, when you publish to Chrome Web Store, you'll get a **different extension ID**, so you'll need to create a **new OAuth App** for production.

**Steps for Chrome Web Store publication:**

1. **First, upload to Chrome Web Store (even as a draft):**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Click "New Item"
   - Upload your extension ZIP file (build the extension first with `npm run build`)
   - **Important:** Don't publish yet - just upload to get the extension ID
   - Copy the **Extension ID** from the Chrome Web Store dashboard

2. **Create a new GitHub OAuth App for production:**
   - Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
   - Click "New OAuth App"
   - **Application name**: `GitHub Extension (Production)` (to distinguish from dev)
   - **Authorization callback URL**: `https://YOUR_CHROME_WEB_STORE_EXTENSION_ID.chromiumapp.org/`
   - Click "Register application"
   - Copy the **Client ID** (this is your production Client ID)

3. **Update the Client ID in your code:**
   - Update `src/application/config/AppConfig.ts` with the production Client ID
   - Or set it via environment variable when building for production

4. **Rebuild and update:**
   - Run `npm run build`
   - Upload the new ZIP file to Chrome Web Store
   - Submit for review

**Note:** You'll have two OAuth Apps:
- One for development (using developer mode extension ID)
- One for production (using Chrome Web Store extension ID)

This is normal and expected behavior!

### Option 2: Manual Personal Access Token (Alternative)

If you prefer to use a Personal Access Token instead:

1. In the settings page, click "Manual Token Input" to expand the section
2. Create a Personal Access Token at [GitHub Settings](https://github.com/settings/tokens/new)
3. Select the required permissions (read-only access):
   - `repo` (for private repositories - read access only, this extension performs no write operations)
   - `read:org` (for organization repositories)
   - `read:user` (for reading user information)
4. Generate and copy the token
5. Paste it into the extension's settings page and save

**Note:** While `repo` scope technically grants read/write access, this extension only uses it for read-only operations. GitHub OAuth App does not provide a read-only scope for private repositories, so `repo` scope is required to access private repositories.

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
