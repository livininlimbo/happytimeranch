// analytics.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { AppState } from 'react-native';

const API_ENDPOINT = "https://app.codehive.vip/api/analytics/track";
const WEBSITE_ID = "e137ff81-6393-4cc6-899a-f0bc6ffaaba7"; // Your website ID from CodeHive Dashboard

let sessionId: string | null = null;
let visitorId: string | null = null;
let eventQueue: any[] = [];
let batchTimer: NodeJS.Timeout | null = null;
let lastPageView: { name: string; timestamp: number } | null = null;
let sessionTimer: NodeJS.Timeout | null = null;
let isActive: boolean = true;
let isCleanedUp: boolean = false;
let hasAttachedListeners: boolean = false;
let lastSessionEvent: 'start' | 'end' | null = null;
let isInitialized: boolean = false;

const CONFIG = {
  trackPageViews: true,
  trackEvents: true,
  trackSessions: true,
  respectDoNotTrack: true,
  batchSize: 10,
  batchTimeout: 5000
};

/**
 * Get or create persistent visitor ID
 */
const getOrCreateVisitorId = async (): Promise<string> => {
  try {
    const stored = await AsyncStorage.getItem('codehive_visitor_id');
    if (stored) {
      return stored;
    }
  } catch (e) {
    // AsyncStorage not available, fall back to session-based ID
  }

  // Generate new visitor ID
  const newVisitorId = `visitor_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;

  try {
    await AsyncStorage.setItem('codehive_visitor_id', newVisitorId);
  } catch (e) {
    // AsyncStorage not available, visitor ID will be session-based
  }

  return newVisitorId;
};

/**
 * Initialize analytics tracking
 * Call this in your App.tsx or main component
 */
export const initAnalytics = async () => {
  // Prevent multiple initialization
  if (isInitialized) {
    console.debug('📊 CodeHive Analytics already initialized, skipping');
    return;
  }

  // Reset cleanup flag on initialization
  if (isCleanedUp) isCleanedUp = false;

  try {
    visitorId = await getOrCreateVisitorId();
    sessionId = `sess_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    isActive = true;
    isInitialized = true;

    if (CONFIG.trackSessions) {
      trackSessionStart();

      // Attach listeners only once to prevent duplicates
      if (!hasAttachedListeners) {
        AppState.addEventListener('change', handleAppStateChange);
        hasAttachedListeners = true;
      }
    }

    // Setup batch processing
    setupBatchProcessing();

    // Setup session timeout monitoring
    setupSessionTimeout();

    console.log('📊 CodeHive Analytics initialized');
  } catch (error) {
    console.error('📊 Analytics initialization failed:', error);
    isInitialized = false;
  }
};

/**
 * Track a custom event
 * @param eventName - Name of the event
 * @param eventValue - Optional numeric value
 * @param customData - Optional custom data object
 */
export const trackEvent = (eventName: string, eventValue?: number, customData?: any) => {
  if (!CONFIG.trackEvents) return;

  queueEvent({
    eventType: 'event',
    eventName,
    eventValue,
    customData,
  });
};

/**
 * Track a screen view (equivalent to page view for web)
 * @param screenName - Name of the screen
 * @param customData - Optional custom data
 */
export const trackScreenView = (screenName: string, customData?: any) => {
  if (!CONFIG.trackPageViews) return;

  const now = Date.now();
  const DEBOUNCE_WINDOW = 10000; // 10 seconds debounce window

  // Prevent duplicate page views within debounce window for same screen
  if (lastPageView &&
    lastPageView.name === screenName &&
    (now - lastPageView.timestamp) < DEBOUNCE_WINDOW) {
    console.debug('Duplicate screen view prevented (within debounce window):', screenName);
    return;
  }

  lastPageView = { name: screenName, timestamp: now };

  queueEvent({
    eventType: 'pageview',
    pageUrl: `happytimeranch.com/${screenName}`,
    pageTitle: screenName,
    customData,
  });
};

