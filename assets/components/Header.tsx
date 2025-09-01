import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import BackToHome from './BackToHome';
import CartIcon from './CartIcon';

const SCREEN_WIDTH = Dimensions.get('window').width;
const isSmallScreen = SCREEN_WIDTH < 500;

const Header = () => {
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  const navigateAndClose = (route: string) => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setMenuOpen(false);
      navigation.navigate(route);
    });
  };

  return (
    <View style={styles.headerContainer}>
      {/* Logo + Hamburger */}
      <View style={styles.topRow}>
  {isSmallScreen && (
    <>
  <TouchableOpacity onPress={() => navigation.navigate('products')}>
<BackToHome/>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerIcon}>
        <Ionicons name={menuOpen ? 'close' : 'menu'} size={30} color="white" />
      </TouchableOpacity>
    </>
  )}
</View>

      {/* Full horizontal menu for large screens */}
      {!isSmallScreen && (
        <View style={styles.desktopMenu}>

  <TouchableOpacity onPress={() => navigation.navigate('products')}>
<BackToHome/>
      </TouchableOpacity>
  <TouchableOpacity onPress={() => navigation.navigate('products')} style={styles.menuItem}>
    <Text style={styles.menuItemText}>Our Products</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => navigation.navigate('ourfarm')} style={styles.menuItem}>
    <Text style={styles.menuItemText}>Our Farm</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => navigation.navigate('ourteam')} style={styles.menuItem}>
    <Text style={styles.menuItemText}>Our Team</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.contactButton} onPress={() => navigation.navigate('contact')}>
    <Text style={styles.contactButtonText}>Contact Us</Text>
  </TouchableOpacity>
  <CartIcon />
</View>
      )}

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <Pressable style={styles.backdrop} onPress={toggleMenu}>
          <Animated.View
            style={[
              styles.drawerMenu,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity onPress={() => navigateAndClose('products')} style={styles.drawerItem}>
              <Text style={styles.menuItemText}>Our Products</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateAndClose('ourfarm')} style={styles.drawerItem}>
              <Text style={styles.menuItemText}>Our Farm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateAndClose('ourteam')} style={styles.drawerItem}>
              <Text style={styles.menuItemText}>Our Team</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateAndClose('contact')} style={styles.drawerItem}>
              <Text style={styles.contactButtonText}>Contact Us</Text>
            </TouchableOpacity>
          </Animated.View>
          
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: '85%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'center',
    zIndex: 20,
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 110,
    height: 60,
  },
  hamburgerIcon: {
    padding: 8,
  },
  desktopMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    gap: 106,
  },
  menuItem: {
    marginHorizontal: 8,
  },
  menuItemText: {
    color: 'white',
    fontSize: 18,
  },
  contactButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 30,
  },
  drawerMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: '70%',
    backgroundColor: '#1c1c1e',
    paddingTop: 80,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    gap: 24,
  },
  drawerItem: {
    paddingVertical: 10,
  },
});

export default Header;


