import React from 'react';
import { useWindowDimensions } from 'react-native';
import DesktopPage from './indexDesktop';
import MobilePage from './indexMobile';

const Index = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  return isSmallScreen ? <MobilePage /> : <DesktopPage />;
};

export default Index;
