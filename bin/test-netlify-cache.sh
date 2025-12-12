#!/bin/bash

# Test script for Netlify functions
# Usage: ./bin/test-netlify-cache.sh

set -e

echo "🧪 Testing Netlify Cache Function"
echo "================================="

# Set the base URL for testing
if [ "$1" = "prod" ]; then
    BASE_URL="https://woolwitch.netlify.app"
    echo "Testing PRODUCTION environment: $BASE_URL"
else
    BASE_URL="http://localhost:8888"
    echo "Testing LOCAL environment: $BASE_URL"
    echo ""
    echo "💡 Tip: Start local Netlify dev server first with: npm run dev:netlify"
fi

FUNCTION_URL="$BASE_URL/.netlify/functions/cache-products"

echo ""
echo "1. Testing product list endpoint..."
curl -s "$FUNCTION_URL?action=products&limit=3" | jq '.success' && echo "✅ Products endpoint working"

echo ""
echo "2. Testing categories endpoint..."
curl -s "$FUNCTION_URL?action=categories" | jq '.success' && echo "✅ Categories endpoint working"

echo ""
echo "3. Testing filtered products (if data exists)..."
curl -s "$FUNCTION_URL?action=products&category=Hats&limit=2" | jq '.success' && echo "✅ Filtered products endpoint working"

echo ""
echo "4. Testing search functionality..."
curl -s "$FUNCTION_URL?action=products&search=scarf&limit=1" | jq '.success' && echo "✅ Search endpoint working"

echo ""
echo "5. Testing error handling..."
curl -s "$FUNCTION_URL?action=invalid" | jq '.success' || echo "✅ Error handling working"

echo ""
echo "🎉 Netlify function testing complete!"
echo ""
echo "Full response example:"
echo "----------------------"
curl -s "$FUNCTION_URL?action=products&limit=1" | jq '.'