// Footer.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  Pressable,
  Text,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as EmailComposer from 'expo-mail-composer';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HoverableMenuItem from './HoverableMenuItem';
import HoverableLogo from './HoverableFooterLogo';

const Footer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription.remove();
  }, []);

  const isDesktop = screenWidth >= 768;

  return (
    <View style={styles.footerContainer}>
      <View style={[styles.menuRow, isDesktop ? styles.desktopRow : styles.mobileColumn]}>
        {/* Left side - Logo */}
        <HoverableLogo image={require('../images/htr.png')} route="index" />

        {/* Center menu items with spacers */}
        <View
          style={[
            styles.centerMenuRow,
            !isDesktop && { marginVertical: 12, flexWrap: 'wrap', justifyContent: 'center' },
          ]}
        >
          {isDesktop && <View style={styles.invisibleSpacer} />}
          <Text style={styles.menuText}>© {new Date().getFullYear()} Happy Time Ranch.</Text>
          {isDesktop && <View style={styles.verticalSpacer} />}
          <Text style={styles.menuText}> +1 530-339-2214 </Text>
          {isDesktop && <View style={styles.verticalSpacer} />}
          <Text style={styles.menuText}> 3340 Nancy Drive, Auburn, CA </Text>
          {/* <HoverableMenuItem label="Our Products" route="shopnow" />
          {isDesktop && <View style={styles.verticalSpacer} />}
          <HoverableMenuItem label="Our Farm" route="ourfarm" />
          {isDesktop && <View style={styles.verticalSpacer} />}
          <HoverableMenuItem label="Our Team" route="ourteam" />
          {isDesktop && <View style={styles.verticalSpacer} />}
          <HoverableMenuItem label="Contact Us" route="contact" /> */}
        </View>

        {/* Right side - Social icons */}
        <View style={styles.socialRow}>
          <AnimatedIconButton
            name="logo-instagram"
            onPress={() => Linking.openURL('https://instagram.com/happytimeranch/')}
          />
          <AnimatedIconButton
            name="logo-tiktok"
            onPress={() => Linking.openURL('https://tiktok.com/@happytimeranch/')}
          />
          <AnimatedIconButton
            name="logo-facebook"
            onPress={() => Linking.openURL('https://facebook.com/61578564143625/')}
          />
          <AnimatedIconButton
            name="mail-outline"
            onPress={async () => {
              const isAvailable = await EmailComposer.isAvailableAsync();
              if (isAvailable) {
                EmailComposer.composeAsync({
                  recipients: ['htrauburn@gmail.com'],
                  subject: '',
                });
              } else {
                alert('Email is not available on this device');
              }
            }}
          />
        </View>
      </View>
    </View>
  );
};

const AnimatedIconButton = ({ name, onPress }: { name: any; onPress: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleMouseEnter = () => {
    if (Platform.OS === 'web') {
      Animated.spring(scaleAnim, {
        toValue: 1.2,
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

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.2,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.iconButton,
        { transform: [{ scale: scaleAnim }], cursor: Platform.OS === 'web' ? 'pointer' : 'auto' },
      ]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Ionicons name={name} size={22} color="white" />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'relative',
    // bottom: 20,
    width: '90%',
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignSelf: 'center',
    zIndex: 20,
  },
  menuRow: {
    width: '100%',
    paddingHorizontal: 16,
  },
  desktopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mobileColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerMenuRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  verticalSpacer: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 6,
  },
  //   invisibleSpacer: {
  //   width: 40,
  //   height: 20,
  //   backgroundColor: 'rgba(255,255,255,0)',
  //   marginHorizontal: 6,
  // },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  iconButton: {
    marginHorizontal: 6,
  },
  menuText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Footer;
