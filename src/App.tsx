// App.tsx
import React from "react";
import { Slot } from "expo-router";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { SplashScreen } from "expo-router";
import '../assets/fonts/fonts.css';


// Prevent splash screen from auto-hiding until fonts are ready
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    ...Ionicons.font, // 👈 preload Ionicons.ttf so Footer works on web
  });

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
