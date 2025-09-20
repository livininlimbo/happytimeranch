
import MobileMenu from '@/assets/components/MobileMenu';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { trackScreenView } from '../assets/components/analytics';
import HeaderHome from '../assets/components/HeaderHome';

const Candles = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      trackScreenView('candles');
    }, [])
  );

  const features = [
    { name: 'Soy Wax or Beeswax', description: 'Clean-burning and eco-friendly.' },
    { name: 'Essential Oils', description: 'Fragrant and therapeutic blends.' },
    { name: 'Handmade in Small Batches', description: 'Each candle is made with love.' },
    { name: 'Reusable Jars', description: 'Eco-conscious and stylish containers.' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <HeaderHome />
      <MobileMenu />
      <ImageBackground
        source={require('../assets/images/candle.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Artisan Candles</Text>
          <Text style={styles.heroSubtitle}>Hand-poured. Scented Naturally. Designed for Calm.</Text>
        </View>
                  <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>What's Inside?</Text>
          <Text style={styles.descriptionText}>
            Our candles are thoughtfully hand-poured using eco-friendly wax and carefully selected scents to create a calming, aromatic ambiance in your space.
          </Text>
                  <View style={styles.ingredientList}>

            {features.map((item, index) => (
              <View key={index} style={styles.ingredientCard}>
                {/* <Image source={item.image} style={styles.ingredientImage} /> */}
                <Text style={styles.ingredientName}>{item.name}</Text>
                <Text style={styles.ingredientDesc}>{item.description}</Text>
              </View>
            ))}
          </View>



          {/* Navigate to ShopNow with candles tab active */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('shopnow' as never, { initialTab: 'candles' } as never)}
          >
            <Text style={styles.buttonText}>Shop Candles</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

export default Candles;

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  backgroundImage: { flex: 1, width: '100%', height: '100%', position: 'absolute' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  heroTextContainer: { alignItems: 'center', paddingHorizontal: 20, marginTop: 100 },
  heroTitle: { fontSize: 40, fontWeight: 'bold', color: '#FFC500', textAlign: 'center', marginTop: 100, fontFamily: 'Alegreya-VariableFont_wght' },
  heroSubtitle: { fontSize: 18, color: 'white', textAlign: 'center', marginTop: 10, marginBottom: 80, fontFamily: 'Alegreya-VariableFont_wght' },
  descriptionSection: { alignSelf: 'center', width: '90%' },
  sectionTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 20, textAlign: 'center', paddingTop: 20, fontFamily: 'Alegreya-VariableFont_wght' },
  descriptionText: { fontSize: 18, color: '#ccc', marginBottom: 20, lineHeight: 26, fontFamily: 'Alegreya-VariableFont_wght' },
  bulletList: { marginBottom: 30 },
  bullet: { color: 'white', fontSize: 16, marginBottom: 10, paddingLeft: 10, fontFamily: 'Alegreya-VariableFont_wght' },
  button: { backgroundColor: '#FFC500', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 10, alignSelf: 'center', marginBottom: 40 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600', fontFamily: 'Alegreya-VariableFont_wght' },
  ingredientList: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingBottom: 60 },
  ingredientCard: { width: '45%', backgroundColor: '#1c1c1e99', borderRadius: 12, marginBottom: 20, padding: 10, alignItems: 'center' },
  ingredientImage: { width: 100, height: 100, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#FFC500' },
  ingredientName: { color: '#FFC500', fontSize: 18, fontWeight: 'bold', marginBottom: 4, textAlign: 'center', fontFamily: 'Alegreya-VariableFont_wght' },
  ingredientDesc: { color: '#ccc', fontSize: 14, textAlign: 'center', fontFamily: 'Alegreya-VariableFont_wght' },
});
