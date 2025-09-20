import Candles from '@/app/candles';
import Contact from '@/app/contact';
import OurFarm from '@/app/ourfarm';
import OurTeam from '@/app/ourteam';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import Eggs from '../app/eggs';
import Flowers from '../app/flowers';
import Index from '../app/index';
import Soaps from '../app/soaps';
import { initAnalytics } from '../assets/components/analytics';
import '../assets/fonts/fonts.css';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  console.log('📊 _layout.tsx RootNavigator is rendering!');
  
  const [fontsLoaded] = useFonts({
    'Ionicons': 'https://cdn.jsdelivr.net/npm/ionicons@6.0.0/dist/fonts/ionicons.ttf',
  });

  useEffect(() => {
    console.log('📊 _layout.tsx useEffect - calling initAnalytics...');
    initAnalytics().then(() => {
      console.log('📊 _layout.tsx - initAnalytics completed');
    }).catch((error) => {
      console.error('📊 _layout.tsx - initAnalytics failed:', error);
    });
  }, []);

  if (!fontsLoaded) return null;

  return (
    <>
      <Ionicons name="menu" size={1} color="transparent" />
      <NavigationContainer>
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
    </>
  );
};

export default RootNavigator;