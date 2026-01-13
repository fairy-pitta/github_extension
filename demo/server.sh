#!/bin/bash

# Simple HTTP server for demo page
# Usage: ./server.sh [port]

PORT=${1:-8000}

echo "Starting HTTP server on port $PORT..."
echo "Open http://localhost:$PORT/index.html in your browser"
echo "Press Ctrl+C to stop the server"

# Try Python 3 first, then Python 2, then use Node.js http-server
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer $PORT
elif command -v npx &> /dev/null; then
    npx http-server -p $PORT
else
    echo "Error: No HTTP server found. Please install Python or Node.js"
    exit 1
fi
