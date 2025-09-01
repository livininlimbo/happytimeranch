import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderHome from '../assets/components/HeaderHome';
import MobileMenu from '@/assets/components/MobileMenu';

const BathProducts = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 900;

  const soaps = [
    { name: 'Olive Oil', description: 'Moisturizing and gentle on the skin.' },
    { name: 'Shea Butter', description: 'Nourishes and softens dry skin.' },
    { name: 'Coconut Oil', description: 'Cleanses deeply with a rich lather.' },
    { name: 'Goat Milk', description: 'Rich in nutrients and gentle for sensitive skin.' },
    { name: 'Essential Oils', description: 'Adds a therapeutic scent.' },
    { name: 'Palm Oil', description: 'Creates a firm, long-lasting bar.'}
  ];

  const scrubs = [
    { name: 'Sugar', description: 'Exfoliates dead skin cells gently.' },
    { name: 'Sea Salt', description: 'Detoxifies and refreshes the skin.' },
    { name: 'Almond Oil', description: 'Moisturizes deeply after exfoliation.' },
    { name: 'Vitamin E Oil', description: 'Protects and rejuvenates the skin.' },
    { name: 'Coconut Oil', description: 'Hydrates and smooths the skin.' },
    { name: 'Essential Oils', description: 'Adds a therapeutic scent.' },

  ];

  const butters = [
    { name: 'Beef Tallow', description: 'Provides rich, long-lasting moisture.' },
    { name: 'Shea Butter', description: 'Deeply nourishing for dry skin.' },
    { name: 'Cocoa Butter', description: 'Rich in antioxidants, smooths skin tone.' },
    { name: 'Mango Butter', description: 'Light and fast-absorbing hydration.' },
    { name: 'Vitamin E Oil', description: 'Protects and rejuvenates the skin.' },
    { name: 'Essential Oils', description: 'Adds a therapeutic scent.' },

  ];

  const renderSection = (
    title: string,
    description: string,
    ingredients: any[],
    buttonText: string,
    tabKey: 'soaps' | 'scrubs' | 'candles'
  ) => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.descriptionText}>{description}</Text>

      <Text style={styles.ingredientsHeader}>Ingredients We Frequently Use</Text>

      <View style={styles.ingredientList}>
        {ingredients.map((item, index) => (
          <View key={index} style={styles.ingredientCard}>
            {item.image && <Image source={item.image} style={styles.ingredientImage} />}
            <Text style={styles.ingredientName}>{item.name}</Text>
            <Text style={styles.ingredientDesc}>{item.description}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('shopnow' as never, { initialTab: tabKey } as never)
        }
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderHome />
      <MobileMenu />
      <ImageBackground
        source={require('../assets/images/soap3.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Bath Products</Text>
          <Text style={styles.heroSubtitle}>
            Natural. Nourishing. Beautifully Scented.
          </Text>
        </View>

        {isLargeScreen ? (
          <View style={styles.sectionsRow}>
            {renderSection(
              'Soaps',
              'Each bar is lovingly handmade in small batches using only the finest natural ingredients. Our soaps nourish your skin and provide a luxurious, fragrant experience.',
              soaps,
              'Shop Soaps',
              'soaps'
            )}

            {renderSection(
              'Scrubs',
              'Our scrubs exfoliate gently, leaving your skin smooth, revitalized, and glowing. Perfect for renewing your skin’s natural radiance.',
              scrubs,
              'Shop Scrubs',
              'scrubs'
            )}

            {renderSection(
              'Body Butters',
              'Indulge in our creamy, nutrient-rich body butters that deeply hydrate and protect your skin, leaving it soft and radiant all day.',
              butters,
              'Shop Body Butters',
              'scrubs'
            )}
          </View>
        ) : (
          <View style={styles.verticalStack}>
            {renderSection(
              'Soaps',
              'Each bar is lovingly handmade in small batches using only the finest natural ingredients. Our soaps nourish your skin and provide a luxurious, fragrant experience.',
              soaps,
              'Shop Soaps',
              'soaps'
            )}
            {renderSection(
              'Scrubs',
              'Our scrubs exfoliate gently, leaving your skin smooth, revitalized, and glowing. Perfect for renewing your skin’s natural radiance.',
              scrubs,
              'Shop Scrubs',
              'scrubs'
            )}
            {renderSection(
              'Body Butters',
              'Indulge in our creamy, nutrient-rich body butters that deeply hydrate and protect your skin, leaving it soft and radiant all day.',
              butters,
              'Shop Body Butters',
              'scrubs'
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default BathProducts;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 40 },
  backgroundImage: { flex: 1, width: '100%', height: '100%', position: 'absolute' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  heroTextContainer: { alignItems: 'center', paddingHorizontal: 20, marginTop: 100 },
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
    marginBottom: 40,
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  sectionsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', gap: 20, paddingHorizontal: 16 },
  verticalStack: { flexDirection: 'column', paddingHorizontal: 16, gap: 20 },
  sectionCard: { flex: 1, backgroundColor: '#1c1c1e99', borderRadius: 16, padding: 16, marginBottom: 20, paddingBottom: 100,},
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 12, textAlign: 'center', fontFamily: 'Alegreya-VariableFont_wght' },
  descriptionText: { fontSize: 16, color: '#ccc', marginBottom: 16, lineHeight: 22, fontFamily: 'Alegreya-VariableFont_wght', textAlign: 'center' },
  ingredientsHeader: { fontSize: 18, fontWeight: 'bold', color: '#FFC500', marginBottom: 16, textAlign: 'center', fontFamily: 'Alegreya-VariableFont_wght' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignSelf: 'center', marginTop: 16, position: 'absolute', bottom: 10, },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600', fontFamily: 'Alegreya-VariableFont_wght' },
  ingredientList: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
  ingredientCard: {
    width: '45%',
    backgroundColor: '#1c1c1ecc',
    borderRadius: 12,
    marginBottom: 12,
    padding: 8,
    alignItems: 'center',
  },
  ingredientImage: { width: 80, height: 80, borderRadius: 12, marginBottom: 6, borderWidth: 1, borderColor: '#4CAF50' },
  ingredientName: { color: '#FFC500', fontSize: 16, fontWeight: 'bold', marginBottom: 2, textAlign: 'center', fontFamily: 'Alegreya-VariableFont_wght' },
  ingredientDesc: { color: '#ccc', fontSize: 12, textAlign: 'center', fontFamily: 'Alegreya-VariableFont_wght' },
});
