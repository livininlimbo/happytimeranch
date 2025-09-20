import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { debugAnalytics, forceSendEvents } from './analytics';

const AnalyticsDebugButton: React.FC = () => {
  const handleDebug = () => {
    console.log('\n=== ANALYTICS DEBUG REPORT ===');
    debugAnalytics();
    console.log('===============================\n');
  };

  const handleForceSend = () => {
    console.log('\n=== FORCE SENDING EVENTS ===');
    forceSendEvents();
    console.log('=============================\n');
    Alert.alert('Force Send', 'Check console for results');
  };

  return (
    <>
      <TouchableOpacity style={styles.debugButton} onPress={handleDebug}>
        <Text style={styles.buttonText}>🔍 Debug Analytics</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forceButton} onPress={handleForceSend}>
        <Text style={styles.buttonText}>🚀 Force Send Events</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  debugButton: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  forceButton: {
    position: 'absolute',
    top: 150,
    right: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AnalyticsDebugButton;