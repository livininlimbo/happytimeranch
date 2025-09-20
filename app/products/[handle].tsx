// ProductDetail.tsx
import MobileMenu from '@/assets/components/MobileMenu';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { trackScreenView } from '../../assets/components/analytics';
import HeaderHome from '../../assets/components/HeaderHome';
import { addToCart, storefront } from '../headless/storefront';

const MOBILE_BREAKPOINT = 768;

type Variant = {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  image?: { url: string; width?: number; height?: number };
};

type Product = {
  id: string;
  title: string;
  description?: string;
  handle: string;
  media?: { edges: { node: { image: { url: string; width?: number; height?: number } } }[] };
  priceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
  variants?: { edges: { node: Variant }[] };
};

const ProductDetail = () => {
  const { handle } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loadingAddCart, setLoadingAddCart] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (handle) {
        trackScreenView(`product-${handle}`);
      }
    }, [handle])
  );

  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  useEffect(() => {
    const id = setInterval(() => {
      const { width } = Dimensions.get('window');
      setScreenWidth((prev) => (prev !== width ? width : prev));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const isMobile = screenWidth < MOBILE_BREAKPOINT;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      try {
        const query = `
          query ProductByHandle {
            productByHandle(handle: "${handle}") {
              id
              title
              description
              handle
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price { amount currencyCode }
                    image { url width height }
                  }
                }
              }
              media(first: 5) {
                edges {
                  node {
                    ... on MediaImage {
                      image { url width height }
                    }
                  }
                }
              }
              priceRange { minVariantPrice { amount currencyCode } }
            }
          }
        `;
        const res = await storefront(query);
        if (!res?.productByHandle) return;

        const fetchedProduct = res.productByHandle;
        setProduct(fetchedProduct);
        if (fetchedProduct.variants?.edges?.length) {
          setSelectedVariant(fetchedProduct.variants.edges[0].node);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [handle]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setLoadingAddCart(true);
    try {
      await addToCart(selectedVariant.id, quantity, false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAddCart(false);
    }
  };

  if (!product) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  // Determine which image to display: variant first, then main product
  const displayedImage =
    selectedVariant?.image?.url ||
    product.media?.edges?.[0]?.node?.image?.url ||
    'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';

  const aspectRatio =
    selectedVariant?.image?.width && selectedVariant?.image?.height
      ? selectedVariant.image.width / selectedVariant.image.height
      : product.media?.edges?.[0]?.node?.image?.width &&
        product.media?.edges?.[0]?.node?.image?.height
      ? product.media.edges[0].node.image.width / product.media.edges[0].node.image.height
      : 1;

  return (
    <View style={styles.root}>
      <HeaderHome />
      <MobileMenu />
      <ImageBackground
        source={require('../../assets/images/flower2.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <ScrollView
        style={[styles.scrollContainer, isMobile && styles.scrollContainerMobile]}
      >
        <View style={[styles.flexBox, { flexDirection: isMobile ? 'column' : 'row', marginVertical: isMobile ? 80 : 0 }]}>
          <View style={styles.imageContainer}>
            <View style={[styles.flexLeft, isMobile && { marginRight: 0 }]}>
              <Image
                source={{ uri: displayedImage }}
                style={[
                  styles.productImage,
                  {
                    width: isMobile ? screenWidth - 80 : screenWidth / 3,
                    height: isMobile ? undefined : screenWidth / 3,
                    aspectRatio: 1,
                    alignSelf: 'center',
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.flexRight}>
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{product.title}</Text>
              <View style={styles.productPriceContainer}>
                <Text style={styles.productPrice}>
                  ${selectedVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount || '—'}0
                </Text>
              </View>

              {/* Variant Selector */}
              {!!product.variants?.edges?.length && (
                <View style={styles.variantSelector}>
                  <Text style={styles.variantLabel}>Select Variant:</Text>
                  <View style={styles.variantOptions}>
                    {product.variants.edges.map(({ node }) => (
                      <TouchableOpacity
                        key={node.id}
                        style={[
                          styles.variantButton,
                          selectedVariant?.id === node.id && styles.variantButtonActive,
                        ]}
                        onPress={() => setSelectedVariant(node)}
                      >
                        <Text
                          style={[
                            styles.variantButtonText,
                            selectedVariant?.id === node.id && styles.variantButtonTextActive,
                          ]}
                        >
                          {node.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Quantity Selector */}
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantity:</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Text style={styles.qtyButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => setQuantity(quantity + 1)}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Description */}
              <View style={styles.descriptionSection}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
              </View>

              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.buyNowButton, { marginRight: 12 }]}
                  onPress={handleAddToCart}
                  disabled={loadingAddCart}
                >
                  {loadingAddCart ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.buyNowText}>Add to Cart</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetail;

// styles remain the same as your current component


const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  center: { justifyContent: 'center', alignItems: 'center' },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  // default (desktop/tablet) generous padding
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 100,
    paddingVertical: 240,
  },
  // mobile: shrink padding substantially
  scrollContainerMobile: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },

  imageContainer: { flex: 1, alignItems: 'center', padding: 20 },

  // keep image styles minimal; size is set inline based on layout
  productImage: {
    alignSelf: 'center',
    borderRadius: 22,
  },

  productInfo: { paddingHorizontal: 24, paddingVertical: 20 },
  productTitle: {
    color: '#FFC500',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPriceContainer: { marginBottom: 20, flexDirection: 'row' },
  productPrice: { color: '#fff', fontSize: 22, fontWeight: '600' },

  variantSelector: { marginBottom: 20 },
  variantLabel: { color: '#ccc', fontSize: 16, marginBottom: 8 },
  variantOptions: { flexDirection: 'row', flexWrap: 'wrap' },
  variantButton: {
    borderWidth: 1,
    borderColor: '#FFC500',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  variantButtonActive: { backgroundColor: '#FFC500' },
  variantButtonText: { color: '#FFC500', fontWeight: '600' },
  variantButtonTextActive: { color: '#000' },

  quantityContainer: { marginBottom: 20 },
  quantityLabel: { color: '#ccc', fontSize: 16, marginBottom: 8 },
  quantityControls: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: {
    borderWidth: 1,
    borderColor: '#FFC500',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  qtyButtonText: { color: '#FFC500', fontSize: 18, fontWeight: 'bold' },
  quantityText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 12,
  },

  descriptionSection: { marginBottom: 30 },
  descriptionTitle: {
    color: '#FFC500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productDescription: { color: '#ccc', fontSize: 16, lineHeight: 24 },

  buyNowButton: {
    backgroundColor: '#FFC500',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  buyNowText: { color: '#000', fontWeight: 'bold', fontSize: 16 },

  flexBox: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  flexLeft: { flex: 1, marginRight: 20,},
  flexRight: { flex: 1.5,},
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
});
