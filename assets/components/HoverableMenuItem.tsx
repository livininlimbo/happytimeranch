import React, { useState, useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HoverableMenuItemProps = {
  label: string;
  route: string;
  isContact?: boolean;
};

const HoverableMenuItem: React.FC<HoverableMenuItemProps> = ({
  label,
  route,
  isContact = false,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  const handlePress = () => {
    navigation.navigate(route);
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Pressable
        onPress={handlePress}
        style={isContact ? styles.contactButton : styles.menuItem}
      >
        <Text style={isContact ? styles.contactButtonText : styles.menuItemText}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    marginHorizontal: 8,
  },
  menuItemText: {
    fontSize: 18,
    fontFamily: 'Alegreya-VariableFont_wght',
    color: 'white',
  },
  contactButton: {
    backgroundColor: '#FFC500',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: 'Alegreya-VariableFont_wght',
    color: 'white',
  },
});

export default HoverableMenuItem;
