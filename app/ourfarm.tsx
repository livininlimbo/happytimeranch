import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import HeaderHome from '@/assets/components/HeaderHome';
import MobileMenu from '@/assets/components/MobileMenu';

const SCREEN_WIDTH = Dimensions.get('window').width;
const isSmallScreen = SCREEN_WIDTH < 768;

const OurFarmPage = () => {
  const farmFeatures = useMemo(
    () => [
      {
        title: 'Chickens & Ducks',
        description:
          'Our chickens and ducks roam freely on open pastures, producing farm-fresh eggs while living happy, healthy lives.',
        image: require('../assets/images/duck2.jpg'),
      },
      {
        title: 'Goats & Bunnies',
        description:
          'Our goats and bunnies are raised with love and care, enjoying spacious pastures and an all organic diet.',
        image: require('../assets/images/goat1.jpg'),
      },
      {
        title: 'Organic Produce Garden',
        description:
          'We grow a variety of seasonal vegetables and herbs using sustainable, chemical-free practices for peak freshness.',
        image: require('../assets/images/produce.jpg'),
      },
      {
        title: 'Organic Flower Farm',
        description:
          'Our flower farm grows a wide variety of beautiful, pesticide-free blooms for bouquets and events.',
        image: require('../assets/images/flower2.jpg'),
      },
    ],
    []
  );

  const bulletPoints = useMemo(
    () => [
      'Regenerative agriculture methods',
      'Ethical treatment of all animals',
      'No synthetic fertilizers or pesticides',
      'Locally sourced and seasonal produce',
    ],
    []
  );

  return (
    <View style={styles.root}>
      <HeaderHome />
      <MobileMenu />
      <Image
        source={require('../assets/images/duck4.jpg')}
        style={styles.heroBackground}
        contentFit="cover"
      />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Hero Section */}
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Welcome to Happy Time Ranch</Text>
          <Text style={styles.heroSubtitle}>Rooted in nature. Grown with care.</Text>
        </View>

        {/* About Section */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Our Philosophy</Text>
          <Text style={styles.sectionText}>
            At Happy Time Ranch, our mission is to foster harmony between people, animals, and the land.
            Every choice we make—from the feed we use to how we manage waste—is made with sustainability,
            compassion, and quality in mind.
          </Text>

          <View style={styles.bulletList}>
            {bulletPoints.map((bullet, index) => (
              <Text key={index} style={styles.bullet}>• {bullet}</Text>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featureSection}>
          <Text style={styles.sectionTitle}>What Makes Us Different</Text>
          <View style={styles.featureGrid}>
            {farmFeatures.map((item, index) => (
              <View key={index} style={styles.featureCard}>
                <Image source={item.image} style={styles.featureImage} contentFit="cover" />
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDescription}>{item.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OurFarmPage;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  container: { flexGrow: 1 },
  heroBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  heroTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 80,
    paddingTop: 100,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFC500',
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  contentSection: {
    padding: 20,
    alignItems: 'center',
    marginTop: 60,
    width: '80%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 28,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  sectionText: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 20,
    lineHeight: 26,
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  bulletList: { paddingTop: 40, marginBottom: 0 },
  bullet: { color: 'white', fontSize: 16, marginBottom: 10, paddingLeft: 10, fontFamily: 'Alegreya-VariableFont_wght' },
  featureSection: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    marginTop: 80,
  },
  featureGrid: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 24,
  },
  featureCard: {
    backgroundColor: '#1c1c1e99',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: isSmallScreen ? '100%' : '22%',
    maxWidth: isSmallScreen ? '100%' : '23%',
    marginBottom: 24,
  },
  featureImage: { width: 300, height: 300, marginBottom: 12, borderRadius: 10 },
  featureTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  featureDescription: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
});
