import HeaderHome from '@/assets/components/HeaderHome';
import MobileMenu from '@/assets/components/MobileMenu';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { trackScreenView } from '../assets/components/analytics';

const SCREEN_WIDTH = Dimensions.get('window').width;
const isSmallScreen = SCREEN_WIDTH < 768;

const LocationPage = () => {
  useFocusEffect(
    React.useCallback(() => {
      trackScreenView('locationplaceholder');
    }, [])
  );

  return (
    <View style={styles.root}>
      <HeaderHome />
      <MobileMenu />

      {/* Hero background */}
      <ImageBackground
        source={require('../assets/images/grape.jpg')} // Replace with a nice hero image
        style={styles.heroBackground}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Hero Text */}
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Find Us In Person</Text>
          <Text style={styles.heroSubtitle}>
            Your favorite Happy Time Ranch products are closer than you think!
          </Text>
        </View>

        {/* Map Section */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Our Locations</Text>
          <Text style={styles.sectionText}>
            Our products will be available for local pickup in Auburn, CA very soon!

          </Text>

          {/* <Image
            source={require('../assets/images/location.png')} // Replace with your static map image
            style={styles.mapImage}
            resizeMode="cover"
          /> */}
        </View>

        {/* Location Details */}
        {/* <View style={styles.featureSection}>
          <Text style={styles.sectionTitle}>Where to Buy</Text>
          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Downtown Farmers Market</Text>
              <Text style={styles.featureDescription}>
                Saturdays, 8am - 2pm • Main Street, Springfield
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Green Valley Grocery</Text>
              <Text style={styles.featureDescription}>
                123 Green Rd, Springfield
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Pop-up Events</Text>
              <Text style={styles.featureDescription}>
                Follow us on social media for upcoming pop-up locations!
              </Text>
            </View>
          </View>
        </View> */}
      </ScrollView>
    </View>
  );
};

export default LocationPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flexGrow: 1,
  },
  heroBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
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
    marginTop: 100,
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
  mapImage: {
    width: isSmallScreen ? '100%' : '80%',
    height: 300,
    borderRadius: 10,
    marginBottom: 30,
  },
  featureSection: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    marginTop: 40,
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
