/*
 * @Author: BuXiongYu
 * @Date: 2025-04-11 19:18:47
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-12 13:18:20
 * @Description: 请填写简介
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if client dist exists
const clientDistPath = path.join(__dirname, 'client-dist');
if (!fs.existsSync(clientDistPath)) {
  console.error('Client dist directory not found at:', clientDistPath);
  console.error('Please run the build script first.');
  process.exit(1);
}

// Start the server
console.log('Starting server...');
const server = spawn('node', ['dist/main.js'], { stdio: 'inherit' });

// Handle server process events
server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  if (code !== 0) {
    console.error(`Server process exited with code ${code}`);
    process.exit(code);
  }
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  server.kill('SIGTERM');
});
