import MobileMenu from '@/assets/components/MobileMenu';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderHome from '../assets/components/HeaderHome';
import { trackScreenView } from '../assets/components/analytics';

const Eggs = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      trackScreenView('eggs');
    }, [])
  );

  const handleOrderNow = () => {
    navigation.navigate('locationplaceholder'); // Make sure 'locationplaceholder' matches your route name exactly
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderHome />
      <MobileMenu />
      <ImageBackground
        source={require('../assets/images/chicken2.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Farm-Fresh Eggs</Text>
          <Text style={styles.heroSubtitle}>
            Organic. Cage-Free. Straight from our happy hens.
          </Text>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Why Our Eggs?</Text>
          <Text style={styles.descriptionText}>
            At Happy Time Ranch, our 23 chickens are raised with love and care. They roam freely
            in open spaces, enjoying natural feed, sunshine, and lots of attention. Our eggs are:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• 100% Organic – no pesticides or artificial feed</Text>
            <Text style={styles.bullet}>• Farm-Fresh – collected daily</Text>
            <Text style={styles.bullet}>• Cage-Free – hens roam in open pasture</Text>
            <Text style={styles.bullet}>• Ethically Raised – with plenty of space and care</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleOrderNow}>
            <Text style={styles.buttonText}>Find Our Eggs</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Eggs;

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  backgroundImage: { flex: 1, width: '100%', height: '100%', position: 'absolute' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  heroTextContainer: { alignItems: 'center', paddingHorizontal: 20, marginTop: 100 },
  heroTitle: { fontSize: 40, fontWeight: 'bold', color: '#FFC500', textAlign: 'center', marginTop: 100, fontFamily: 'Alegreya-VariableFont_wght' },
  heroSubtitle: { fontSize: 18, color: 'white', textAlign: 'center', marginTop: 10, marginBottom: 80, fontFamily: 'Alegreya-VariableFont_wght' },
  descriptionSection: { alignSelf: 'center', width: '90%' },
  sectionTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 20, textAlign: 'center', paddingTop: 20, fontFamily: 'Alegreya-VariableFont_wght' },
  descriptionText: { fontSize: 18, color: '#ccc', marginBottom: 20, lineHeight: 26, fontFamily: 'Alegreya-VariableFont_wght' },
  bulletList: { marginBottom: 30 },
  bullet: { color: 'white', fontSize: 16, marginBottom: 10, paddingLeft: 10, fontFamily: 'Alegreya-VariableFont_wght' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600', fontFamily: 'Alegreya-VariableFont_wght' },
});
