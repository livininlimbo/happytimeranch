// FarmMapBubbles.js
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const { width: RAW_SCREEN_WIDTH, height: RAW_SCREEN_HEIGHT } = Dimensions.get('window');

const computeMapSize = () => {
  const maxMapWidth = 1600;
  const maxMapHeight = 1000;
  const screenRatio = RAW_SCREEN_WIDTH / RAW_SCREEN_HEIGHT;
  const mapRatio = maxMapWidth / maxMapHeight;

  if (screenRatio > mapRatio) {
    const height = Math.min(maxMapHeight, RAW_SCREEN_HEIGHT * 0.9);
    const width = (height * maxMapWidth) / maxMapHeight;
    return { MAP_WIDTH: Math.round(width), MAP_HEIGHT: Math.round(height) };
  } else {
    const width = Math.min(maxMapWidth, RAW_SCREEN_WIDTH * 0.95);
    const height = (width * maxMapHeight) / maxMapWidth;
    return { MAP_WIDTH: Math.round(width), MAP_HEIGHT: Math.round(height) };
  }
};

const { MAP_WIDTH, MAP_HEIGHT } = computeMapSize();
const SCREEN_WIDTH = RAW_SCREEN_WIDTH;
const SCREEN_HEIGHT = RAW_SCREEN_HEIGHT;

const MAP_IMAGE = require('../images/duck1.jpg');

