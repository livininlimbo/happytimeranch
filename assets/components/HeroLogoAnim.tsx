import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ImageSourcePropType } from 'react-native';
import { Easing } from 'react-native';

type HeroLogoAnimProps = {
  source: ImageSourcePropType;
  widthPercent?: number;
  aspectRatio?: number;
};

const HeroLogoAnim: React.FC<HeroLogoAnimProps> = ({
  source,
  widthPercent = 0.3,
  aspectRatio = 1.5,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current; // start centered

  const startSwing = (direction: 1 | -1) => {
    Animated.timing(rotateAnim, {
      toValue: direction,
      duration: 3000,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: true,
    }).start(() => {
      // Flip direction each time to keep swinging forever
      startSwing(direction * -1 as 1 | -1);
    });
  };

  useEffect(() => {
    startSwing(1); // start swinging to the right
    return () => rotateAnim.stopAnimation();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-1deg', '1deg'], // wider arc
  });

  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      style={[
        styles.logo,
        {
          width: `${widthPercent * 100}%`,
          aspectRatio,
          transform: [{ rotate }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    zIndex: 2,
    marginTop: 140,
    marginBottom: 20,
  },
});

export default HeroLogoAnim;
