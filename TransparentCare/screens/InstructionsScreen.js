import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function InstructionsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with custom logo */}
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
            <Icon name="camera-outline" size={30} color="#4CBE6C" />
            <Text style={styles.cardTitle}>Take a Photo</Text>
            <Text style={styles.cardText}>Align your receipt and snap a photo.</Text>
          </View>
          <View style={styles.card}>
            <Icon name="images-outline" size={30} color="#4CBE6C" />
            <Text style={styles.cardTitle}>Upload Image</Text>
            <Text style={styles.cardText}>Choose a receipt from your gallery.</Text>
          </View>
          <View style={styles.card}>
            <Icon name="document-text-outline" size={30} color="#4CBE6C" />
            <Text style={styles.cardTitle}>View Analysis</Text>
            <Text style={styles.cardText}>Our AI breaks down your receipt line-by-line.</Text>
          </View>
          <View style={styles.card}>
            <Icon name="help-circle-outline" size={30} color="#4CBE6C" />
            <Text style={styles.cardTitle}>Dispute Tips</Text>
            <Text style={styles.cardText}>Learn how to challenge unfair charges.</Text>
          </View>
        </View>

        {/* Swipe instruction at bottom */}
        <View style={styles.swipeContainer}>
          <Text style={styles.swipeText}>Swipe left to get started</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  cardContainer: {
    width: '100%',
    justifyContent: 'space-evenly',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 4,
    color: '#333',
  },
  cardText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  swipeContainer: {
    marginTop: 10,
    paddingVertical: 10,
  },
  swipeText: {
    fontSize: 16,
    color: '#4CBE6C',
    fontWeight: '600',
    textAlign: 'center',
  },
});