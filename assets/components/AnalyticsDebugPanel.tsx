import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { forceFlushEvents, getAnalyticsDebugInfo, trackEvent } from './analytics-debug';

const AnalyticsDebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  const refreshDebugInfo = () => {
    setDebugInfo(getAnalyticsDebugInfo());
  };

  useEffect(() => {
    refreshDebugInfo();
    const interval = setInterval(refreshDebugInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  const testEvent = () => {
    trackEvent('debug_test', 1, { source: 'debug_panel' });
    refreshDebugInfo();
  };

  if (!isVisible) {
    return (
      <TouchableOpacity 
        style={styles.toggleButton} 
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.toggleText}>🔍</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Debug</Text>
        <TouchableOpacity onPress={() => setIsVisible(false)}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Status</Text>
        <Text style={styles.debugText}>
          Initialized: {debugInfo?.isInitialized ? '✅' : '❌'}
        </Text>
        <Text style={styles.debugText}>
          Active: {debugInfo?.isActive ? '✅' : '❌'}
        </Text>
        <Text style={styles.debugText}>
          Queue Length: {debugInfo?.queueLength || 0}
        </Text>
        
        <Text style={styles.sectionTitle}>Session Info</Text>
        <Text style={styles.debugText}>
          Session ID: {debugInfo?.sessionId?.substring(0, 20)}...
        </Text>
        <Text style={styles.debugText}>
          Visitor ID: {debugInfo?.visitorId?.substring(0, 20)}...
        </Text>
        
        <Text style={styles.sectionTitle}>Last Page View</Text>
        <Text style={styles.debugText}>
          Screen: {debugInfo?.lastPageView?.name || 'None'}
        </Text>
        
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity style={styles.button} onPress={testEvent}>
          <Text style={styles.buttonText}>Send Test Event</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={forceFlushEvents}>
          <Text style={styles.buttonText}>Force Flush Queue</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={refreshDebugInfo}>
          <Text style={styles.buttonText}>Refresh Info</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  toggleText: {
    fontSize: 20,
    color: 'white',
  },
  container: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 300,
    maxHeight: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 10,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    color: 'white',
    fontSize: 18,
  },
  content: {
    padding: 15,
  },
  sectionTitle: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 3,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default AnalyticsDebugPanel;