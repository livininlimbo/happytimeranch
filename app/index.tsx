import { useFocusEffect } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { initAnalytics, trackScreenView } from '../assets/components/analytics';
import DesktopPage from './indexDesktop';
import MobilePage from './indexMobile';

// Load fonts for web platform
if (Platform.OS === 'web') {
  import('../assets/utils/fontLoader');
}

const Index = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  // Initialize analytics once when the app starts
  useEffect(() => {
    initAnalytics();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      trackScreenView('home');
    }, [])
  );

  return isSmallScreen ? <MobilePage /> : <DesktopPage />;
};

export default Index;
