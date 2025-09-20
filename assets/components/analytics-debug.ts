// analytics-debug.ts
// Debugging utilities for analytics tracking

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';

// Debug configuration
const DEBUG_CONFIG = {
  enableConsoleLogging: true,
  enableNetworkLogging: true,
  enableEventLogging: true,
  logLevel: 'debug' as 'debug' | 'info' | 'warn' | 'error'
};

// Debug state tracking
let debugEventQueue: any[] = [];
let debugNetworkRequests: any[] = [];
let debugInitializationLog: any[] = [];

/**
 * Enhanced logging function
 */
const debugLog = (level: string, message: string, data?: any) => {
  if (!DEBUG_CONFIG.enableConsoleLogging) return;
  
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, level, message, data };
  
  switch (level) {
    case 'debug':
      console.debug(`🔍 [${timestamp}] ${message}`, data || '');
      break;
    case 'info':
      console.info(`ℹ️ [${timestamp}] ${message}`, data || '');
      break;
    case 'warn':
      console.warn(`⚠️ [${timestamp}] ${message}`, data || '');
      break;
    case 'error':
      console.error(`❌ [${timestamp}] ${message}`, data || '');
      break;
  }
  
  debugInitializationLog.push(logEntry);
};

/**
 * Test network connectivity to analytics endpoint
 */
export const testAnalyticsEndpoint = async () => {
  const API_ENDPOINT = "https://app.codehive.vip/api/analytics/track";
  
  debugLog('info', 'Testing analytics endpoint connectivity...');
  
  try {
    // Test with a simple ping-like request
    const testEvent = {
      events: [{
        eventType: 'pageview',
        pageUrl: 'happytimeranch.com/debug-test',
        pageTitle: 'Debug Test',
        websiteId: 'e137ff81-6393-4cc6-899a-f0bc6ffaaba7',
        timestamp: new Date().toISOString(),
        userAgent: `${Device.osName} ${Device.osVersion}`,
        deviceType: Device.deviceType === 1 ? 'phone' : Device.deviceType === 2 ? 'tablet' : 'unknown',
        sessionId: 'test_session',
        visitorId: 'test_visitor'
      }]
    };

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEvent),
    });

    const responseText = await response.text();
    
    debugLog('info', `Endpoint test response: ${response.status}`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText
    });

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      response: responseText,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    debugLog('error', 'Endpoint test failed', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
};

/**
 * Check analytics initialization status
 */
export const checkAnalyticsStatus = async () => {
  debugLog('info', 'Checking analytics initialization status...');
  
  const status = {
    asyncStorageAvailable: false,
    visitorIdStored: false,
    deviceInfoAvailable: false,
    networkConnectivity: false,
    initializationLogs: debugInitializationLog
  };

  // Test AsyncStorage
  try {
    await AsyncStorage.setItem('test_key', 'test_value');
    await AsyncStorage.removeItem('test_key');
    status.asyncStorageAvailable = true;
    debugLog('debug', 'AsyncStorage is available');
  } catch (error) {
    debugLog('warn', 'AsyncStorage not available', error);
  }

  // Check visitor ID
  try {
    const visitorId = await AsyncStorage.getItem('codehive_visitor_id');
    status.visitorIdStored = !!visitorId;
    debugLog('debug', `Visitor ID stored: ${!!visitorId}`, visitorId);
  } catch (error) {
    debugLog('warn', 'Could not check visitor ID', error);
  }

  // Check device info
  try {
    const deviceInfo = {
      osName: Device.osName,
      osVersion: Device.osVersion,
      deviceType: Device.deviceType,
      modelName: Device.modelName
    };
    status.deviceInfoAvailable = !!(Device.osName && Device.osVersion);
    debugLog('debug', 'Device info available', deviceInfo);
  } catch (error) {
    debugLog('warn', 'Device info not available', error);
  }

  // Test network connectivity
  const endpointTest = await testAnalyticsEndpoint();
  status.networkConnectivity = endpointTest.success;

  return status;
};

/**
 * Monitor analytics events in real-time
 */
export const startAnalyticsMonitoring = () => {
  debugLog('info', 'Starting analytics monitoring...');
  
  // Intercept console logs to capture analytics logs
  const originalConsoleLog = console.log;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;
  const originalConsoleDebug = console.debug;

  console.log = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('📊')) {
      debugEventQueue.push({
        type: 'log',
        timestamp: new Date().toISOString(),
        message: args[0],
        data: args.slice(1)
      });
    }
    originalConsoleLog.apply(console, args);
  };

  console.warn = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('📊')) {
      debugEventQueue.push({
        type: 'warn',
        timestamp: new Date().toISOString(),
        message: args[0],
        data: args.slice(1)
      });
    }
    originalConsoleWarn.apply(console, args);
  };

  console.error = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('📊')) {
      debugEventQueue.push({
        type: 'error',
        timestamp: new Date().toISOString(),
        message: args[0],
        data: args.slice(1)
      });
    }
    originalConsoleError.apply(console, args);
  };

  console.debug = (...args) => {
    if (args[0] && typeof args[0] === 'string' && (args[0].includes('📊') || args[0].includes('Duplicate screen view'))) {
      debugEventQueue.push({
        type: 'debug',
        timestamp: new Date().toISOString(),
        message: args[0],
        data: args.slice(1)
      });
    }
    originalConsoleDebug.apply(console, args);
  };

  return () => {
    // Restore original console methods
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
    console.debug = originalConsoleDebug;
  };
};

