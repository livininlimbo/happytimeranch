# Analytics Troubleshooting Guide

## 🔍 Common Issues Why Analytics Might Not Post to Database

### 1. **Network Connectivity Issues**
- **Problem**: App can't reach the analytics endpoint
- **Symptoms**: Network errors in console, events not being sent
- **Solutions**:
  ```bash
  # Test endpoint connectivity
  node scripts/debug-analytics-network.js
  ```
  - Check internet connection
  - Verify endpoint URL is correct: `https://app.codehive.vip/api/analytics/track`
  - Test on different networks (WiFi vs cellular)

### 2. **Analytics Not Initialized**
- **Problem**: `initAnalytics()` not called or failing
- **Symptoms**: "Analytics not initialized yet" warnings
- **Solutions**:
  - Ensure `initAnalytics()` is called in `_layout.tsx`
  - Check for initialization errors in console
  - Verify AsyncStorage permissions

### 3. **Event Batching Issues**
- **Problem**: Events queued but not sent due to batching logic
- **Symptoms**: Events in queue but no network requests
- **Solutions**:
  - Lower batch size for testing: `batchSize: 1`
  - Reduce batch timeout: `batchTimeout: 1000`
  - Force send events by backgrounding/foregrounding app

### 4. **Server-Side Issues**
- **Problem**: Analytics server not processing events correctly
- **Symptoms**: 200 OK responses but no data in database
- **Solutions**:
  - Check server logs for processing errors
  - Verify database connection on server
  - Test with curl/Postman directly

### 5. **Configuration Issues**
- **Problem**: Wrong website ID or endpoint
- **Symptoms**: 400/401/403 errors
- **Solutions**:
  - Verify `WEBSITE_ID`: `e137ff81-6393-4cc6-899a-f0bc6ffaaba7`
  - Check endpoint URL format
  - Ensure proper headers are sent

## 🛠️ Debugging Tools

### 1. **Network Debug Script**
```bash
node scripts/debug-analytics-network.js
```
Tests endpoint connectivity and configuration.

### 2. **Analytics Debug Module**
```typescript
import { 
  printAnalyticsDebugSummary,
  forceSendAnalyticsTest,
  startAnalyticsMonitoring 
} from '../assets/components/analytics-debug';

// In your app, add this for debugging:
printAnalyticsDebugSummary();
```

### 3. **Implementation Debug Script**
```bash
node scripts/debug-analytics.js
```
Verifies all components have proper analytics implementation.

## 🔧 Quick Fixes to Try

### 1. **Force Event Sending**
Add this to your app for testing:
```typescript
import { forceSendAnalyticsTest } from '../assets/components/analytics-debug';

// Call this in a button press or useEffect
forceSendAnalyticsTest();
```

### 2. **Enable Verbose Logging**
Modify `analytics.ts` temporarily:
```typescript
const CONFIG = {
  trackPageViews: true,
  trackEvents: true,
  trackSessions: true,
  respectDoNotTrack: false, // Disable for testing
  batchSize: 1, // Send immediately
  batchTimeout: 1000 // Short timeout
};
```

### 3. **Check AsyncStorage**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Test AsyncStorage
AsyncStorage.setItem('test', 'value').then(() => {
  console.log('AsyncStorage working');
}).catch(err => {
  console.error('AsyncStorage error:', err);
});
```

## 📊 Monitoring Analytics in Real-Time

### 1. **Console Monitoring**
Look for these log messages:
- ✅ `📊 CodeHive Analytics initialized`
- ✅ `Duplicate screen view prevented` (normal)
- ❌ `📊 Analytics not initialized yet`
- ❌ `📊 Analytics: Failed to send events`
- ❌ `📊 Analytics: Network error`

### 2. **Event Queue Monitoring**
Add to your app:
```typescript
import { startAnalyticsMonitoring } from '../assets/components/analytics-debug';

// Start monitoring (call once in app initialization)
const stopMonitoring = startAnalyticsMonitoring();

// Stop monitoring when needed
// stopMonitoring();
```

## 🚨 Most Likely Issues

Based on the implementation, here are the most probable causes:

### 1. **Batching Delay (Most Common)**
- Events are queued but not sent until batch is full (10 events) or timeout (5 seconds)
- **Fix**: Reduce batch size to 1 for immediate sending during testing

### 2. **App State Management**
- Events only sent when app is active
- **Fix**: Test by backgrounding and foregrounding the app to trigger batch send

### 3. **Network Timing**
- React Native network requests might be delayed or blocked
- **Fix**: Test on different networks and devices

### 4. **Server Processing**
- Server receives events but doesn't save to database
- **Fix**: Check server logs and database connection

## 🧪 Testing Checklist

- [ ] Run network debug script: `node scripts/debug-analytics-network.js`
- [ ] Check console for initialization logs
- [ ] Verify events are being queued (add debug logging)
- [ ] Test force send functionality
- [ ] Check network requests in dev tools
- [ ] Verify server is receiving requests
- [ ] Check database for saved events
- [ ] Test on different devices/networks

## 📞 Getting Help

If issues persist:
1. Run all debug scripts and collect output
2. Check browser/app network tab for requests
3. Verify server logs show incoming requests
4. Check database directly for saved events
5. Test with minimal example (single event)

## 🔄 Quick Test Implementation

Add this to any screen for immediate testing:
```typescript
import { forceSendAnalyticsTest, printAnalyticsDebugSummary } from '../assets/components/analytics-debug';

// Add a test button
<TouchableOpacity onPress={async () => {
  console.log('=== ANALYTICS DEBUG TEST ===');
  await printAnalyticsDebugSummary();
  await forceSendAnalyticsTest();
}}>
  <Text>Test Analytics</Text>
</TouchableOpacity>
```