import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import HeaderHome from '../assets/components/HeaderHome';
import MobileMenu from '@/assets/components/MobileMenu';

const Flowers = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const flowers = [
    { name: 'Sunflowers', description: 'Bright, cheerful, and perfect for any season.' },
    { name: 'Lavender', description: 'Beautiful and fragrant, ideal for calming spaces.' },
    { name: 'Zinnias', description: 'Colorful and long-lasting blooms.' },
    { name: 'Dahlias', description: 'Striking and elegant in arrangements.' },
    { name: 'Snapdragons', description: 'Tall, colorful spikes adding height to bouquets.'},
    { name: 'Cosmos', description: 'Delicate and daisy-like, great for wildflower looks.' },
    { name: 'Sweet Peas', description: 'Fragrant and charming, ideal for romantic bouquets.' },
    { name: 'Black Eyed Susans', description: 'Vibrant yellow petals with dark centers, symbolizing encouragement.' },
    { name: 'Feverfew', description: 'Small, daisy-like flowers that add a touch of whimsy.'},
    { name: 'Stock', description: 'Fragrant and full, perfect for adding volume to arrangements.'},
    { name: 'Lupines', description: 'Tall, spiky flowers in a variety of colors, great for vertical interest.'}
  ];

  const handleFindBouquets = () => {
    navigation.navigate('locationplaceholder'); // Ensure "location" matches your navigator route name
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderHome />
      <MobileMenu />

      <ImageBackground
        source={require('../assets/images/flower1.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Fresh Flowers</Text>
          <Text style={styles.heroSubtitle}>Locally Grown. Seasonally Picked. Farm Fresh.</Text>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>About Our Flowers</Text>

          <Text style={styles.descriptionText}>
            Our flower offerings vary with the seasons and are always harvested at peak freshness. 
            From vibrant bouquets to fragrant herbs, we grow with care and love.
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Handpicked seasonal blooms</Text>
            <Text style={styles.bullet}>• Grown using sustainable practices</Text>
            <Text style={styles.bullet}>• Perfect for gifts, weddings, and events</Text>
            <Text style={styles.bullet}>• Arranged with care and wrapped eco-friendly</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleFindBouquets}>
            <Text style={styles.buttonText}>Find Our Bouquets</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Featured Blooms</Text>

          <View style={styles.ingredientList}>
            {flowers.map((item, index) => (
              <View key={index} style={styles.ingredientCard}>
                <Text style={styles.ingredientName}>{item.name}</Text>
                <Text style={styles.ingredientDesc}>{item.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Flowers;

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  heroTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 100,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFC500',
    textAlign: 'center',
    marginTop: 100,
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 80,
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  descriptionSection: { alignSelf: 'center', width: '90%' },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 20,
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  descriptionText: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 20,
    lineHeight: 26,
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  bulletList: { marginBottom: 30 },
  bullet: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    paddingLeft: 10,
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  button: {
    backgroundColor: '#FF69B4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  ingredientList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingBottom: 60,
  },
  ingredientCard: {
    width: '45%',
    backgroundColor: '#1c1c1e99',
    borderRadius: 12,
    marginBottom: 20,
    padding: 10,
    alignItems: 'center',
  },
  ingredientName: {
    color: '#FFC500',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  ingredientDesc: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
});