/**
 * Get analytics debug report
 */
export const getAnalyticsDebugReport = async () => {
  debugLog('info', 'Generating analytics debug report...');
  
  const status = await checkAnalyticsStatus();
  
  const report = {
    timestamp: new Date().toISOString(),
    status,
    eventQueue: debugEventQueue,
    networkRequests: debugNetworkRequests,
    initializationLogs: debugInitializationLog,
    recommendations: []
  };

  // Generate recommendations based on status
  if (!status.asyncStorageAvailable) {
    report.recommendations.push('AsyncStorage is not available - visitor tracking may not persist between sessions');
  }
  
  if (!status.visitorIdStored) {
    report.recommendations.push('No visitor ID found in storage - this might be the first run or storage is not working');
  }
  
  if (!status.deviceInfoAvailable) {
    report.recommendations.push('Device information is not available - check expo-device installation');
  }
  
  if (!status.networkConnectivity) {
    report.recommendations.push('Cannot reach analytics endpoint - check network connectivity and endpoint URL');
  }

  if (debugEventQueue.length === 0) {
    report.recommendations.push('No analytics events captured - analytics might not be initialized or events are not being triggered');
  }

  return report;
};

/**
 * Force send analytics events (for testing)
 */
export const forceSendAnalyticsTest = async () => {
  debugLog('info', 'Force sending test analytics event...');
  
  const API_ENDPOINT = "https://app.codehive.vip/api/analytics/track";
  const WEBSITE_ID = "e137ff81-6393-4cc6-899a-f0bc6ffaaba7";
  
  const testEvent = {
    events: [{
      eventType: 'pageview',
      pageUrl: 'happytimeranch.com/debug-test',
      pageTitle: 'Debug Test',
      websiteId: WEBSITE_ID,
      timestamp: new Date().toISOString(),
      userAgent: `${Device.osName} ${Device.osVersion}`,
      deviceType: Device.deviceType === 1 ? 'phone' : Device.deviceType === 2 ? 'tablet' : 'unknown',
      sessionId: `debug_sess_${Date.now()}`,
      visitorId: `debug_visitor_${Date.now()}`,
      screenResolution: 'mobile',
      language: 'en'
    }]
  };

  try {
    debugLog('debug', 'Sending test event', testEvent);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEvent),
    });

    const responseText = await response.text();
    
    debugNetworkRequests.push({
      timestamp: new Date().toISOString(),
      request: testEvent,
      response: {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
        headers: Object.fromEntries(response.headers.entries())
      }
    });

    debugLog('info', `Test event sent - Status: ${response.status}`, {
      status: response.status,
      response: responseText
    });

    return {
      success: response.ok,
      status: response.status,
      response: responseText
    };
  } catch (error) {
    debugLog('error', 'Failed to send test event', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
};

/**
 * Clear debug logs
 */
export const clearDebugLogs = () => {
  debugEventQueue = [];
  debugNetworkRequests = [];
  debugInitializationLog = [];
  debugLog('info', 'Debug logs cleared');
};

/**
 * Print analytics debug summary to console
 */
export const printAnalyticsDebugSummary = async () => {
  console.log('\n🔍 ANALYTICS DEBUG SUMMARY');
  console.log('==========================');
  
  const report = await getAnalyticsDebugReport();
  
  console.log(`📊 Status Check (${report.timestamp}):`);
  console.log(`  AsyncStorage: ${report.status.asyncStorageAvailable ? '✅' : '❌'}`);
  console.log(`  Visitor ID: ${report.status.visitorIdStored ? '✅' : '❌'}`);
  console.log(`  Device Info: ${report.status.deviceInfoAvailable ? '✅' : '❌'}`);
  console.log(`  Network: ${report.status.networkConnectivity ? '✅' : '❌'}`);
  
  console.log(`\n📝 Event Queue: ${report.eventQueue.length} events captured`);
  console.log(`🌐 Network Requests: ${report.networkRequests.length} requests logged`);
  
  if (report.recommendations.length > 0) {
    console.log('\n⚠️ Recommendations:');
    report.recommendations.forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });
  }
  
  if (report.eventQueue.length > 0) {
    console.log('\n📋 Recent Events:');
    report.eventQueue.slice(-5).forEach(event => {
      console.log(`  [${event.timestamp}] ${event.type}: ${event.message}`);
    });
  }
  
  return report;
};

// Export debug configuration for external use
export { DEBUG_CONFIG, debugEventQueue, debugInitializationLog, debugNetworkRequests };
