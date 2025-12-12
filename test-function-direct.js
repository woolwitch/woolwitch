#!/usr/bin/env node

// Direct function test - bypassing Netlify dev server
const path = require('path');

// Load the test function directly
const testFunction = require('./netlify/functions/test.js');

// Mock event object
const mockEvent = {
  httpMethod: 'GET',
  path: '/.netlify/functions/test',
  queryStringParameters: null,
  headers: {},
  body: null
};

// Mock context object  
const mockContext = {
  callbackWaitsForEmptyEventLoop: false
};

console.log('🧪 Testing function directly...');

testFunction.handler(mockEvent, mockContext)
  .then(result => {
    console.log('✅ Function executed successfully!');
    console.log('Status:', result.statusCode);
    console.log('Headers:', result.headers);
    console.log('Body:', result.body);
  })
  .catch(error => {
    console.log('❌ Function failed:');
    console.error(error);
  });