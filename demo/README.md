# GitHub Dashboard Demo

This folder contains a demo page for taking screenshots to submit to the Chrome Web Store.

## Usage

### Starting a Local Server

1. Navigate to this folder in your terminal:
   ```bash
   cd demo
   ```

2. Start the server:
   ```bash
   ./server.sh
   ```
   
   Or specify a port number:
   ```bash
   ./server.sh 8080
   ```

3. Open the following URL in your browser:
   ```
   http://localhost:8000/index.html
   ```

### Starting the Server Manually

#### Using Python 3:
```bash
python3 -m http.server 8000
```

#### Using Python 2:
```bash
python -m SimpleHTTPServer 8000
```

#### Using Node.js:
```bash
npx http-server -p 8000
```

## Demo Page Features

- **Profile Section**: User information, contribution calendar, streak, and achievement badges
- **Repository Section**: List of recently updated repositories
- **Pull Request Section**: Created PRs and review-requested PRs
- **Issue Section**: List of related issues
- **Theme Toggle**: Click the theme icon in the header to change themes (Light, Dark, and various color themes)
- **Statistics Widget**: Click the Statistics button to view weekly and monthly activity statistics

## Taking Screenshots

1. Open the demo page in your browser
2. Select your preferred theme (click the theme toggle button)
3. Use your browser's developer tools (F12) to adjust to the appropriate screen size
4. Take a screenshot

## Notes

- This demo page is created with static HTML and does not make actual API calls
- All data is sample data for demonstration purposes
- The contribution calendar is generated with random data
- Theme preferences are saved in localStorage and will persist across page reloads
