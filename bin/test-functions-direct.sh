#!/bin/bash

echo "🧪 Quick Function Test"
echo "====================="

# Test the simple function directly
echo "Testing simple function..."
cd /workspaces/woolwitch
node -e "
const func = require('./netlify/functions/test.js');
func.handler({httpMethod:'GET'}, {}).then(r => {
  console.log('✅ Status:', r.statusCode);
  console.log('✅ Response:', JSON.parse(r.body));
}).catch(e => console.log('❌ Error:', e));
"

echo ""
echo "Testing cache function health..."
node -e "
const func = require('./netlify/functions/cache-products-simple.js');
func.handler({
  httpMethod:'GET',
  queryStringParameters: {action: 'health'}
}, {}).then(r => {
  console.log('✅ Status:', r.statusCode);
  console.log('✅ Response:', JSON.parse(r.body));
}).catch(e => console.log('❌ Error:', e));
"

echo ""
echo "🎉 Local function test complete!"