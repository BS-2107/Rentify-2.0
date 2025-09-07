#!/bin/bash

# Rentify Token Extractor - MongoDB Server Startup Script
# This script starts the MongoDB backend server for the Chrome extension

echo "🚀 Starting Rentify Token Extractor MongoDB Server..."
echo "📁 Location: $(pwd)"
echo "🔗 Server will run on: http://localhost:3002"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "🔄 Starting MongoDB server..."
node server.js

# This will run until you stop it with Ctrl+C
