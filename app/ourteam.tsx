import HeaderHome from '@/assets/components/HeaderHome';
import MobileMenu from '@/assets/components/MobileMenu';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { trackScreenView } from '../assets/components/analytics';

const SCREEN_WIDTH = Dimensions.get('window').width;
const isSmallScreen = SCREEN_WIDTH < 768;

const OurTeamPage = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      trackScreenView('ourteam');
    }, [])
  );

  const teamMembers = useMemo(
    () => [
      { name: 'Jennie Gardner', role: 'Founder & Head Gardener', image: require('../assets/images/team/jennie.jpg') },
      { name: 'Mike Gardner', role: 'The Muscle', image: require('../assets/images/team/mike.jpg') },
      { name: 'Emily Regan', role: 'Product Development & Marketing', image: require('../assets/images/team/emily.jpg') },
      { name: 'Caleb Regan', role: 'Farmhand & Tech Support', image: require('../assets/images/team/caleb.png') },
      { name: 'Linda Creps', role: 'Head of Security', image: require('../assets/images/team/linda.jpg') },
      { name: 'Mia Regan', role: 'Animal Lover', image: require('../assets/images/team/mia.jpg') },
    ],
    []
  );

  return (
    <View style={styles.root}>
      <HeaderHome />
      <MobileMenu />

      <Image
        source={require('../assets/images/goat4.jpg')}
        style={styles.heroBackground}
        contentFit="cover"
      />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Hero Section */}
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Meet Our Team</Text>
          <Text style={styles.heroSubtitle}>The hands and hearts behind Happy Time Ranch.</Text>
        </View>

        {/* Team Members Section */}
        <View style={styles.teamSection}>
          <View style={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.memberCard}>
                <Image source={member.image} style={styles.headshot} contentFit="cover" />
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OurTeamPage;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  container: { flexGrow: 1, paddingBottom: 80 },
  heroBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  heroTextContainer: { alignItems: 'center', paddingHorizontal: 20, marginTop: 80, paddingTop: 100 },
  heroTitle: { fontSize: 40, fontWeight: 'bold', color: '#FFC500', textAlign: 'center', fontFamily: 'Alegreya-VariableFont_wght' },
  heroSubtitle: { fontSize: 18, color: 'white', textAlign: 'center', marginTop: 10, fontFamily: 'Alegreya-VariableFont_wght' },
  teamSection: { paddingHorizontal: 20, paddingBottom: 60, marginTop: 40 },
  teamGrid: { flexDirection: isSmallScreen ? 'column' : 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 24 },
  memberCard: { backgroundColor: '#1c1c1e99', borderRadius: 12, padding: 20, alignItems: 'center', flex: 1, minWidth: isSmallScreen ? '100%' : '22%', maxWidth: isSmallScreen ? '100%' : '23%', marginBottom: 24 },
  headshot: { width: 140, height: 140, borderRadius: 70, marginBottom: 12, borderWidth: 2, borderColor: '#FFC500' },
  memberName: { fontSize: 20, color: 'white', marginBottom: 4, textAlign: 'center', fontFamily: 'Alegreya-VariableFont_wght' },
  memberRole: { fontSize: 14, color: '#ccc', textAlign: 'center', fontFamily: 'Alegreya-VariableFont_wght' },
});
