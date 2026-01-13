# Screenshot Guide

This guide will help you take 5 screenshots for the Chrome Web Store submission.

## Screenshots Needed

1. **Light Theme** - Default theme
2. **Dark Theme** - Dark mode
3. **Light Blue Theme** - Pastel blue theme
4. **Light Purple Theme** - Pastel purple theme
5. **Statistics Popup** - Statistics widget modal open

## Steps to Take Screenshots

### Prerequisites
1. Make sure the demo server is running:
   ```bash
   cd demo
   ./server.sh
   ```

2. Open the demo page in your browser:
   ```
   http://localhost:8000/index.html
   ```

### Screenshot 1: Light Theme (Default)
1. Open the demo page (it should be in light theme by default)
2. Press `F12` to open Developer Tools
3. Click the device toolbar icon (or press `Cmd+Shift+M` on Mac / `Ctrl+Shift+M` on Windows)
4. Set viewport to: **1920x1080** or **1280x720**
5. Take a screenshot (or use browser's screenshot feature)

### Screenshot 2: Dark Theme
1. Click the **theme toggle button** (moon icon) in the header once
2. The page should switch to dark theme
3. Take a screenshot

### Screenshot 3: Light Blue Theme
1. Click the **theme toggle button** 2 more times (total 3 clicks from light theme)
2. The page should be in light blue theme
3. Take a screenshot

### Screenshot 4: Light Purple Theme
1. Click the **theme toggle button** 1 more time (total 4 clicks from light theme)
2. The page should be in light purple theme
3. Take a screenshot

### Screenshot 5: Statistics Popup
1. Set theme back to light theme (click theme toggle until you're back to light)
2. Click the **Statistics** button in the header
3. The statistics popup should open showing weekly and monthly stats
4. Take a screenshot of the popup

## Browser Screenshot Tips

### Chrome/Edge:
- Use Developer Tools: `F12` → Click three dots menu → "Capture screenshot" or "Capture node screenshot"
- Or use extensions like "Full Page Screen Capture"

### Firefox:
- Use Developer Tools: `F12` → Click three dots menu → "Take a screenshot"
- Or use built-in screenshot tool: `Shift+F2` → type `screenshot --fullpage`

### Safari:
- Use Developer Tools: `Cmd+Option+I` → Click "Capture screenshot" button
- Or use built-in screenshot: `Cmd+Shift+3` (full screen) or `Cmd+Shift+4` (selection)

## Recommended Viewport Sizes

- **Desktop**: 1920x1080 or 1280x720
- **Laptop**: 1366x768
- **Tablet**: 768x1024
- **Mobile**: 375x667 (iPhone) or 360x640 (Android)

For Chrome Web Store, **1280x720** or **1920x1080** are recommended.

## File Naming Suggestions

Save screenshots with descriptive names:
- `screenshot-light-theme.png`
- `screenshot-dark-theme.png`
- `screenshot-light-blue-theme.png`
- `screenshot-light-purple-theme.png`
- `screenshot-statistics-popup.png`
