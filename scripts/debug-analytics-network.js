#!/usr/bin/env node

// Analytics Network Debug Script
// Tests the analytics endpoint and configuration

const https = require('https');
const http = require('http');

const API_ENDPOINT = "https://app.codehive.vip/api/analytics/track";
const WEBSITE_ID = "e137ff81-6393-4cc6-899a-f0bc6ffaaba7";

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.bold}${colors.cyan}${msg}${colors.reset}`)
};

function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'HappyTimeRanch-Analytics-Debug/1.0'
      }
    };

    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let responseBody = '';
      
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          body: responseBody
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

async function testEndpointConnectivity() {
  log.header('\n🌐 Testing Analytics Endpoint Connectivity');
  log.header('==========================================');
  
  try {
    log.info(`Testing endpoint: ${API_ENDPOINT}`);
    
    const testPayload = {
      events: [{
        eventType: 'pageview',
        pageUrl: 'happytimeranch.com/debug-test',
        pageTitle: 'Debug Test',
        websiteId: WEBSITE_ID,
        timestamp: new Date().toISOString(),
        userAgent: 'HappyTimeRanch-Debug/1.0',
        deviceType: 'debug',
        sessionId: 'debug_session_' + Date.now(),
        visitorId: 'debug_visitor_' + Date.now()
      }]
    };

    log.info('Sending test payload...');
    console.log('Payload:', JSON.stringify(testPayload, null, 2));
    
    const response = await makeRequest(API_ENDPOINT, testPayload);
    
    log.info(`Response Status: ${response.statusCode} ${response.statusMessage}`);
    log.info('Response Headers:');
    Object.entries(response.headers).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    log.info('Response Body:');
    console.log(response.body);
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      log.success('Endpoint is reachable and accepting requests!');
      return true;
    } else if (response.statusCode >= 400 && response.statusCode < 500) {
      log.error(`Client error (${response.statusCode}): Check your request format or authentication`);
      return false;
    } else if (response.statusCode >= 500) {
      log.error(`Server error (${response.statusCode}): The analytics server is having issues`);
      return false;
    } else {
      log.warning(`Unexpected status code: ${response.statusCode}`);
      return false;
    }
    
  } catch (error) {
    log.error(`Network error: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      log.error('DNS resolution failed - check your internet connection');
    } else if (error.code === 'ECONNREFUSED') {
      log.error('Connection refused - the server might be down');
    } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      log.error('Request timed out - check your internet connection or server availability');
    }
    
    return false;
  }
}

async function validateConfiguration() {
  log.header('\n⚙️  Validating Analytics Configuration');
  log.header('====================================');
  
  // Check API endpoint format
  try {
    new URL(API_ENDPOINT);
    log.success(`API endpoint format is valid: ${API_ENDPOINT}`);
  } catch (error) {
    log.error(`Invalid API endpoint URL: ${API_ENDPOINT}`);
    return false;
  }
  
  // Check website ID format
  const websiteIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (websiteIdPattern.test(WEBSITE_ID)) {
    log.success(`Website ID format is valid: ${WEBSITE_ID}`);
  } else {
    log.error(`Invalid website ID format: ${WEBSITE_ID}`);
    log.info('Website ID should be a UUID format like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    return false;
  }
  
  return true;
}

async function testDifferentPayloads() {
  log.header('\n🧪 Testing Different Event Types');
  log.header('================================');
  
  const eventTypes = [
    {
      name: 'Page View',
      payload: {
        eventType: 'pageview',
        pageUrl: 'happytimeranch.com/test-page',
        pageTitle: 'Test Page'
      }
    },
    {
      name: 'Custom Event',
      payload: {
        eventType: 'event',
        eventName: 'test_event',
        eventValue: 1
      }
    },
    {
      name: 'Session Start',
      payload: {
        eventType: 'session_start'
      }
    }
  ];
  
  for (const eventType of eventTypes) {
    try {
      log.info(`Testing ${eventType.name}...`);
      
      const fullPayload = {
        events: [{
          ...eventType.payload,
          websiteId: WEBSITE_ID,
          timestamp: new Date().toISOString(),
          userAgent: 'HappyTimeRanch-Debug/1.0',
          deviceType: 'debug',
          sessionId: 'debug_session_' + Date.now(),
          visitorId: 'debug_visitor_' + Date.now()
        }]
      };
      
      const response = await makeRequest(API_ENDPOINT, fullPayload);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        log.success(`${eventType.name} - Status: ${response.statusCode}`);
      } else {
        log.error(`${eventType.name} - Status: ${response.statusCode} - ${response.body}`);
      }
      
    } catch (error) {
      log.error(`${eventType.name} - Error: ${error.message}`);
    }
  }
}

async function main() {
  log.header('🔍 Analytics Network Debug Tool');
  log.header('===============================\n');
  
  // Step 1: Validate configuration
  const configValid = await validateConfiguration();
  if (!configValid) {
    log.error('Configuration validation failed. Please fix the issues above.');
    process.exit(1);
  }
  
  // Step 2: Test basic connectivity
  const connectivityOk = await testEndpointConnectivity();
  if (!connectivityOk) {
    log.error('Endpoint connectivity test failed. Check the issues above.');
    process.exit(1);
  }
  
  // Step 3: Test different event types
  await testDifferentPayloads();
  
  log.header('\n📋 Summary');
  log.header('==========');
  log.success('Network debug completed successfully!');
  log.info('If events are still not appearing in your database:');
  log.info('1. Check that the analytics service is processing events correctly');
  log.info('2. Verify your database connection and table structure');
  log.info('3. Check server logs for any processing errors');
  log.info('4. Ensure your React Native app is calling initAnalytics() and trackScreenView()');
  
  process.exit(0);
}

if (require.main === module) {
  main().catch(error => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  });
}