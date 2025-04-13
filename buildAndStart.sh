#!/bin/bash
###
 # @Author: BuXiongYu
 # @Date: 2025-04-11 19:15:20
 # @LastEditors: BuXiongYu
 # @LastEditTime: 2025-04-11 20:03:32
 # @Description: 请填写简介
###

# Exit on error
set -e

echo "Building and starting the integrated application..."

# Build client
echo "Building client..."
cd client
npm run build
echo "Client build completed."

# Create client-dist directory in server
mkdir -p ../server/client-dist

# Copy client dist to server
echo "Copying client files to server..."
cp -r dist/* ../server/client-dist/

# Build and start server
echo "Building and starting server..."
cd ../server
npm run build
npm run start:with-client

echo "Server is running. You can access the application at http://localhost:3000"