/**
 * Handle app state changes
 */
const handleAppStateChange = (state: string) => {
  if (state === 'background') {
    isActive = false;
    trackSessionEnd();
    sendBatch(true); // Send immediately on background
    pauseAnalytics(); // Stop timers when app goes to background
  }
  if (state === 'active') {
    isActive = true;
    // Generate new session if we've been inactive for more than 30 minutes
    const now = Date.now();
    const sessionAge = sessionId ? now - parseInt(sessionId.split('_')[2]) : 0;
    if (sessionAge > 30 * 60 * 1000) { // 30 minutes
      sessionId = `sess_${Math.random().toString(36).substring(2, 11)}_${now}`;
    }
    trackSessionStart();
    resumeAnalytics(); // Restart timers when app becomes active
  }
};

/**
 * Track session start
 */
const trackSessionStart = () => {
  if (lastSessionEvent === 'start') return; // avoid duplicate starts
  lastSessionEvent = 'start';
  queueEvent({
    eventType: 'session_start',
  });
};

/**
 * Track session end
 */
const trackSessionEnd = () => {
  if (lastSessionEvent === 'end') return; // avoid duplicate ends
  lastSessionEvent = 'end';
  queueEvent({
    eventType: 'session_end',
  });
};

/**
 * Queue an event for batch processing
 */
const queueEvent = (eventData: any) => {
  // Don't queue events after cleanup
  if (isCleanedUp) {
    console.debug('Analytics cleaned up, ignoring event:', eventData.eventType);
    return;
  }

  // Don't queue events if analytics hasn't been initialized yet
  if (!visitorId || !sessionId) {
    console.warn('📊 Analytics not initialized yet, skipping event:', eventData.eventType);
    return;
  }

  const event = {
    ...eventData,
    sessionId,
    visitorId,
    websiteId: WEBSITE_ID,
    timestamp: new Date().toISOString(),
    userAgent: `${Device.osName} ${Device.osVersion}`,
    deviceType: Device.deviceType === 1 ? 'phone' : Device.deviceType === 2 ? 'tablet' : 'unknown',
    screenResolution: 'mobile', // React Native doesn't expose screen dimensions easily
    language: 'en', // You can use expo-localization for actual locale
  };

  eventQueue.push(event);

  // Send immediately if queue is full
  if (eventQueue.length >= CONFIG.batchSize) {
    sendBatch();
  }
};

/**
 * Setup batch processing timer
 */
const setupBatchProcessing = () => {
  if (batchTimer) {
    clearInterval(batchTimer);
  }

  batchTimer = setInterval(() => {
    if (isActive && eventQueue.length > 0) {
      sendBatch();
    }
  }, CONFIG.batchTimeout);
};

/**
 * Setup session timeout monitoring
 */
const setupSessionTimeout = () => {
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }

  // Check every 5 minutes if session should end due to inactivity
  sessionTimer = setInterval(() => {
    if (!isActive) {
      // If we've been inactive for more than 30 minutes, end session
      const now = Date.now();
      const sessionAge = sessionId ? now - parseInt(sessionId.split('_')[2]) : 0;
      if (sessionAge > 30 * 60 * 1000) { // 30 minutes
        trackSessionEnd();
        sendBatch(true);
      }
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
};

/**
 * Pause analytics when app goes to background
 */
const pauseAnalytics = () => {
  if (batchTimer) {
    clearInterval(batchTimer);
    batchTimer = null;
  }
  if (sessionTimer) {
    clearInterval(sessionTimer);
    sessionTimer = null;
  }
};

/**
 * Resume analytics when app becomes active
 */
const resumeAnalytics = () => {
  setupBatchProcessing();
  setupSessionTimeout();
};

/**
 * Send batch of events to analytics API
 */
const sendBatch = async (isBackground = false) => {
  if (eventQueue.length === 0) return;

  const events = eventQueue.splice(0);
  const MAX_RETRY_QUEUE_SIZE = 50; // Limit retry queue to prevent memory issues

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events }),
      // Use keepalive for background requests to ensure delivery
      ...(isBackground && { keepalive: true })
    });

    if (!response.ok) {
      console.warn('📊 Analytics: Failed to send events', response.status);

      // Re-queue failed events for retry (with size limit)
      if (eventQueue.length < MAX_RETRY_QUEUE_SIZE) {
        eventQueue.unshift(...events.slice(0, MAX_RETRY_QUEUE_SIZE - eventQueue.length));
        console.debug('📊 Analytics: Re-queued failed events for retry');
      }
    }
  } catch (error) {
    console.warn('📊 Analytics: Network error', error);

    // Re-queue events on network error (with size limit)
    if (eventQueue.length < MAX_RETRY_QUEUE_SIZE) {
      eventQueue.unshift(...events.slice(0, MAX_RETRY_QUEUE_SIZE - eventQueue.length));
      console.debug('📊 Analytics: Re-queued events after network error');
    }
  }
};

