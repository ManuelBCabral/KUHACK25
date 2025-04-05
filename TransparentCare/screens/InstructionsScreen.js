import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function InstructionsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Illustration using your custom logo */}
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to TransparentCare</Text>
        <Text style={styles.subtitle}>Your Path to Transparent Medical Bills</Text>
      </View>

      {/* Instruction Cards */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Icon name="camera-outline" size={40} color="#4CBE6C" />
          <Text style={styles.cardTitle}>Take a Photo</Text>
          <Text style={styles.cardText}>
            Align your receipt within the frame and snap a photo.
          </Text>
        </View>

        <View style={styles.card}>
          <Icon name="images-outline" size={40} color="#4CBE6C" />
          <Text style={styles.cardTitle}>Upload Image</Text>
          <Text style={styles.cardText}>
            Choose a receipt from your gallery to get started.
          </Text>
        </View>

        <View style={styles.card}>
          <Icon name="document-text-outline" size={40} color="#4CBE6C" />
          <Text style={styles.cardTitle}>View Analysis</Text>
          <Text style={styles.cardText}>
            Our AI breaks down your receipt line-by-line.
          </Text>
        </View>

        <View style={styles.card}>
          <Icon name="help-circle-outline" size={40} color="#4CBE6C" />
          <Text style={styles.cardTitle}>Dispute Tips</Text>
          <Text style={styles.cardText}>
            Learn how to challenge unfair charges effectively.
          </Text>
        </View>
      </View>

      {/* Spacer to ensure scrolling */}
      <View style={styles.spacer} />

      {/* Instruction to swipe */}
      <View style={styles.swipeContainer}>
        <Text style={styles.swipeText}>Swipe left to get started</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    paddingBottom: 80, // Increased bottom padding
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cardContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  spacer: {
    height: 50, // Extra space before swipe instruction
  },
  swipeContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  swipeText: {
    fontSize: 18,
    color: '#4CBE6C',
    fontWeight: '600',
    textAlign: 'center',
  },
});