import HeaderHome from '@/assets/components/HeaderHome';
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
  <View style={[styles.categoryCard, isSmallScreen && styles.categoryCardSmall]}>
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Image
        source={item.image}
        style={styles.categoryImage}
        contentFit="cover"
        transition={300}
        cachePolicy="disk"
      />
      <Text style={styles.categoryText}>{item.title}</Text>
    </TouchableOpacity>
  </View>
));

// ✅ Static products array
const products = [
  { title: 'Bath Products', image: require('../assets/images/soap3.jpg'), route: 'soaps' },
  { title: 'Candles', image: require('../assets/images/candle.jpg'), route: 'candles' },
  { title: 'Flowers', image: require('../assets/images/flower3.jpg'), route: 'flowers' },
  { title: 'Eggs', image: require('../assets/images/egg3.jpg'), route: 'eggs' },
];

const Index = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  useFocusEffect(
    React.useCallback(() => {
      trackScreenView('home');
    }, [])
  );

  return (
    <View style={styles.container}>
      <HeaderHome />
      <MobileMenu />

      <ImageBackground
        source={require('../assets/images/homepage.jpg')}
        style={styles.heroImage}
      />
      <View style={styles.overlay} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={require('../assets/images/htr.png')}
            style={styles.heroLogo}
            contentFit="contain"
            transition={300}
          />
        </View>

        <View style={styles.divider} />

        {/* Company Overview Section */}
        <View style={styles.companyOverviewContainer}>
          <Text style={styles.companyOverviewTitle}>Our Farm at a Glance</Text>
          <Text style={styles.companyOverviewText}>
            We offer fresh grown flowers, free-range eggs, small batch natural scrubs,
          </Text>
          <Text style={styles.companyOverviewText}>
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
                {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                },
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
  container: { backgroundColor: '#000', flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  scrollContent: { paddingBottom: 60 },
  heroContainer: { width: '100%', height: 450, justifyContent: 'center', alignItems: 'center' },
  heroImage: { width: '100%', height: '100%', position: 'absolute', right: 0, opacity: 0.95 },
  heroLogo: { width: '30%', height: undefined, aspectRatio: 1.5, zIndex: 2, marginTop: 140, marginBottom: 20 },
  companyOverviewContainer: { height: 160, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  companyOverviewTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', fontFamily: 'Alegreya-VariableFont_wght' },
  companyOverviewText: { fontSize: 18, color: 'white', textAlign: 'center', fontFamily: 'Alegreya-VariableFont_wght' },
  productsSectionContainer: {paddingVertical: 40, justifyContent: 'center', alignSelf: 'center', paddingHorizontal: 120},
  categoriesContainer: {zIndex: 2,alignSelf: 'center'},
  categoriesTitle: { fontSize: 36, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 40, fontFamily: 'Alegreya-VariableFont_wght' },
  categories: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 80 },
  categoryCard: { backgroundColor: '#1c1c1e99', width: 520, height: 460, justifyContent: 'center', alignItems: 'center', borderRadius: 30, elevation: 5, marginHorizontal: 10, marginBottom: 30 },
  categoryCardSmall: { width: '48%', marginHorizontal: 0, marginBottom: 20, borderRadius: 30, overflow: 'hidden' },
  categoryImage: { width: 490, height: 400, borderRadius: 15 },
  categoryText: { fontSize: 18, fontWeight: 'bold', color: 'white', marginTop: 10, textAlign: 'center', fontFamily: 'Alegreya-VariableFont_wght' },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginVertical: 30, width: '80%', alignSelf: 'center' },
});

export default Index;
