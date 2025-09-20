#!/usr/bin/env node

// Test script to verify the analytics endpoint is working
const API_ENDPOINT = "https://app.codehive.vip/api/analytics/track";
const WEBSITE_ID = "e137ff81-6393-4cc6-899a-f0bc6ffaaba7";

async function testEndpoint() {
  console.log('🧪 Testing Analytics Endpoint');
  console.log('==============================');
  console.log(`Endpoint: ${API_ENDPOINT}`);
  console.log(`Website ID: ${WEBSITE_ID}\n`);

  const testEvent = {
    eventType: 'pageview',
    pageUrl: 'happytimeranch.com/test',
    pageTitle: 'Test Page',
    sessionId: `test_sess_${Date.now()}`,
    visitorId: `test_visitor_${Date.now()}`,
    websiteId: WEBSITE_ID,
    timestamp: new Date().toISOString(),
    userAgent: 'Test Script',
    deviceType: 'unknown',
    screenResolution: 'test',
    language: 'en',
  };

  const payload = {
    events: [testEvent]
  };

  console.log('📤 Sending test event...');
  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log(`\n📥 Response: ${response.status} ${response.statusText}`);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Body:', responseText);

    if (response.ok) {
      console.log('\n✅ Endpoint is working correctly!');
    } else {
      console.log('\n❌ Endpoint returned an error');
    }

  } catch (error) {
    console.error('\n❌ Network error:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Possible issues:');
      console.log('   - Check your internet connection');
      console.log('   - Verify the endpoint URL is correct');
      console.log('   - Check if the server is running');
    }
  }
}

// Test CORS preflight
async function testCORS() {
  console.log('\n🌐 Testing CORS...');
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      }
    });

    console.log(`CORS Preflight: ${response.status} ${response.statusText}`);
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
    });

  } catch (error) {
    console.log('CORS test failed:', error.message);
  }
}

async function main() {
  await testEndpoint();
  await testCORS();
}

if (require.main === module) {
  main();
}