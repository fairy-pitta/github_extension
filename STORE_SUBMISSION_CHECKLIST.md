# Chrome Web Store Submission Checklist

This checklist helps ensure all requirements are met before submitting the GitHub Dashboard extension to the Chrome Web Store.

## ✅ Required Files

### 1. Extension Package
- [x] Built extension in `dist/` directory
- [x] All assets included
- [x] Manifest.json is valid (Manifest V3)
- [x] Icons are present (16x16, 32x32, 48x48, 128x128)

### 2. Store Listing Assets

#### Screenshots
- [x] At least 1 screenshot (up to 5)
- [x] Size: 1280 x 800 or 640 x 400
- [x] Format: JPEG or 24-bit PNG (no alpha)
- [x] Files: `public/screenshots-store/screenshot_*_1280x800.jpg`

#### Promo Tiles
- [x] Small promo tile: 440 x 280
  - File: `public/github-dashboard-promo-tile-440x280.jpg`
- [x] Marquee promo tile: 1400 x 560
  - File: `public/github-dashboard-promo-tile-marquee-1400x560.jpg`
- [x] Format: JPEG or 24-bit PNG (no alpha)

### 3. Store Listing Information

#### Description
- [x] Detailed description prepared
- [x] File: `CHROME_STORE_DESCRIPTION.md`
- [x] Highlights key features and benefits
- [x] Clear and engaging

#### Category
- [ ] Select appropriate category (likely "Productivity" or "Developer Tools")

#### Language
- [x] English description ready
- [x] Can add Japanese translation if needed

## ✅ Privacy & Security

### Privacy Policy
- [x] Privacy policy created
- [x] English: `PRIVACY_POLICY.md`
- [x] Japanese: `PRIVACY_POLICY.ja.md`
- [ ] Privacy policy URL ready (GitHub raw URL or hosted)
  - Suggested: `https://raw.githubusercontent.com/fairy-pitta/github_extension/main/PRIVACY_POLICY.md`

### Permissions Justification
- [x] Permissions justification document created
- [x] File: `PERMISSIONS_JUSTIFICATION.md`
- [x] Each permission explained with clear justification
- [x] Single purpose policy documented

### Data Collection Disclosure
- [x] Privacy policy explains data collection
- [x] Clear statement that data is stored locally
- [x] No third-party sharing disclosed
- [x] User rights explained

## ✅ Technical Requirements

### Manifest V3 Compliance
- [x] Uses Manifest V3
- [x] Service worker instead of background page
- [x] Content Security Policy compliant
- [x] No inline scripts

### Permissions
- [x] `storage` - Justified
- [x] `tabs` - Justified
- [x] `identity` - Justified (for OAuth)
- [x] Host permissions: `https://api.github.com/*` and `https://github.com/*`

### Security
- [x] HTTPS only for API calls
- [x] Secure token storage
- [x] No external data transmission (except GitHub API)
- [x] Read-only operations

## ✅ Content & Quality

### Functionality
- [x] Extension works as described
- [x] No crashes or errors
- [x] Proper error handling
- [x] User-friendly interface

### User Experience
- [x] Clear installation instructions
- [x] Easy authentication flow
- [x] Intuitive interface
- [x] Responsive design

### Documentation
- [x] README.md updated with screenshots
- [x] README.ja.md updated with screenshots
- [x] Clear setup instructions
- [x] Development guide included

## 📋 Submission Steps

1. **Prepare Extension Package**
   ```bash
   npm run build
   # Zip the dist/ directory
   ```

2. **Create Chrome Web Store Developer Account**
   - Go to https://chrome.google.com/webstore/devconsole
   - Pay one-time $5 registration fee (if not already paid)

3. **Upload Extension**
   - Click "New Item"
   - Upload the zipped extension package
   - Fill in store listing information

4. **Fill Store Listing**
   - **Name:** GitHub Dashboard
   - **Summary:** Display your GitHub activity on GitHub.com
   - **Description:** Copy from `CHROME_STORE_DESCRIPTION.md`
   - **Category:** Productivity or Developer Tools
   - **Language:** English (and optionally Japanese)
   - **Privacy Policy URL:** `https://raw.githubusercontent.com/fairy-pitta/github_extension/main/PRIVACY_POLICY.md`

5. **Upload Assets**
   - Upload screenshots (up to 5)
   - Upload small promo tile (440x280)
   - Upload marquee promo tile (1400x560)

6. **Permissions Justification**
   - For each permission, provide justification
   - Use content from `PERMISSIONS_JUSTIFICATION.md`
   - Explain single purpose clearly

7. **Submit for Review**
   - Review all information
   - Submit for review
   - Wait for approval (typically 1-3 business days)

## 📝 Notes

- **Review Time:** Chrome Web Store reviews typically take 1-3 business days
- **Rejections:** If rejected, address feedback and resubmit
- **Updates:** After approval, updates go through the same review process
- **Privacy Policy:** Must be publicly accessible URL (GitHub raw URL works)

## 🔗 Useful Links

- Chrome Web Store Developer Dashboard: https://chrome.google.com/webstore/devconsole
- Developer Program Policies: https://developer.chrome.com/docs/webstore/program-policies/
- Manifest V3 Migration Guide: https://developer.chrome.com/docs/extensions/mv3/intro/
- Privacy Policy Requirements: https://developer.chrome.com/docs/webstore/user-data/
