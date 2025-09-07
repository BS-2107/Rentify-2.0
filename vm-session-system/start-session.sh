#!/bin/bash

echo "🚀 Starting Rentify Session Injection Container"
echo "📊 Container Environment:"
echo "   SESSION_ID: $SESSION_ID"
echo "   TARGET_URL: $TARGET_URL"
echo "   DISPLAY: $DISPLAY"

# Wait for X server to be ready
echo "⏳ Waiting for X server..."
sleep 5

# Start session injector
echo "🔧 Starting session injection process..."
exec "$@"
