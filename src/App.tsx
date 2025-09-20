// App.tsx
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import React, { useEffect } from "react";
import { initAnalytics } from '../assets/components/analytics';
import '../assets/fonts/fonts.css';



// Prevent splash screen from auto-hiding until fonts are ready
SplashScreen.preventAutoHideAsync();

export default function App() {
  console.log('📊 App.tsx component is rendering!');

  const [fontsLoaded] = Font.useFonts({
    ...Ionicons.font, // 👈 preload Ionicons.ttf so Footer works on web
  });
  useEffect(() => {
    console.log('📊 App.tsx useEffect - calling initAnalytics...');
    initAnalytics().then(() => {
      console.log('📊 App.tsx - initAnalytics completed');
    }).catch((error) => {
      console.error('📊 App.tsx - initAnalytics failed:', error);
    });
  }, []);
  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // keep splash visible until fonts load
  }

  return <Slot />; // Expo Router renders your app tree (_layout.tsx, etc.)
}
