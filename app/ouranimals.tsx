import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import HeaderHome from '@/assets/components/HeaderHome';
import MobileMenu from '@/assets/components/MobileMenu';
import FarmMapBubbles
 from '@/assets/components/FarmMap';
const SCREEN_WIDTH = Dimensions.get('window').width;
const isSmallScreen = SCREEN_WIDTH < 768;

const OurAnimalsPage = () => {
  const ourChickens = [
    { image: require('../assets/images/chicken1.jpg'), name: 'Snowball', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Chicoletta', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Smoky', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Hei Hei', role: 'Chicken' },
    { image: require('../assets/images/chicken1.jpg'), name: 'Tina', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Truffles', role: 'Chicken' },
    { image: require('../assets/images/chicken1.jpg'), name: 'Eggberta', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Daisy', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Maisie', role: 'Chicken' },
    { image: require('../assets/images/chicken1.jpg'), name: 'Sandy', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Gracie', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Penny', role: 'Chicken' },
    { image: require('../assets/images/chicken1.jpg'), name: 'Henrietta', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Rosie', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Rhonda', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Lucy', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Chloe', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Cindy', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Snookie', role: 'Chicken' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Martha', role: 'Chicken' },
  ];

  const ourDucks = [
    { image: require('../assets/images/chicken1.jpg'), name: 'Bubbles', role: 'Duck' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Puddles', role: 'Duck' },
    { image: require('../assets/images/chicken2.jpg'), name: 'Waddles', role: 'Duck' },
  ];

  const ourGoats = [
    { image: require('../assets/images/goat1.jpg'), name: 'Jameson', role: 'Goat' },
    { image: require('../assets/images/goat1.jpg'), name: 'Brie', role: 'Goat' },
  ];

  const ourBunnies = [
    { image: require('../assets/images/goat1.jpg'), name: 'Oreo', role: 'Bunny' },
    { image: require('../assets/images/goat1.jpg'), name: 'Tubby', role: 'Bunny' },
  ];

  return (
    <View style={styles.root}>
      <HeaderHome />
      <MobileMenu />

      <ImageBackground
        source={require('../assets/images/duck5.jpg')} // Hero image
        style={styles.heroBackground}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Page Hero */}
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Meet Our Animals</Text>
          <Text style={styles.heroSubtitle}>The wonderful creatures that call Happy Time Ranch home.</Text>
        </View>

      <FarmMapBubbles/>
      </ScrollView>
    </View>
  );
};

export default OurAnimalsPage;

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
    color: '#FFA500',
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Alegreya-VariableFont_wght',
    marginBottom: 20,
  },
  teamSection: {
    paddingBottom: 60,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 28,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  teamGrid: {
    flexDirection: 'row',  // horizontal layout
  flexWrap: 'nowrap',    // no wrapping so cards line up horizontally
  justifyContent: 'flex-start', // or center if you want cards centered inside scroll area
  alignItems: 'center',
  gap: 24,    
  },
  animalCard: {
    backgroundColor: '#1c1c1e99',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    width: isSmallScreen ? '100%' : '100%', // only force full width on small screens
  },
  animalHeadshot: {
    width: 160,
    height: 160,
    borderRadius: 70,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  animalName: {
    fontSize: 20,
    color: 'white',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  animalRole: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
});
