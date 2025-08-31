import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HoverableMenuItem from './HoverableMenuItem';
import HoverableLogo from './HoverableLogo';
import CartIcon from './CartIcon';

const Header = () => {
  const navigation = useNavigation();
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription.remove();
  }, []);

  const isDesktop = screenWidth >= 768; // only show on desktop

  if (!isDesktop) return null; // hide header on small screens

    const Spacer = () => <View style={styles.verticalSpacer} />;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.desktopMenuRow}>
        {/* Logo */}
        <HoverableLogo image={require('../images/htr.png')} route="index" />

        {/* Menu Items */}
          <HoverableMenuItem label="Our Products" route="shopnow" />
                  {/* <Spacer /> */}
          <HoverableMenuItem label="Our Farm" route="ourfarm" />
                  {/* <Spacer /> */}
          <HoverableMenuItem label="Our Team" route="ourteam" />
                  {/* <Spacer /> */}
          <CartIcon />
          <HoverableMenuItem label="Contact Us" route="contact" isContact />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 20,
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignSelf: 'center',
    zIndex: 20,

  },
  desktopMenuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap', // wrap items only if needed
    gap: 5,
    justifyContent: 'space-around', // logo left, menu right
    paddingTop: 10,
  },
  desktopMenuItems: {
    flexDirection: 'row',
    flexWrap: 'wrap', // wrap if too wide
    gap: 16,
    alignItems: 'center',
    justifyContent: 'space-evenly', // logo left, menu right

  },
    verticalSpacer: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: -80,
},
});

export default Header;
