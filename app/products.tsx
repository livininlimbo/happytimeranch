import HeaderHome from '@/assets/components/HeaderHome';
import MobileMenu from '@/assets/components/MobileMenu';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { trackScreenView } from '../assets/components/analytics';

const SCREEN_WIDTH = Dimensions.get('window').width;
const isSmallScreen = SCREEN_WIDTH < 768;

const ProductsPage = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      trackScreenView('products');
    }, [])
  );

  const products = [
    {
      title: 'Soaps & Scrubs',
      description:
        'Handcrafted soaps and exfoliating scrubs made with natural ingredients to nourish your skin.',
      route: 'soaps',
      image: require('../assets/images/soap1.jpg'),
    },
    {
      title: 'Candles',
      description:
        'Sustainably sourced soy candles with calming essential oil blends to relax and refresh.',
      route: 'candles',
      image: require('../assets/images/flower1.jpg'),
    },
    {
      title: 'Flowers',
      description:
        'Fresh-cut seasonal flowers grown locally with love and great care.',
      route: 'flowers',
      image: require('../assets/images/flower2.jpg'),
    },
    {
      title: 'Eggs',
      description:
        'Free-range farm eggs from happy, healthy chickens raised without hormones.',
      route: 'eggs',
      image: require('../assets/images/egg1.jpg'),
    },
  ];

  return (
    <View style={styles.root}>
        <HeaderHome />
        <MobileMenu />
    <ImageBackground 
        source={require('../assets/images/flower2.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"/>
    <View style={styles.overlay} pointerEvents='none' />
    <ScrollView contentContainerStyle={styles.pageContainer}>
      <Text style={styles.headerText}>Our Products</Text>
      <View style={styles.productsContainer}>
        {products.map((item, index) => (
          <View key={index} style={styles.productCard}>
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productDescription}>{item.description}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate(item.route)}
            >
              <Text style={styles.buttonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
  pageContainer: {
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexGrow: 1,
  },
backgroundImage: {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: -1,
},
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFC500',
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
    paddingTop: 80,
    paddingBottom: 40,

  },
  productsContainer: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    gap: 24,
    marginTop: 30,

  },
  productCard: {
    backgroundColor: '#1c1c1e99',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: isSmallScreen ? '100%' : '22%',
    maxWidth: isSmallScreen ? '100%' : '23%',
  },
  image: {
  width: isSmallScreen ? 250 : 300,
  height: isSmallScreen ? 250 : 300,
    marginBottom: 12,
    borderRadius: 10,
  },
  productTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',

  },
  productDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',

  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Alegreya-VariableFont_wght',

  },
    overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});

export default ProductsPage;
