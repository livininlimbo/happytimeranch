import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { memo, useEffect, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import MobileMenu from '@/assets/components/MobileMenu';
import { trackScreenView } from '../assets/components/analytics';
import HeaderHome from '../assets/components/HeaderHome';
import { storefront } from './headless/storefront';

const { width: screenWidth } = Dimensions.get('window');
const getCardWidth = () => (screenWidth < 600 ? screenWidth - 20 : (screenWidth - 120) / 3);

const GET_PRODUCTS = `
query Products {
  products(first:30) {
    edges {
      node {
        id
        title
        handle
        tags
        priceRange {
          minVariantPrice { amount }
        }
        media(first: 1) {
          edges {
            node {
              ... on MediaImage {
                image { url altText }
              }
            }
          }
        }
      }
    }
  }
}
`;

type Product = { id: string; title: string; handle: string; media?: any; priceRange?: any; tags?: string[] };

// ✅ Memoized Product Card with Expo Image
const ProductCard = memo(({ product }: { product: Product }) => {
  const fade = useSharedValue(0);
  const router = useRouter();

  useEffect(() => {
    fade.value = withTiming(1, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  const imageUrl = product.media?.edges?.[0]?.node?.image?.url || 'https://via.placeholder.com/150';
  const displayName = product.media?.edges?.[0]?.node?.image?.altText || product.title;
  const price = product.priceRange?.minVariantPrice?.amount ? `$${product.priceRange.minVariantPrice.amount}` : '—';

  const goToProduct = () => router.push(`/products/${product.handle}`);

  return (
    <Pressable onPress={goToProduct} style={{ marginBottom: 15 }} android_ripple={{ color: '#fff2', borderless: true }}>
      <Animated.View style={[styles.productCard, animatedStyle]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.productImage}
          contentFit="cover"
          transition={300}
          cachePolicy="disk"
        />
        <View style={styles.productInfoOverlay}>
          <Text style={styles.productName}>{displayName}</Text>
          <View style={styles.productPriceContainer}>
            <Text style={styles.productPrice}>{price}0</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
});

const ShopNow = () => {
  const params = useLocalSearchParams<{ initialTab?: 'soaps' | 'scrubs' | 'candles' }>();
  const [activeTab, setActiveTab] = useState<'soaps' | 'scrubs' | 'candles'>(
    (params.initialTab as 'soaps' | 'scrubs' | 'candles') || 'soaps'
  );
  const [products, setProducts] = useState<Product[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      trackScreenView('shopnow');
    }, [])
  );

  const switchTab = (newTab: 'soaps' | 'scrubs' | 'candles') => {
    if (newTab !== activeTab) setActiveTab(newTab);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await storefront(GET_PRODUCTS);
        if (res.errors) { console.error('GraphQL errors:', res.errors); return; }
        if (!res.products?.edges) { console.error('Invalid Shopify response:', res); return; }
        setProducts(res.products.edges.map((edge: any) => edge.node));
      } catch (err) { console.error('Error fetching products:', err); }
    };
    fetchData();
  }, []);

  const displayedProducts = products.filter((product) => {
    const tags = product.tags?.map((tag: string) => tag.toLowerCase()) || [];
    if (activeTab === 'soaps') return tags.includes('soap');
    if (activeTab === 'scrubs') return tags.includes('scrubs');
    if (activeTab === 'candles') return tags.includes('candle');
    return false;
  });

  return (
    <View style={styles.root}>
      <HeaderHome />
      <MobileMenu />
      <ImageBackground
        source={require('../assets/images/flower2.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <View style={styles.tabsContainer}>
        <Pressable style={[styles.tab, activeTab === 'soaps' && styles.activeTab]} onPress={() => switchTab('soaps')}>
          <Text style={[styles.tabText, activeTab === 'soaps' && styles.activeTabText]}>Soaps</Text>
        </Pressable>
        <Pressable style={[styles.tab, activeTab === 'scrubs' && styles.activeTab]} onPress={() => switchTab('scrubs')}>
          <Text style={[styles.tabText, activeTab === 'scrubs' && styles.activeTabText]}>Scrubs & Body Butters</Text>
        </Pressable>
        <Pressable style={[styles.tab, activeTab === 'candles' && styles.activeTab]} onPress={() => switchTab('candles')}>
          <Text style={[styles.tabText, activeTab === 'candles' && styles.activeTabText]}>Candles</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.productList} contentContainerStyle={styles.productListContent}>
        {displayedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </ScrollView>
    </View>
  );
};

export default ShopNow;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  tabsContainer: { flexDirection: 'row', marginTop: 140, marginBottom: 20, borderRadius: 8, backgroundColor: '#1c1c1ebb', overflow: 'hidden', alignSelf: 'center', width: '95%' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1c1c1e99', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 2 },
  activeTab: { backgroundColor: '#FFC500' },
  tabText: { color: '#ccc', fontSize: 16, fontWeight: '600', fontFamily: 'Alegreya-VariableFont_wght', textAlign: 'center', textAlignVertical: 'center' },
  activeTabText: { color: '#000', fontWeight: 'bold', fontFamily: 'Alegreya-VariableFont_wght' },
  productList: { flex: 1, width: '100%', alignSelf: 'center' },
  productListContent: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, paddingBottom: 40 },
  productCard: { width: getCardWidth(), marginBottom: 15, borderRadius: 12, overflow: 'hidden', backgroundColor: '#1c1c1e55' },
  productImage: { width: '100%', height: 440 },
  productInfoOverlay: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  productName: { color: '#FFC500', fontSize: 18, fontWeight: 'bold', fontFamily: 'Alegreya-VariableFont_wght', paddingLeft: 11, paddingTop: 5 },
  productPriceContainer: { flexDirection: 'row', paddingLeft: 10, paddingBottom: 5 },
  productPrice: { color: '#fff', fontSize: 14, marginTop: 2, fontFamily: 'Alegreya-VariableFont_wght' },
});
