import MobileMenu from '@/assets/components/MobileMenu';
import { useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { trackScreenView } from '../assets/components/analytics';
import HeaderHome from '../assets/components/HeaderHome';
import { createCart, getCart, removeFromCart, updateCartQuantity } from './headless/storefront';

type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { title: string };
    price: { amount: string; currencyCode: string };
    image?: { url: string; altText: string };
  };
};

type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: { edges: { node: CartLine }[] };
};

const CartPage = () => {
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useFocusEffect(
    React.useCallback(() => {
      trackScreenView('cart');
    }, [])
  );

  const initCart = async () => {
    let cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null;

    try {
      setLoading(true);

      if (!cartId) {
        const newCart = await createCart();
        cartId = newCart.id;
        if (typeof window !== 'undefined') localStorage.setItem('cartId', cartId);
        setCart(newCart);
      } else {
        const existingCart = await getCart(cartId);
        setCart(existingCart);
      }
    } catch (err) {
      console.error('Error initializing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initCart();
  }, []);

  const handleQuantityChange = async (lineId: string, quantity: number) => {
    if (!cart) return;
    try {
      const updatedCart = await updateCartQuantity(cart.id, lineId, quantity);
      setCart(updatedCart);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleRemove = async (lineId: string) => {
    if (!cart) return;
    try {
      const updatedCart = await removeFromCart(cart.id, [lineId]);
      setCart(updatedCart);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleCheckout = () => {
    if (cart?.checkoutUrl) window.open(cart.checkoutUrl, '_blank');
  };

  const calculateSubtotal = () => {
    if (!cart) return '0.00';
    return cart.lines.edges
      .reduce((sum, { node }) => sum + Number(node.merchandise.price.amount) * node.quantity, 0)
      .toFixed(2);
  };

  if (!cart || loading) {
    return (
      <View style={{ flex: 1 }}>
        <HeaderHome />
        <MobileMenu />
      <View style={[styles.root, styles.center]}>
              <ImageBackground
          source={require('../assets/images/flower2.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
          <View style={styles.overlay} />
        <ActivityIndicator color="#FFC500" size={50}/>
      </View>
      </View>
    );
  }

  if (cart.lines.edges.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <HeaderHome />
        <MobileMenu />
        <View style={[styles.root, styles.center]}>
          <ImageBackground
            source={require('../assets/images/flower2.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.overlay} />
          </ImageBackground>
          <Text style={{ color: '#fff', fontSize: 20 }}>Your cart is empty.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderHome />
      <MobileMenu />

      <View style={styles.root}>
        <ImageBackground
          source={require('../assets/images/flower2.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>

        <ScrollView style={[styles.scrollContainer, { marginTop: isMobile ? 80 : 110, paddingTop: isMobile ? 30 : 80 }]}>
          <View style={[styles.flexBox, { flexDirection: isMobile ? 'column' : 'row', paddingHorizontal: isMobile ? 0 : 80  }]}>

            {/* Cart Summary on top for mobile, right for desktop */}
            {isMobile && (
              <View style={[styles.cartSummaryWrapper]}>
                <View style={styles.cartSummary}>
                  <Text style={styles.summaryTitle}>Cart Summary</Text>
                  <Text style={styles.summaryGoldText}>Items: <Text style={styles.summaryText}>{cart.totalQuantity}</Text></Text>
                  {cart.lines.edges.map(({ node }) => (
                    <Text key={node.id} style={styles.summaryText}>
                      - {node.quantity} x {node.merchandise.title ? `${node.merchandise.title} -` : ''} {node.merchandise.product.title}
                    </Text>
                  ))}
                  <Text> </Text>
                  <Text style={styles.summaryGoldText}>Subtotal: <Text style={styles.summaryText}>${calculateSubtotal()}</Text></Text>
                  <Text style={styles.summaryGoldText}>Shipping: <Text style={styles.summaryText}>Calculated at Checkout</Text></Text>
                  <Pressable style={styles.buyNowButton} onPress={handleCheckout}>
                    <Text style={styles.buyNowText}>Checkout</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Cart Items */}
            <View style={styles.flexLeft}>
              {cart.lines.edges.map(({ node }) => (
                <View key={node.id} style={styles.cartItem}>
                  <Image
                    source={{ uri: node.merchandise.image?.url || 'https://via.placeholder.com/150' }}
                    style={[
                      styles.productImage,
                      { width: isMobile ? screenWidth / 2 : screenWidth / 4, height: isMobile ? screenWidth / 2 : screenWidth / 4 },
                    ]}
                  />

                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>{node.merchandise.product.title}</Text>
                    <Text style={styles.productSubTitle}>{node.merchandise.title}</Text>
                    <Text style={styles.productPrice}>${node.merchandise.price.amount}0 {node.merchandise.price.currencyCode}</Text>

                    <View style={styles.quantityContainer}>
                      <Text style={styles.quantityLabel}>Quantity:</Text>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.qtyButton}
                          onPress={() => handleQuantityChange(node.id, Math.max(1, node.quantity - 1))}
                        >
                          <Text style={styles.qtyButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{node.quantity}</Text>
                        <TouchableOpacity
                          style={styles.qtyButton}
                          onPress={() => handleQuantityChange(node.id, node.quantity + 1)}
                        >
                          <Text style={styles.qtyButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Pressable style={styles.removeButton} onPress={() => handleRemove(node.id)}>
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            {/* Cart Summary on desktop */}
            {!isMobile && (
              <View style={[styles.cartSummaryWrapper, { position: 'sticky', top: 0, alignSelf: 'flex-start' }]}>
                <View style={styles.cartSummary}>
                  <Text style={styles.summaryTitle}>Cart Summary</Text>
                  <Text style={styles.summaryGoldText}>Items: <Text style={styles.summaryText}>{cart.totalQuantity}</Text></Text>
                  {cart.lines.edges.map(({ node }) => (
                    <Text key={node.id} style={styles.summaryText}>
                      - {node.quantity} x {node.merchandise.title ? `${node.merchandise.title} -` : ''} {node.merchandise.product.title}
                    </Text>
                  ))}
                  <Text> </Text>
                  <Text style={styles.summaryGoldText}>Subtotal: <Text style={styles.summaryText}>${calculateSubtotal()}</Text></Text>
                  <Text style={styles.summaryGoldText}>Shipping: <Text style={styles.summaryText}>Calculated at Checkout</Text></Text>
                  <Pressable style={styles.buyNowButton} onPress={handleCheckout}>
                    <Text style={styles.buyNowText}>Checkout</Text>
                  </Pressable>
                </View>
              </View>
            )}

          </View>
                    {/* <Footer/> */}

        </ScrollView>
      </View>
    </View>
  );
};

export default CartPage;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  center: { justifyContent: 'center', alignItems: 'center' },
  backgroundImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  scrollContainer: { flex: 1, paddingHorizontal: 24, paddingVertical: 60,},
  flexBox: { justifyContent: 'space-around', alignItems: 'flex-start', paddingBottom: 100 },
  flexLeft: { flex: 1, paddingTop: 50},
  cartItem: { flexDirection: 'row', marginBottom: 40, alignItems: 'flex-start' },
  productImage: { marginRight: 20, borderRadius: 12 },
  productInfo: { flex: 1 },
  productTitle: { color: '#FFC500', fontSize: 22, fontWeight: 'bold', marginBottom: 6, fontFamily: 'Alegreya-VariableFont_wght' },
  productSubTitle: { color: '#ececec', fontSize: 18, fontWeight: '300', marginBottom: 6, fontFamily: 'Alegreya-VariableFont_wght' },
  productPrice: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 12, fontFamily: 'Alegreya-VariableFont_wght' },
  quantityContainer: { marginBottom: 12 },
  quantityLabel: { color: '#ccc', fontSize: 16, marginBottom: 4, fontFamily: 'Alegreya-VariableFont_wght' },
  quantityControls: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: { borderWidth: 1, borderColor: '#FFC500', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 4 },
  qtyButtonText: { color: '#FFC500', fontSize: 18, fontWeight: 'bold', fontFamily: 'Alegreya-VariableFont_wght' },
  quantityText: { color: '#fff', fontSize: 18, fontWeight: '600', marginHorizontal: 12, fontFamily: 'Alegreya-VariableFont_wght' },
  removeButton: { marginTop: 8, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#333', borderRadius: 8, maxWidth: 100 },
  removeButtonText: { color: '#FFC500', fontWeight: 'bold', fontFamily: 'Alegreya-VariableFont_wght', textAlign: 'center' },
  cartSummaryWrapper: { flex: 1, width: '100%', marginBottom: 0, paddingTop: 50 },
  cartSummary: { padding: 24, backgroundColor: '#11111188', borderRadius: 12, },
  summaryTitle: { color: '#FFC500', fontSize: 24, fontWeight: 'bold', marginBottom: 12, fontFamily: 'Alegreya-VariableFont_wght' },
  summaryText: { color: '#fff', fontSize: 18, fontWeight: '100', marginBottom: 12, fontFamily: 'Alegreya-VariableFont_wght' },
  summaryGoldText: { color: '#eeeee2', fontSize: 18, fontWeight: '500', marginBottom: 12, fontFamily: 'Alegreya-VariableFont_wght' },
  buyNowButton: { backgroundColor: '#FFC500', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buyNowText: { color: '#000', fontWeight: 'bold', fontSize: 16, fontFamily: 'Alegreya-VariableFont_wght' },
});