const ourChickens = [
  { image: require('../images/chicken1.jpg'), name: 'Snowball', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Chicoletta', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Smoky', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Hei Hei', role: 'Chicken' },
  { image: require('../images/chicken1.jpg'), name: 'Tina', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Truffles', role: 'Chicken' },
  { image: require('../images/chicken1.jpg'), name: 'Eggberta', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Daisy', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Maisie', role: 'Chicken' },
  { image: require('../images/chicken1.jpg'), name: 'Sandy', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Gracie', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Penny', role: 'Chicken' },
  { image: require('../images/chicken1.jpg'), name: 'Henrietta', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Rosie', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Rhonda', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Lucy', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Chloe', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Cindy', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Snookie', role: 'Chicken' },
  { image: require('../images/chicken2.jpg'), name: 'Martha', role: 'Chicken' },
];

const ourDucks = [
  { image: require('../images/chicken1.jpg'), name: 'Bubbles', role: 'Duck' },
  { image: require('../images/chicken2.jpg'), name: 'Puddles', role: 'Duck' },
  { image: require('../images/chicken2.jpg'), name: 'Waddles', role: 'Duck' },
];

const ourGoats = [
  { image: require('../images/goat1.jpg'), name: 'Jameson', role: 'Goat' },
  { image: require('../images/goat1.jpg'), name: 'Brie', role: 'Goat' },
];

const ourBunnies = [
  { image: require('../images/goat1.jpg'), name: 'Oreo', role: 'Bunny' },
  { image: require('../images/goat1.jpg'), name: 'Tubby', role: 'Bunny' },
];

const leftChickens = ourChickens.slice(0, 9);
const middleChickens = ourChickens.slice(9, 14);
const rightChickens = ourChickens.slice(14);

const LEFT_GROUP = [...ourGoats, ...leftChickens];
const MIDDLE_GROUP = [...ourDucks, ...middleChickens];
const RIGHT_GROUP = [...ourBunnies, ...rightChickens];

const HOTSPOTS = [
  { id: 'left', label: 'Goat Hill', x: 0.18, y: 0.5, data: LEFT_GROUP },
  { id: 'middle', label: 'Duck Pond', x: 0.5, y: 0.4, data: MIDDLE_GROUP },
  { id: 'right', label: 'Bunny Burrow', x: 0.82, y: 0.42, data: RIGHT_GROUP },
];

const makeFloatingParams = (seed) => {
  const r = (n) => Math.abs(Math.sin(seed + n) * 1000) % 1;
  return {
    driftX: ((r(1) - 0.5) * 40) * 2,
    driftY: ((r(2) - 0.5) * 18) * 1.8,
    speed: (2000 + r(3) * 8000) * 2,
    phase: r(4) * Math.PI * 2,
    scaleAmp: 0.02 + r(5) * 0.05,
    initOffsetX: (r(6) - 0.5) * 24,
    initOffsetY: (r(7) - 0.5) * 12,
  };
};

const GROUP_FLOCK_PARAMS = {
  Chicken: {
    neighborDist: 60,
    separateDist: 30,
    maxSpeed: 0.3,
    maxForce: 0.03,
    alignmentWeight: 0.3,
    cohesionWeight: 0.1,
    separationWeight: 1.2,
    wanderStrength: 0.4,
    groupRadius: 60,
  },
  Duck: {
    neighborDist: 90,
    separateDist: 50,
    maxSpeed: 0.4,
    maxForce: 0.05,
    alignmentWeight: 0.8,
    cohesionWeight: 0.35,
    separationWeight: 1.0,
    wanderStrength: 0.1,
    groupRadius: 80,
  },
  Goat: {
    neighborDist: 80,
    separateDist: 40,
    maxSpeed: 0.25,
    maxForce: 0.02,
    alignmentWeight: 0.4,
    cohesionWeight: 0.2,
    separationWeight: 1.0,
    wanderStrength: 10,
    groupRadius: 50,
  },
  Bunny: {
    neighborDist: 70,
    separateDist: 55,
    maxSpeed: 0.2,
    maxForce: 0.2,
    alignmentWeight: 0.1,
    cohesionWeight: 0.2,
    separationWeight: 0.1,
    wanderStrength: 5,
    groupRadius: 50,
  },
};

const FarmMapBubbles = () => {
  const [focusedHotspot, setFocusedHotspot] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [appActive, setAppActive] = useState(true);

  // Shared values for map transform
  const mapScale = useSharedValue(1);
  const mapTranslateX = useSharedValue((SCREEN_WIDTH - MAP_WIDTH) / 2);
  const mapTranslateY = useSharedValue(20);

  // Compose all animal nodes with position and velocity
  const animalsMeta = useMemo(() => {
    const list = [];
    HOTSPOTS.forEach((spot) => {
      const areaRadius = 0.06;
      spot.data.forEach((d, i) => {
        const angle =
          (i / Math.max(1, spot.data.length)) * Math.PI * 2 +
          (Math.random() - 0.5) * 0.5;
        const r = areaRadius * (0.6 + (i % 3) * 0.2);
        const nx = Math.min(0.98, Math.max(0.02, spot.x + Math.cos(angle) * r));
        const ny = Math.min(0.98, Math.max(0.02, spot.y + Math.sin(angle) * r));

        const px = nx * MAP_WIDTH;
        const py = ny * MAP_HEIGHT;

        list.push({
          meta: d,
          hotspotId: spot.id,
          id: `${spot.id}-${d.name}-${i}`,
          seed: Math.random() * 10,
          px,
          py,
          originX: px,
          originY: py,
        });
      });
    });
    return list;
  }, []);

  const nodes = animalsMeta.map((m) => ({
    meta: m.meta,
    hotspotId: m.hotspotId,
    id: m.id,
    seed: m.seed,
    posX: useSharedValue(m.px),
    posY: useSharedValue(m.py),
    originX: m.originX,
    originY: m.originY,
    velX: useSharedValue((Math.random() - 0.5) * 0.5),
    velY: useSharedValue((Math.random() - 0.5) * 0.5),
    squash: useSharedValue(1),
    tilt: useSharedValue(0),
  }));

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleVisibilityChange = () => {
        setAppActive(!document.hidden);
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let rafId = null;

    const step = () => {
      if (!mounted) return;

      if (!appActive) {
        rafId = requestAnimationFrame(step);
        return;
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (focusedHotspot && a.hotspotId !== focusedHotspot) continue;

        const x = a.posX.value;
        const y = a.posY.value;
        let vx = a.velX.value;
        let vy = a.velY.value;

        const groupParams = GROUP_FLOCK_PARAMS[a.meta.role] || {
          neighborDist: 80,
          separateDist: 40,
          maxSpeed: 0.4,
          maxForce: 0.03,
          alignmentWeight: 0.6,
          cohesionWeight: 0.15,
          separationWeight: 0.9,
          wanderStrength: 0.3,
          groupRadius: 50,
        };

        let alignX = 0,
          alignY = 0,
          cohX = 0,
          cohY = 0,
          sepX = 0,
          sepY = 0;
        let count = 0;

        let collision = false;

        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const b = nodes[j];
          if (focusedHotspot && b.hotspotId !== focusedHotspot) continue;

          const dx = b.posX.value - x;
          const dy = b.posY.value - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < groupParams.neighborDist) {
            alignX += b.velX.value;
            alignY += b.velY.value;
            cohX += b.posX.value;
            cohY += b.posY.value;
            count++;
          }
          if (dist < groupParams.separateDist && dist > 0) {
            sepX += (x - b.posX.value) / dist;
            sepY += (y - b.posY.value) / dist;
            if (dist < groupParams.separateDist * 0.5) collision = true;
          }
        }

        if (count > 0) {
          alignX = alignX / count;
          alignY = alignY / count;
          alignX = (alignX - vx) * groupParams.alignmentWeight;
          alignY = (alignY - vy) * groupParams.alignmentWeight;

          cohX = cohX / count;
          cohY = cohY / count;
          cohX = (cohX - x) * 0.002 * groupParams.cohesionWeight;
          cohY = (cohY - y) * 0.002 * groupParams.cohesionWeight;
        }

        const sepForceX = sepX * groupParams.separationWeight;
        const sepForceY = sepY * groupParams.separationWeight;

        vx += alignX + cohX + sepForceX;
        vy += alignY + cohY + sepForceY;

        if (['Chicken', 'Bunny'].includes(a.meta.role)) {
          vx += (Math.random() - 0.5) * groupParams.wanderStrength;
          vy += (Math.random() - 0.5) * groupParams.wanderStrength;
        }

        let speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > groupParams.maxSpeed) {
          vx = (vx / speed) * groupParams.maxSpeed;
          vy = (vy / speed) * groupParams.maxSpeed;
        }

        const dxOrigin = a.originX - x;
        const dyOrigin = a.originY - y;
        const distOrigin = Math.sqrt(dxOrigin * dxOrigin + dyOrigin * dyOrigin);
        if (distOrigin > groupParams.groupRadius) {
          vx += (dxOrigin / distOrigin) * groupParams.maxForce * 5;
          vy += (dyOrigin / distOrigin) * groupParams.maxForce * 5;
        }

        const margin = 24;
        if (x < margin && vx < 0) vx *= -0.6;
        if (x > MAP_WIDTH - margin && vx > 0) vx *= -0.6;
        if (y < margin && vy < 0) vy *= -0.6;
        if (y > MAP_HEIGHT - margin && vy > 0) vy *= -0.6;

        a.velX.value = vx;
        a.velY.value = vy;
        a.posX.value = x + vx;
        a.posY.value = y + vy;

        if (collision) {
          a.squash.value = withTiming(0.7, { duration: 100 });
          a.tilt.value = withTiming((Math.random() - 0.5) * 15, { duration: 100 });
        } else {
          a.squash.value = withTiming(1, { duration: 300 });
          a.tilt.value = withTiming(0, { duration: 300 });
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    return () => {
      mounted = false;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [focusedHotspot, appActive]);

  // Animated map style for pan/zoom
  const mapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: mapTranslateX.value },
      { translateY: mapTranslateY.value },
      { scale: mapScale.value },
    ],
  }));

  // Zoom to hotspot center with smooth animation
  const zoomToHotspot = (spot) => {
    const zoomScale = 1.5;
    const targetTranslateX = SCREEN_WIDTH / 1.5 - spot.x * MAP_WIDTH * zoomScale;
    const targetTranslateY = SCREEN_HEIGHT / 2.5 - spot.y * MAP_HEIGHT * zoomScale;

    mapScale.value = withTiming(zoomScale, { duration: 500, easing: Easing.inOut(Easing.ease) });
    mapTranslateX.value = withTiming(targetTranslateX, { duration: 500, easing: Easing.inOut(Easing.ease) });
    mapTranslateY.value = withTiming(targetTranslateY, { duration: 500, easing: Easing.inOut(Easing.ease) });
  };

  // Reset zoom/pan to default
  const resetZoom = () => {
    mapScale.value = withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) });
    mapTranslateX.value = withTiming((SCREEN_WIDTH - MAP_WIDTH) / 2, { duration: 500, easing: Easing.inOut(Easing.ease) });
    mapTranslateY.value = withTiming(20, { duration: 500, easing: Easing.inOut(Easing.ease) });
    setFocusedHotspot(null);
  };

  // Bubble component with floating animation and press handler
  const Bubble = ({ node }) => {
    const params = useMemo(() => makeFloatingParams(node.seed), [node.seed]);

    const bob = useSharedValue(0);
    useEffect(() => {
      bob.value = withRepeat(
        withSequence(
          withTiming(1, { duration: params.speed, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: params.speed, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true
      );
    }, [bob, params.speed]);

    const dragX = useSharedValue(0);
    const dragY = useSharedValue(0);

    // Pan gesture for drag on bubble
    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        dragX.value = event.translationX;
        dragY.value = event.translationY;
      })
      .onEnd(() => {
        dragX.value = withSpring(0);
        dragY.value = withSpring(0);
      });

    const animatedStyle = useAnimatedStyle(() => {
      const floatX = params.initOffsetX + Math.sin(bob.value * Math.PI * 2 + params.phase) * params.driftX;
      const floatY = params.initOffsetY + Math.cos(bob.value * Math.PI * 2 + params.phase) * params.driftY;
      const scale = 1 + Math.sin(bob.value * Math.PI * 2) * params.scaleAmp;

      return {
        position: 'absolute',
        left: node.posX.value + floatX - 30 + dragX.value,
        top: node.posY.value + floatY - 30 + dragY.value,
        width: 60,
        height: 60,
        borderRadius: 30,
        transform: [
          { scale },
          { translateX: dragX.value },
          { translateY: dragY.value },
          { rotateZ: `${node.tilt.value}deg` },
        ],
        zIndex: 10,
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
      };
    });

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <Pressable onPress={() => setSelectedAnimal(node.meta)} style={styles.bubblePressable}>
            <Image source={node.meta.image} style={styles.bubbleImage} />
          </Pressable>
        </Animated.View>
      </GestureDetector>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tap outside overlay to reset zoom */}
      {focusedHotspot && (
        <Pressable style={StyleSheet.absoluteFill} onPress={resetZoom} />
      )}

      <Animated.View style={[styles.map, mapStyle]}>
        <Image source={MAP_IMAGE} style={styles.mapImage} />

        {/* Render all bubbles */}
        {nodes.map((node) => (
          <Bubble key={node.id} node={node} />
        ))}

        {/* Hotspot buttons */}
        {HOTSPOTS.map((spot) => {
          const left = spot.x * MAP_WIDTH - 50;
          const top = spot.y * MAP_HEIGHT - 20;

          return (
            <Pressable
              key={spot.id}
              onPress={() => {
                if (focusedHotspot === spot.id) {
                  resetZoom();
                } else {
                  setFocusedHotspot(spot.id);
                  zoomToHotspot(spot);
                }
              }}
              style={[
                styles.hotspotButton,
                focusedHotspot === spot.id && styles.hotspotButtonFocused,
                {
                  position: 'absolute',
                  left,
                  top,
                  zIndex: 20,
                },
              ]}
            >
              <Text
                style={[
                  styles.hotspotButtonText,
                  focusedHotspot === spot.id && styles.hotspotButtonTextFocused,
                ]}
              >
                {spot.label}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Animal info modal */}
      <Modal
        animationType="slide"
        transparent
        visible={!!selectedAnimal}
        onRequestClose={() => setSelectedAnimal(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedAnimal?.name}</Text>
            <Image source={selectedAnimal?.image} style={styles.modalImage} />
            <Text style={styles.modalRole}>{selectedAnimal?.role}</Text>
            <Pressable style={styles.closeButton} onPress={() => setSelectedAnimal(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', paddingBottom: 40},
  map: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    backgroundColor: '#ddd',
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  bubbleImage: {
    width: 70,
    height: 70,
    borderRadius: 30,
  },
  bubblePressable: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
  },
  hotspotButton: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 3,
  },
  hotspotButtonFocused: {
    backgroundColor: '#ff8c00',
    borderColor: '#ff6a00',
  },
  hotspotButtonText: {
    fontWeight: '600',
    color: '#333',
  },
  hotspotButtonTextFocused: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: 'white'},
  modalImage: { width: 200, height: 200, borderRadius: 16, marginBottom: 12 },
  modalRole: { fontSize: 18, marginBottom: 24, color: '#ccc'},
  closeButton: {
    backgroundColor: '#ff8c00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeButtonText: { color: 'white', fontWeight: '600', fontSize: 16 },
});

export default FarmMapBubbles;
