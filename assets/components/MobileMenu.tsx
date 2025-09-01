import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const HeaderMobile = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const menuItems = [
    { title: 'Home', route: 'index', icon: 'home-outline' },
    { title: 'Our Products', route: 'shopnow', icon: 'pricetags-outline' },
    { title: 'Our Farm', route: 'ourfarm', icon: 'leaf-outline' },
    { title: 'Our Team', route: 'ourteam', icon: 'people-outline' },
    { title: 'Contact Us', route: 'contact', icon: 'mail-outline' },
    { title: 'View Your Cart', route: 'cart', icon: 'cart-outline' },
  ];

  const menuAnimations = useRef(menuItems.map(() => new Animated.Value(0))).current;

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  if (!isSmallScreen) return null; // Don't render on large screens

  const openMenu = () => {
    slideAnim.setValue(SCREEN_HEIGHT);
backdropOpacity.setValue(0);
menuAnimations.forEach(anim => anim.setValue(0));

    setModalVisible(true);

    Animated.parallel([
      // Slide up menu with spring
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        stiffness: 120,
        damping: 15,
        mass: 1,
      }),
      // Fade in backdrop
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Staggered menu items fade/scale
      Animated.stagger(
        100,
        menuAnimations.map(anim =>
          Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            stiffness: 120,
            damping: 12,
            mass: 0.8,
          })
        )
      ),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      // Slide down menu
      Animated.spring(slideAnim, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        stiffness: 100,
        damping: 15,
        mass: 1,
      }),
      // Fade out backdrop
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      // Staggered menu items fade out in reverse
      Animated.stagger(
        50,
        menuAnimations
          .map(anim =>
            Animated.timing(anim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            })
          )
          .reverse()
      ),
    ]).start(() => setModalVisible(false));
  };

  const navigateAndClose = (route: string) => {
    closeMenu();
    navigation.navigate(route as never);
  };

  return (
    <>
      {/* Sticky Top Bar */}
      <BlurView style={styles.stickyBar} intensity={15} >
        <TouchableOpacity onPress={() => navigation.navigate('index')}>
          <Image source={require('../images/htr.png')} style={styles.logoHeader} />
        </TouchableOpacity>
      </BlurView>
            {/* Top Bar BG*/}
      <View style={styles.stickyBarBG}>
        <TouchableOpacity onPress={() => navigation.navigate('index')}>
          <Image source={require('../images/htr.png')} style={styles.logoHeader} />
        </TouchableOpacity>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={openMenu}>
        <Ionicons name="menu-outline" size={32} color="white" />
      </TouchableOpacity>

      {/* Slide-Up Modal Menu */}
      <Modal transparent visible={modalVisible} animationType="none">
        {/* Animated backdrop */}
        <Animated.View
          pointerEvents={modalVisible ? 'auto' : 'none'}
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(0,0,0,0.3)', opacity: backdropOpacity },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
        </Animated.View>

        {/* Animated menu */}
        <Animated.View
          style={[
            styles.modalMenu,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >

          <Image source={require('../images/htr.png')} style={styles.logo} />
          {menuItems.map((item, index) => (
            
            <Animated.View
              key={index}
              style={{
                opacity: menuAnimations[index],
                transform: [
                  {
                    translateY: menuAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                  {
                    scale: menuAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              }}
            >
      <BlurView intensity={20} tint="dark" >

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateAndClose(item.route)}
              >
                <View style={styles.menuItemContent}>
                  <Ionicons name={item.icon} size={22} color="white" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            </BlurView>

            </Animated.View>
          ))}
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  stickyBar: {
    position: 'absolute',
    backgroundColor: '#1c1c1cee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    zIndex: 30,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
    stickyBarBG: {
    position: 'absolute',
    backgroundColor: '#1c1c1cee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    zIndex: 29,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    top: 10,
    right: 30,
    backgroundColor: '#00000030',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
    elevation: 10,
  },
  modalMenu: {
    position: 'absolute',
    bottom: -40,
    width: '100%',
    backgroundColor: '#1c1c1eee',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 50,
    zIndex: 40,
        borderColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderRadius: 12,
  },
  menuItem: {
    paddingVertical: 16,
    borderColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderRadius: 12,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 12,
  },
  menuItemText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Alegreya-VariableFont_wght',
    textAlign: 'center',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    marginRight: 10,
  },
  logo: {
    height: 80,
    width: 140,
    alignSelf: 'center',
    marginBottom: 20,
  },
  logoHeader: {
    height: 60,
    width: 110,
    alignSelf: 'center',
  },
});

export default HeaderMobile;
