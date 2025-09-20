import MobileMenu from '@/assets/components/MobileMenu';
import Footer from '@/assets/components/footer';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import React, { memo } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { trackScreenView } from '../assets/components/analytics';

// ✅ Memoized Product Card
const ProductCard = memo(({ item, isSmallScreen, onPress }: any) => (
  <View
    style={[
      styles.categoryCard,
      isSmallScreen && styles.categoryCardSmall,
    ]}
  >
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Image
        source={item.image}
        style={styles.categoryImage}
        contentFit="cover"
        transition={300} // smooth fade-in
        cachePolicy="disk" // aggressive caching
      />
      <Text style={styles.categoryText}>{item.title}</Text>
    </TouchableOpacity>
  </View>
));

const Index = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  useFocusEffect(
    React.useCallback(() => {
      trackScreenView('home');
    }, [])
  );

  // ✅ Use static requires (good for caching and bundling)
  const products = [
    { title: 'Bath Products', image: require('../assets/images/soap3.jpg'), route: 'soaps' },
    { title: 'Candles', image: require('../assets/images/candle.jpg'), route: 'candles' },
    { title: 'Flowers', image: require('../assets/images/flower3.jpg'), route: 'flowers' },
    { title: 'Eggs', image: require('../assets/images/egg3.jpg'), route: 'eggs' },
  ];

  return (
    <View style={styles.container}>
      <MobileMenu />

      <ImageBackground
        source={require('../assets/images/homepage.jpg')}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.divider2} />

        {/* Company Overview Section */}
        <View style={styles.companyOverviewContainer}>
          <Text style={styles.companyOverviewTitle}>Our Farm at a Glance</Text>
          <Text style={styles.companyOverviewText}>
            We offer fresh grown flowers, free-range eggs, small batch natural scrubs,
            body butters, cold-processed soaps, and candles.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Products Section */}
        <View style={styles.productsSectionContainer}>
          <View style={styles.categoriesContainer}>
            <Text style={styles.categoriesTitle}>Our Products</Text>
            <View
              style={[
                styles.categories,
                { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
              ]}
            >
              {products.map((item, index) => (
                <ProductCard
                  key={index}
                  item={item}
                  isSmallScreen={isSmallScreen}
                  onPress={() => navigation.navigate(item.route as never)}
                />
              ))}
            </View>
          </View>
        </View>
                  <Footer />
        
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.95,
  },
  companyOverviewContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -40,
    marginTop: 20,
  },
  companyOverviewTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  companyOverviewText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  productsSectionContainer: {
    paddingVertical: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoriesTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    // textDecorationLine: 'underline',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  categories: {
    justifyContent: 'space-around',
  },
  categoryCard: {
    backgroundColor: '#1c1c1e99',
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    elevation: 5,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  categoryCardSmall: {
    width: '48%',
    marginHorizontal: 0,
    marginBottom: 20,
    borderRadius: 30,
    overflow: 'hidden',
  },
  categoryImage: {
    width: 160,
    height: 160,
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 30,
    width: '80%',
    alignSelf: 'center',
  },
  divider2: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    marginVertical: 30,
    width: '80%',
    alignSelf: 'center',
  },
});

export default Index;
