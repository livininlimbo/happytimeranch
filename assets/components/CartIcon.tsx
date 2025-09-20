// components/CartIcon.tsx
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCartItemCount } from '../../app/headless/storefront'; // helper to get cart count

const CartIcon = () => {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const count = await getCartItemCount(); // returns number
        setCartCount(count);
      } catch (err) {
        console.error('Error fetching cart count:', err);
      }
    };

    fetchCartCount();

    // Optional: refresh cart count periodically
    const interval = setInterval(fetchCartCount, 1000); // refresh every 1s
    return () => clearInterval(interval);
  }, []);

  const handlePress = () => {
    router.push('/cart'); // navigate to Cart.tsx
  };

  const handleMouseEnter = () => {
    if (Platform.OS === 'web') {
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }).start();
    }
  };

  const handleMouseLeave = () => {
    if (Platform.OS === 'web') {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }).start();
    }
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <Ionicons name="cart-outline" size={34} color="white" style={styles.icon} />
        {cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CartIcon;

const styles = StyleSheet.create({
  container: {
    bottom: 10,
    left: -5,
    zIndex: 999,
    borderRadius: 30,
  },
  icon: {
    width: 10,
    height: 10,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -30,
    backgroundColor: '#FFC500fc',
    borderRadius: 14,
    paddingHorizontal: 2,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
