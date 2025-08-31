import React from 'react';
import { StyleSheet, View, Pressable, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

const screenWidth = Dimensions.get('screen').width;

const BackToHome: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => navigation.navigate('index')}>
        <Ionicons name="arrow-back" size={30} color="#ffffff" />
        {/* <Text style={styles.text}>Home</Text> */}
      </Pressable>
    </View>
  );
};

export default BackToHome;

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  },
  button: {
    position: 'absolute',
    top: 150,
    left: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff88',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
    width: '3%',
  },
  text: {
    marginLeft: 6,
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
    alignSelf: 'center',
  },
});
