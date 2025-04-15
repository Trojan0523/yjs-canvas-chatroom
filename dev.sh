#!/bin/bash
# Development script to start both client and server with hot reloading

echo "Starting development environment..."

# Check if concurrently is installed in server
cd server
if ! npm list concurrently >/dev/null 2>&1; then
  echo "Installing concurrently..."
  npm install --save-dev concurrently
fi

# Start development environment
echo "Starting client and server in development mode..."
npm run dev

# The above command will start both services through the concurrently script
