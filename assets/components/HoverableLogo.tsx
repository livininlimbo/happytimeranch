import React, { useRef } from 'react';
import {
  Animated,
  ImageSourcePropType,
  Pressable,
  Platform,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Easing } from 'react-native';

type HoverableLogoProps = {
  image: ImageSourcePropType;
  route?: string;
  width?: number;
  height?: number;
  top?: number;
};

const HoverableLogo: React.FC<HoverableLogoProps> = ({
  image,
  route = 'index',
  width = 110,
  height = 60,
  top = -5,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const wiggleAnim = useRef(new Animated.Value(0)).current;
  const swingDirection = useRef<1 | -1>(1);
  const isHovering = useRef(false); // track hover state

  const swing = (direction: 1 | -1) => {
    if (!isHovering.current) return; // stop swinging if not hovering
    Animated.timing(wiggleAnim, {
      toValue: direction,
      duration: 1800,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: true,
    }).start(() => {
      swingDirection.current = direction * -1 as 1 | -1;
      swing(swingDirection.current);
    });
  };

  const startHoverAnimation = () => {
    isHovering.current = true;

    Animated.spring(scaleAnim, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();

    swing(1); // start right swing
  };

  const stopHoverAnimation = () => {
    isHovering.current = false;

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    // Gracefully ease back to center
    Animated.timing(wiggleAnim, {
      toValue: 0,
      duration: 100,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (route) {
      navigation.navigate(route);
    }
  };

  const rotate = wiggleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-1deg', '1deg'],
  });

  const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = {
    transform: [{ scale: scaleAnim }, { rotate }],
  };

  return (
    <Pressable
      onPress={handlePress}
      onMouseEnter={Platform.OS === 'web' ? startHoverAnimation : undefined}
      onMouseLeave={Platform.OS === 'web' ? stopHoverAnimation : undefined}
    >
      <Animated.Image
        source={image}
        style={[{ width, height, top }, animatedStyle]}
        resizeMode="contain"
      />
    </Pressable>
  );
};

export default HoverableLogo;
