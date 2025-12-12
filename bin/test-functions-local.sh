#!/bin/bash

# Local Netlify Function Test Script
# Run this while 'netlify dev' is running in another terminal

echo "🧪 Testing Netlify Functions Locally"
echo "===================================="

# Find the Netlify dev server port
NETLIFY_PORT=$(ps aux | grep "netlify dev" | grep -o "localhost:[0-9]*" | head -1 | cut -d: -f2)

if [ -z "$NETLIFY_PORT" ]; then
    echo "❌ Netlify dev server not running. Please run 'netlify dev' first."
    exit 1
fi

BASE_URL="http://localhost:$NETLIFY_PORT"
echo "📡 Using Netlify dev server: $BASE_URL"

echo ""
echo "1. Testing simple function..."
curl -s "$BASE_URL/.netlify/functions/test" -w "HTTP %{http_code}" && echo ""

echo ""
echo "2. Testing cache function health check..."
curl -s "$BASE_URL/.netlify/functions/cache-products?action=health" -w "HTTP %{http_code}" && echo ""

echo ""
echo "3. Testing cache function categories..."
curl -s "$BASE_URL/.netlify/functions/cache-products?action=categories" -w "HTTP %{http_code}" && echo ""

echo ""
echo "🎉 Function testing complete!"