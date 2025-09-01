import React, {useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from '../app/index';
import Soaps from '../app/soaps';
import Flowers from '../app/flowers';
import Eggs from '../app/eggs';
import Contact from '@/app/contact';
import Candles from '@/app/candles';
import OurFarm from '@/app/ourfarm';
import OurTeam from '@/app/ourteam';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        ...Ionicons.font,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  
  return (
    <NavigationContainer>
      {/* Wrap the entire navigator + CartIcon inside CartProvider */}
        {/* Optional: You can position CartIcon absolutely in your layout */}

        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Index} />
          <Stack.Screen name="Soaps" component={Soaps} />
          <Stack.Screen name="Flowers" component={Flowers} />
          <Stack.Screen name="Eggs" component={Eggs} />
          <Stack.Screen name="Contact" component={Contact} />
          <Stack.Screen name="Candles" component={Candles} />
          <Stack.Screen name="Our Farm" component={OurFarm} />
          <Stack.Screen name="Our Team" component={OurTeam} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