/**
 * Debug function to check analytics state and force send events
 */
export const debugAnalytics = () => {
  console.log('🔍 ANALYTICS DEBUG STATE:');
  console.log('  Initialized:', isInitialized);
  console.log('  Active:', isActive);
  console.log('  Cleaned up:', isCleanedUp);
  console.log('  Session ID:', sessionId);
  console.log('  Visitor ID:', visitorId);
  console.log('  Event queue length:', eventQueue.length);
  console.log('  Batch timer running:', !!batchTimer);
  console.log('  Last page view:', lastPageView);
  
  if (eventQueue.length > 0) {
    console.log('📋 QUEUED EVENTS:');
    eventQueue.forEach((event, index) => {
      console.log(`  ${index + 1}. ${event.eventType} - ${event.pageTitle || event.eventName || 'Unknown'}`);
    });
    
    console.log('🚀 FORCE SENDING QUEUED EVENTS...');
    sendBatch(true);
  } else {
    console.log('📭 No events in queue');
  }
};

/**
 * Force send all queued events immediately (for debugging)
 */
export const forceSendEvents = () => {
  console.log('🚀 Force sending analytics events...');
  if (eventQueue.length > 0) {
    sendBatch(true);
    console.log(`📤 Sent ${eventQueue.length} events`);
  } else {
    console.log('📭 No events to send');
  }
};

/**
 * Cleanup analytics (call on app unmount if needed)
 */
export const cleanupAnalytics = () => {
  // Prevent multiple cleanup calls
  if (isCleanedUp) {
    console.log('📊 CodeHive Analytics already cleaned up');
    return;
  }

  isCleanedUp = true;
  isActive = false;
  isInitialized = false; // Reset initialization flag

  // Clear all timers
  if (batchTimer) {
    clearInterval(batchTimer);
    batchTimer = null;
  }

  if (sessionTimer) {
    clearInterval(sessionTimer);
    sessionTimer = null;
  }

  // Track session end and send final batch
  if (sessionId) {
    trackSessionEnd();
  }

  // Send any remaining events only once
  if (eventQueue.length > 0) {
    sendBatch(true);
    eventQueue.length = 0; // Clear queue immediately
  }

  // Clear session data
  sessionId = null;
  visitorId = null;
  lastPageView = null;
  lastSessionEvent = null;

  console.log('📊 CodeHive Analytics cleaned up');
};

// Usage example:
// 
// In your App.tsx:
// import { initAnalytics } from './analytics';
// 
// export default function App() {
//   useEffect(() => {
//     initAnalytics();
//   }, []);
//   
//   return <YourAppContent />;
// }
//
// In your screens:
// import { trackScreenView, trackEvent } from './analytics';
// 
// const HomeScreen = () => {
// useFocusEffect(
//    React.useCallback(() => {
//      trackScreenView("Process");
//    }, [])
//  );
//   
//   const handleButtonPress = () => {
//     trackEvent('button_press', 1, { button: 'cta' });
//   };
//   
//   return <YourScreenContent />;
// };