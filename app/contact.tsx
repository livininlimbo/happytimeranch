import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import { useForm, ValidationError } from '@formspree/react';
import HeaderHome from '@/assets/components/HeaderHome';
import MobileMenu from '@/assets/components/MobileMenu';
import Footer from '@/assets/components/footer';

const Contact = () => {
  const [state, handleSubmit] = useForm("mgvlvoro");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

const onSubmit = async () => {
  if (!name || !email || !message) {
    Alert.alert("Error", "Please fill out all fields.");
    return;
  }

  const formattedBody = `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`;

  // Only submit the body field
  await handleSubmit({
    body: formattedBody,
  });

  if (state.succeeded) {
    Alert.alert("Success", "Your message has been sent!");
    setName("");
    setEmail("");
    setMessage("");
  }
};


  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../assets/images/flower2.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <MobileMenu />
        <HeaderHome />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Contact Us</Text>

            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="#000"
              value={name}
              onChangeText={setName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Your Email"
              placeholderTextColor="#000"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <ValidationError prefix="Email" field="email" errors={state.errors} />

            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Your Message"
              placeholderTextColor="#000"
              multiline
              numberOfLines={5}
              value={message}
              onChangeText={setMessage}
            />
            <ValidationError prefix="Message" field="message" errors={state.errors} />
            <Text style={styles.warningText}>
              *Please double-check that you typed your email correctly or we won't be able to respond!*
            </Text>

            <TouchableOpacity
              style={[styles.submitButton, state.submitting && { opacity: 0.8 }]}
              onPress={onSubmit}
              disabled={state.submitting}
            >
              <Text style={styles.submitButtonText}>
                {state.submitting ? "Sending..." : "Send Message"}
              </Text>
            </TouchableOpacity>

            {state.succeeded && (
              <Text style={styles.successMsg}>✅ Thanks, we’ll be in touch soon!</Text>
            )}
          </View>
                {/* <Footer /> */}

        </ScrollView>
      </ImageBackground>

    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 80,
  },
  formContainer: {
    paddingVertical: 80,
    paddingHorizontal: 30,
    justifyContent: 'center',
    width: '85%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFC500',
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
    paddingBottom: 40,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '700',
    borderWidth: 3,
    borderColor: '#4CAF5010',
    zIndex: 200,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Alegreya-VariableFont_wght',
  },
    warningText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    zIndex: 100,
    fontFamily: 'Alegreya-VariableFont_wght',
  },
  successMsg: {
    marginTop: 15,
    color: "#4CAF50",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Contact;
